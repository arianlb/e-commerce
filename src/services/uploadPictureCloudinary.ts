import { v2 as cloudinary } from 'cloudinary';

export const uploadPicture = async ({ files }: any) => {
    try {
        const { file } = files;
        const { secure_url } = await cloudinary.uploader.upload(file.tempFilePath);
        return secure_url;

    } catch (error) {
        console.log(error);
    }
}

export const deletePicture = (address: string) => {
    const addressArray = address.split('/');
    const name = addressArray[addressArray.length - 1];
    const [public_id] = name.split('.');
    cloudinary.uploader.destroy(public_id);
}