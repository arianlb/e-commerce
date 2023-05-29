import { NextFunction, Request, Response } from "express";

import Product from "../models/product";
import { generateQuery } from "../helpers/generateQuery";
import { deletePicture, uploadPicture } from "../services/uploadPictureLocal";

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = 10;
        const from = (page - 1) * pageSize;

        const query = generateQuery(req.query);
                
        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query).skip(from).limit(pageSize),
        ]);

        res.json({
            total,
            products,
        });

    } catch (error: any) {
        next(error);
    }
}

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'No existe el producto con el id: ' + req.params.id });
        }

        res.json(product);

    } catch (error: any) {
        next(error);
    }
}

export const getProductBySku = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findOne({ sku: req.params.sku });
        if (!product) {
            return res.status(404).json({ msg: 'No existe el producto con el sku: ' + req.params.sku });
        }

        res.json(product);

    } catch (error: any) {
        next(error);
    }
}

export const getProductAmount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = generateQuery(req.query);
        const total = await Product.countDocuments(query);
        res.json({total});

    } catch (error: any) {
        next(error);
    }   
}

export const getProductsSold = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find({ amountSold: { $gte: 1 } });
        const productsWithAmountSold = products.map(product => ({ product, amountSold: product.amountSold }));
        res.json(productsWithAmountSold);

    } catch (error: any) {
        next(error);
    }
}

export const getFullProfit = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const products = await Product.find({ amountSold: { $gte: 1 } });
        const profit = products.reduce((acc, product) => acc + (product.price * product.amountSold), 0);
        res.json({profit});

    } catch (error: any) {
        next(error);
    }
}

export const getProductsOutOfStock = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const products = await Product.find({ amountStock: 0 });
        res.json(products);

    } catch (error: any) {
        next(error);
    }
}

export const postProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, price, amountStock, category, tags, description, additionalInfo, starts, sku } = req.body;
        const picture = req.secure ? 'https' : 'http' + '://' + req.headers.host +'/assets/no-image.jpg';
        const product = new Product({ name, price, amountStock, category, tags, description, additionalInfo, starts, sku, picture });
        await product.save();
        res.status(201).json(product);

    } catch (error: any) {
        next(error);
    }
}

export const putProduct = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const { _id, picture, ...rest } = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, rest, { new: true });
        res.status(204).json(product);

    } catch (error: any) {
        next(error);
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id, 'picture');
        if (!product) {
            return res.status(404).json({ msg: 'No existe el producto con el id: ' + req.params.id });
        }
        deletePicture(product.picture);
        await Product.findByIdAndDelete(req.params.id);

        res.status(204).json(product._id);

    } catch (error: any) {
        next(error);
    }
}

export const sellProduct = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'No existe el producto con el id: ' + req.params.id });
        }

        if (product.amountStock === 0) {
            return res.status(400).json({ msg: 'No hay stock del producto: ' + product.name });
        }

        product.amountStock -= 1;
        product.amountSold += 1;
        await product.save();
        res.json(product);

    } catch (error: any) {
        next(error);
    }
}

export const updatePicture = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'No existe el producto con el id: ' + req.params.id });
        }

        if (product.picture) {
            deletePicture(product.picture);
        }

        product.picture = await uploadPicture(req) || '';
        await product.save();
        res.json(product);

    } catch (error: any) {
        next(error);
    }
}