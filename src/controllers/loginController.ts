import { Request, Response } from "express";
import bcryptjs from "bcryptjs";

import User from '../models/user';
import { jwt } from "../helpers/generateJWT";

export const login = async (req: Request, res: Response) => { 
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {

            //Codigo solo de prueba para crear un usuario al iniciar la bd por primera vez
            if (email === 'superuser@admin.com' && password === 'superuser') { 
                user = new User({
                    name: 'Super User',
                    email: 'superuser@admin.com',
                    password: bcryptjs.hashSync('superuser', bcryptjs.genSaltSync()),
                    roles: ['ADMIN_ROLE']
                });
                await user.save();
                
            } else {
                return res.status(400).json({ msg: 'Usuario o Contraseña incorrecta' });
            }
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Usuario o Contraseña incorrecta' });
        }

        const token = await jwt(user._id.toString());
        res.json({ user, token });

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
}

export const renewToken = async (req: Request, res: Response) => {
    const token = await jwt(req.query.authUserId!.toString());
    res.json(token);
}