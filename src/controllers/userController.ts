import { Request, Response } from "express";
import bcryptjs from "bcryptjs";

import User from "../models/user";

export const getUsers = async (req: Request, res: Response) => {
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
        res.status(500).json({ msg: error.message });
    }
}

export const getUser = async (req: Request, res: Response) => { 
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'No existe el usuario con el id: ' + req.params.id });
        }

        res.json(user);

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
}

export const postUser = async (req: Request, res: Response) => { 
    try {
        const { name, email, password, roles } = req.body;
        const encryptedPassword = bcryptjs.hashSync(password, bcryptjs.genSaltSync());
        const user = new User({ name, email, password: encryptedPassword, roles });
        await user.save();
        res.status(201).json(user);

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
}

export const putUser = async (req: Request, res: Response) => { 
    try {
        const { _id, password, ...rest } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true });
        res.status(204).json(user);

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteUser = async (req: Request, res: Response) => { 
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).json({ msg: 'Usuario eliminado' });

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
}