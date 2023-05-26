import { NextFunction, Request, Response } from 'express';

export const hasAnyRole = (...roles: string[]) => { 
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.query.authUserRoles) {
            return res.status(500).json({ msg: 'Se quiere verificar el rol sin validar el token primero' });
        }

        const userRoles: string[] = req.query.authUserRoles.toString().split(',');
        if (!roles.some(role => userRoles.includes(role))) {
            return res.status(401).json({ msg: `El servicio requiere uno de estos roles: ${roles}` });
        }

        next();
    }
}