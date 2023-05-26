import express, { Application } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import dbConnection from '../database/connection';

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '8080';

        this.connectDB();
        this.middlewares();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() { 
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    listen() { 
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

export default Server;