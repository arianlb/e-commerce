import { Router } from "express";
import { check } from 'express-validator';

import { validate } from "../middlewares/validateFields";
import { validateToken } from "../middlewares/validateJWT";
import { hasAnyRole } from "../middlewares/validateRole";
import { validateImage, validateUpload } from "../middlewares/validateFile";
import { productExistsBySku } from "../helpers/dbValidators";

import {
    getProduct,
    getProducts,
    getProductBySku,
    getProductAmount,
    getProductsSold,
    getFullProfit,
    getProductsOutOfStock,
    postProduct,
    putProduct,
    deleteProduct,
    sellProduct,
    updatePicture
} from "../controllers/productController";

const router = Router();

router.get('/', getProducts);

router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    validate
], getProduct);

router.get('/sku/:sku', [
    check('sku', 'El sku es obligatorio').not().isEmpty(),
    validate
], getProductBySku);

router.get('/quantity/these', getProductAmount);

router.get('/list/sold', [
    validateToken,
    hasAnyRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    validate
], getProductsSold);

router.get('/total/profit', [
    validateToken,
    hasAnyRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    validate
], getFullProfit);

router.get('/out-of/stock', [
    validateToken,
    hasAnyRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    validate
], getProductsOutOfStock);

router.post('/', [
    validateToken,
    hasAnyRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('price', 'El precio es obligatorio').not().isEmpty(),
    check('category', 'La categoría es obligatoria').not().isEmpty(),
    check('tags', 'Los tags son obligatorios').not().isEmpty(),
    check('description', 'La descripción es obligatoria').not().isEmpty(),
    check('sku', 'El sku es obligatorio').not().isEmpty(),
    check('sku').custom(productExistsBySku),
    validate
], postProduct);

router.put('/:id', [
    validateToken,
    hasAnyRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    validate
], putProduct);

router.delete('/:id', [
    validateToken,
    hasAnyRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    validate
], deleteProduct);

router.put('/sell/:id', [
    validateToken,
    check('id', 'No es un id válido').isMongoId(),
    validate
], sellProduct);

router.post('/picture/:id', [
    validateToken,
    hasAnyRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    validateUpload,
    validateImage,
    check('id', 'No es un id válido').isMongoId(),
    validate
], updatePicture);

export default router;