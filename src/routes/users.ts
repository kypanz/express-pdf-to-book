import { Router, Request, Response, NextFunction } from "express";
import { model_user } from '../models/database';
import { removeUnecesaryProperties } from "../middleware/users/others";
import { checkAuth, checkAuthAdmin, authPassport } from "../middleware/users/auth";
import { restorePassword, changePassword, resetPassword, deleteAccount } from "../middleware/users/passwords";
import { createAdmin, createResearchCenter, createRegularUser } from "../middleware/users/creation";
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// GET
router.get('/count-users', checkAuth, async (req: Request, res: Response) => {
    try {
        const reuglar = await model_user.find({ role: 'regular' });
        const research = await model_user.find({ role: 'research-center' });
        const out = { regular: reuglar.length, research: research.length };
        res.json({ message: out });
    } catch (error) {
        res.status(400).json({ message: 'no se pudo obtener le conteo de usuarios' });
    }
});

router.get('/check-session', checkAuth, (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        const user = { ...req.user };
        const doc = (user as any)._doc;
        removeUnecesaryProperties(doc);
        if (process.env.MODE_TEST == 'true') {
            return res.json({ user: doc, masterKeySelected: (req.session as any).master_key });
        }
        return res.json({ user: doc });
    }
    res.status(400).json({ message: 'No authenticated' });
});

router.get('/regular-users', checkAuth, async (req: Request, res: Response) => {
    const exclude = {
        encrypted_private_key_wallet: 0.0,
        role: 0.0,
        username: 0.0,
        rsa_priv_key: 0.0
    };
    const users = await model_user.find({ role: 'regular' }, exclude);
    res.json({ message: users });
});

router.get('/research-centers', checkAuth, async (req: Request, res: Response) => {
    const exclude = {
        encrypted_private_key_wallet: 0.0,
        role: 0.0,
        username: 0.0,
        rsa_priv_key: 0.0
    };
    const users = await model_user.find({ role: 'research-center' }, exclude);
    res.json({ message: users });
});

router.get('/get-all', checkAuth, async (req: Request, res: Response) => {
    try {
        const users = await model_user.find({});
        res.json({ message: users });
    } catch (error) {
        console.error('[ get-all | error ] => ', error);
        res.status(400).json({ message: 'error al obtener todos los usuarios' });
    }
});

// POST
router.post('/register', createRegularUser, async (req: Request, res: Response) => {
    // response in middleware
});

router.post('/register-admin', createAdmin, async (req: Request, res: Response) => {
    // response in middleware
});

router.post('/register-research-center', checkAuthAdmin, createResearchCenter, async (req: Request, res: Response) => {
    // response in middleware
});

router.post('/login', authPassport, (req: Request, res: Response) => {
    const user = { ...req.user };
    const doc = (user as any)._doc
    if (doc) {
        removeUnecesaryProperties(doc);
    }
    res.json({ user: doc });
});

router.post('/logout', checkAuth, (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) {
            return res.status(400).json({ message: 'error on logout' });
        }
    });
    res.json({ message: 'logout done' });
});

router.post('/forgot-password', restorePassword, (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: 'email sended', token: (req as any).tokenRestore });
});

router.post('/reset/:token', resetPassword, (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: 'new password restored' });
});

router.post('/change-password', checkAuth, changePassword, (req: Request, res: Response) => {
    res.json({ message: 'password changed !' });
});

router.post('/delete-account', checkAuth, deleteAccount, (req: Request, res: Response) => {
    res.json({ message: 'se elimino la cuenta correctamente' });
});

export default router;
