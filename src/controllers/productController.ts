import { Request, Response } from "express";

import Product from "../models/product";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const {
            limit = 10,
            from = 0,
            name,
            price,
            amountStock,
            category,
            tags,
            description,
            additionalInfo,
            starts,
            sku
        } = req.query;

        const query = { name, price, amountStock, category, tags, description, additionalInfo, starts, sku };
        
        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query).skip(Number(from)).limit(Number(limit)),
        ]);

        res.json({
            total,
            products,
        });

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
}

export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'No existe el producto con el id: ' + req.params.id });
        }

        res.json(product);

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
}

export const getProductAmount = async (req: Request, res: Response) => {
    try {
        const {
            name,
            price,
            amountStock,
            category,
            tags,
            description,
            additionalInfo,
            starts,
            sku
        } = req.query;

        const query = { name, price, amountStock, category, tags, description, additionalInfo, starts, sku };
        const total = await Product.countDocuments(query);
        res.json(total);

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }   
}

export const getProductsSold = async (req: Request, res: Response) => {
    try {
        const products = await Product.find({ amountSold: { $gte: 1 } });
        res.json(products);

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
}

export const getFullProfit = async (req: Request, res: Response) => { 
    try {
        const products = await Product.find({ amountSold: { $gte: 1 } });
        const profit = products.reduce((acc, product) => acc + (product.price * product.amountSold), 0);
        res.json(profit);

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
}

export const getProductsOutOfStock = async (req: Request, res: Response) => { 
    try {
        const products = await Product.find({ amountStock: 0 });
        res.json(products);

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
}

export const postProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, amountStock, category, tags, description, additionalInfo, starts, sku } = req.body;
        const product = new Product({ name, price, amountStock, category, tags, description, additionalInfo, starts, sku });
        await product.save();
        res.status(201).json(product);

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
}

export const putProduct = async (req: Request, res: Response) => { 
    try {
        const { _id, ...rest } = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, rest, { new: true });
        res.status(204).json(product);

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'No existe el producto con el id: ' + req.params.id });
        }

        res.json(product);

    } catch (error: any) {
        res.status(500).json({ msg: error.message });
    }
}

export const sellProduct = async (req: Request, res: Response) => { 
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
        res.status(500).json({ msg: error.message });
    }
}