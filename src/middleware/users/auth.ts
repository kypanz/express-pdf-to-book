import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { model_user } from "../../models/database";
import encryption from "../../utils/encryption";

export function authPassport(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', (err: any, user: any) => {
        if (err) {
            return res.status(400).json({ message: 'Error on authentication' });
        }

        if (!user) {
            return res.status(400).json({ message: 'Wrong username or password' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error on log in' });
            }
            next();
        });
    })(req, res, next);
}

export function checkAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
        return res.status(400).json({ message: 'no authorized' });
    }
    next();
}

export async function checkAuthAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
        return res.status(400).json({ message: 'no authorized' });
    }
    const user = await model_user.findById((req.user as any)._id);
    if (!user) {
        return res.status(400).json({ message: 'user not exist' });
    }
    if (user.role != 'admin') {
        return res.status(400).json({ message: 'you are not admin' });
    }
    next();
}

export async function checkMasterKey(req: Request, res: Response, next: NextFunction) {
    if (!(req.session as any).master_key) return res.status(400).json({ message: 'please set a masterkey' });
    next();
}

export async function decryptWallet(priv_key_encrypted: string, master_key: string) {
    const [iv, key] = master_key.split('-');
    const decrypted = encryption.decryptSymmetricMessage(key,iv, priv_key_encrypted);
    return decrypted;
}
