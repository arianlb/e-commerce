import { Router } from "express";
import { check } from 'express-validator';

import { validate } from "../middlewares/validateFields";
import { validateToken } from "../middlewares/validateJWT";
import { hasAnyRole } from "../middlewares/validateRole";
import { areValidRoles, emailExists, userExists } from "../helpers/dbValidators";

import { getUser, getUsers, postUser, putUser, deleteUser } from "../controllers/userController";

const router = Router();

router.get('/', [
    validateToken,
    hasAnyRole('ADMIN_ROLE'),
    validate
], getUsers);

router.get('/:id', [
    validateToken,
    hasAnyRole('ADMIN_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    validate
], getUser);

router.post('/', [
    validateToken,
    hasAnyRole('ADMIN_ROLE'),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('email').custom(emailExists),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('roles', 'Los roles son obligatorios').not().isEmpty(),
    check('roles').custom(areValidRoles),
    validate
], postUser);

router.put('/:id', [
    validateToken,
    hasAnyRole('ADMIN_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(userExists),
    validate
], putUser);

router.delete('/:id', [
    validateToken,
    hasAnyRole('ADMIN_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(userExists),
    validate
], deleteUser);

export default router;