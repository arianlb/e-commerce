import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const uploadPicture = (req: any): Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
        
        const { file } = req.files;
        const nameSplit = file.name.split('.');
        const extension = nameSplit[nameSplit.length - 1];

        const nameTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../../../uploads', nameTemp);

        file.mv(uploadPath, (err: any) => {
            if (err) {
                return reject(err);
            }

            const address = req.secure ? 'https' : 'http' + '://' + req.headers.host +'/'+ nameTemp;
            resolve(address);
        });
        
    });
}

export const deletePicture = (address: string) => {
    const addressArray = address.split('/');
    const name = addressArray[addressArray.length - 1];
    const pathPicture = path.join(__dirname, '../../../uploads', name);
    if (pathPicture.includes('no-image.jpg')) {
        return;
    }

    try {
        if (fs.existsSync(pathPicture)) {
            fs.unlinkSync(pathPicture);
        }
    } catch (error) {
        console.log(error);
    }
}