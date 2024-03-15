import { Request, Response, NextFunction } from "express";
import { model_user } from "../../models/database";
import { IUser } from "../../models/database";
import { sendEmail } from "../../utils/emails";
import crypto from 'crypto';
import dotenv from 'dotenv';

// env variables
dotenv.config();
const { EMAIL_ENABLED, URL_FRONTEND } = process.env;

interface IUserFind extends IUser {
    save: () => void;
}

export async function restorePassword(req: Request, res: Response, next: NextFunction) {
    try {
        const token = crypto.randomBytes(20).toString('hex');
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1); // El token expirará en 1 hora
        const user: IUserFind | null = await model_user.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'error on forgot password' });
        }
        await user.save();
        if (EMAIL_ENABLED == 'true') {
            sendEmail({
                to: user.email,
                subject: 'Restore Password',
                text: `para completar el proceso:\n\n${req.protocol}://${URL_FRONTEND}/reset/${token}\n\nEste enlace expirará en 1 hora. Si no solicitaste el restablecimiento de contraseña, ignora este correo y tu contraseña seguirá siendo segura.`
            });
        }
        (req as any).tokenRestore = token;
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'error on restore password' });
    }
}


export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const user: IUserFind | null = await model_user.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'error on reset password' });
        }

        await (user as any).setPassword(req.body.password);
        await user.save();
        req.login(user, (err) => {
            if (err) throw err;
            next();
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'error on reset' });
    }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await model_user.findById((req as any).user._id);
        if (!user) {
            return res.status(400).json({ message: 'error on change password' });
        }
        await (user as any).changePassword(req.body.old_password, req.body.new_password);
        await user.save();
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'error on change password' });
    }
}

export async function deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {

        // getting user info
        const user = await model_user.findById((req as any).user._id);
        if (!user) throw new Error("[ deleteAccount ] => user not fount");

        // deleting account
        await model_user.deleteOne((req as any).user._id);

        next();

    } catch (error) {
        console.log('[ delete-account ] error => ', error);
        return res.status(400).json({ message: 'no se pudo eliminar la cuenta corretamente' });
    }
}
