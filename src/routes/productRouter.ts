import { Router } from "express";
import { check } from 'express-validator';

import { validate } from "../middlewares/validateFields";
import { getProduct, getProducts, postProduct, putProduct, deleteProduct } from "../controllers/productController";
import { productExists } from "../helpers/dbValidators";

const router = Router();

router.get('/', getProducts);

router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    validate
], getProduct);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('price', 'El precio es obligatorio').not().isEmpty(),
    check('category', 'La categoría es obligatoria').not().isEmpty(),
    check('tags', 'Los tags son obligatorios').not().isEmpty(),
    check('description', 'La descripción es obligatoria').not().isEmpty(),
    check('sku', 'El sku es obligatorio').not().isEmpty(),
    validate
], postProduct);

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    validate
], putProduct);

router.delete('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(productExists),
    validate
], deleteProduct);

export default router;