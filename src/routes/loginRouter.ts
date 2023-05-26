import { Router } from "express";
import { check } from 'express-validator';

import { validate } from "../middlewares/validateFields";
import { validateToken } from "../middlewares/validateJWT";

import { login, renewToken } from "../controllers/loginController";

const router = Router();

router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validate
], login);

router.get('/renew', [
    validateToken
], renewToken);

export default router;