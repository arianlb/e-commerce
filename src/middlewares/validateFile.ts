import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';

export const validateUpload = (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({ msg: 'No hay archivo que subir' });
    }

    next();
}

export const validateImage = (req: Request, res: Response, next: NextFunction) => {
    const file = req.files!.file as UploadedFile;
    const [typeFile] = file.mimetype.split('/');
    if (typeFile !== 'image') {
        return res.status(400).json({ msg: 'El archivo no es una imagen' });
    }

    next();
}