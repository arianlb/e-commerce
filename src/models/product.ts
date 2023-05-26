import { Schema, model } from 'mongoose';

interface IProduct {
    name: string;
    price: number;
    amountStock: number;
    category: string;
    tags: string;
    description: string;
    additionalInformation: string;
    starts: number;
    sku: string;
    picture: string;
    amountSold: number;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: [true, 'Name is required'] },
    price: { type: Number, required: [true, 'Price is required'] },
    amountStock: { type: Number, default: 0, min: 0 },
    category: { type: String, required: [true, 'Category is required'] },
    tags: { type: String, required: [true, 'Tags is required'] },
    description: { type: String, required: [true, 'Description is required'] },
    additionalInformation: { type: String },
    starts: { type: Number, default: 5, min: 1, max: 5 },
    sku: { type: String, required: [true, 'SKU is required'], unique: true },
    picture: { type: String, required: [true, 'Picture is required'] },
    amountSold: { type: Number, default: 0 }
});

productSchema.methods.toJSON = function () {
    const { __v, amountSold, ...product } = this.toObject();
    return product;
}

export default model<IProduct>('Product', productSchema);