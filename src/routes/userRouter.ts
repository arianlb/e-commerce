import { Router } from "express";
import { check } from 'express-validator';

import { validate } from "../middlewares/validateFields";
import { getUser, getUsers, postUser, putUser, deleteUser } from "../controllers/userController";
import { areValidRoles, emailExists, userExists } from "../helpers/dbValidators";

const router = Router();

router.get('/', getUsers);

router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    validate
], getUser);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('email').custom(emailExists),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('roles', 'Los roles son obligatorios').not().isEmpty(),
    check('roles').custom(areValidRoles),
    validate
], postUser);

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    validate
], putUser);

router.delete('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(userExists),
    validate
], deleteUser);

export default router;