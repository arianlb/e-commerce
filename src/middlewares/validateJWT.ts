import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from "jsonwebtoken";

import User from "../models/user";

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid }:any = jsonwebtoken.verify(token, process.env.JWT_SECRET || 'aiDASDf498yrbfa6sffTSaos8yr821rfv');
        const user = await User.findById(uid);
        if (!user) {
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }

        req.query.authUserId = uid;
        req.query.authUserRoles = user.roles;


        next();

    } catch (error: any) {
        res.status(401).json({ msg: 'Token no válido' });
    }
}