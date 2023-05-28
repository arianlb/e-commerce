import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";

import User from "../models/user";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit = 10, from = 0 } = req.query;
        
        const [total, users] = await Promise.all([
            User.countDocuments(),
            User.find().skip(Number(from)).limit(Number(limit)),
        ]);

        res.json({
            total,
            users,
        });

    } catch (error: any) {
        next(error);
    }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'No existe el usuario con el id: ' + req.params.id });
        }

        res.json(user);

    } catch (error: any) {
        next(error);
    }
}

export const postUser = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const { name, email, password, roles } = req.body;
        const encryptedPassword = bcryptjs.hashSync(password, bcryptjs.genSaltSync());
        const user = new User({ name, email, password: encryptedPassword, roles });
        await user.save();
        res.status(201).json(user);

    } catch (error: any) {
        next(error);
    }
}

export const putUser = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const { _id, password, ...rest } = req.body;
        if (password) {
            const encryptedPassword = bcryptjs.hashSync(password, bcryptjs.genSaltSync());
            rest.password = encryptedPassword;
        }
        const user = await User.findByIdAndUpdate(req.params.id, rest, { returnDocument: 'after' });
        res.json(user);

    } catch (error: any) {
        next(error);
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).json({ msg: 'Usuario eliminado' });

    } catch (error: any) {
        next(error);
    }
}