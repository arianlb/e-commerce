import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import dbConnection from '../database/connection';
import loginRoutes from '../routes/loginRouter';
import productRoutes from '../routes/productRouter';
import userRoutes from '../routes/userRouter';

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '8080';

        this.connectDB();
        this.middlewares();
        this.routes();
        this.errorHandler();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() { 
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(express.static('uploads'));
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() { 
        this.app.use('/api/login', loginRoutes);
        this.app.use('/api/products', productRoutes);
        this.app.use('/api/users', userRoutes);
    }

    errorHandler() {
        this.app.use( (err: Error, req: Request, res: Response, next: NextFunction) => {
            res.status(500).json({ msg: err.message });
            console.error('Error en: ' + req.originalUrl + ' - ' + req.method);
            console.error(err.message);
        });
    }

    listen() { 
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

export default Server;