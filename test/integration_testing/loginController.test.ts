import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import mongoose from "mongoose";
import Server from '../../src/models/server';

const app = new Server().getApp();
let token = '';

beforeAll(async () => { 
    const response = await request(app).post('/api/login').send({
        email: 'superuser@admin.com',
        password: 'superuser'
    });
    token = response.body.token;
});


describe('Controlador de Login en el metodo POST de la URL /api/login', () => {

    test('Deberia devolver el usuario y el token', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'superuser@admin.com',
            password: 'superuser'
        });
        expect(response.status).toBe(200);
        expect(response.body.user).toHaveProperty('_id');
        expect(response.body.token).toBeDefined();
    });

    test('Deberia devolver un error 400 si el email no existe', async () => {
        const response = await request(app).post('/api/login').send({
            password: 'superuser'
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('El email es obligatorio');
    });

    test('Deberia devolver un error 400 si el password no existe', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'superuser@admin.com'
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('La contraseña es obligatoria');
    });

    test('Deberia devolver un error 400 si el password es incorrecto', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'superuser@admin.com',
            password: 'superuser123'
        });
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('Usuario o Contraseña incorrecta');
    });

    test('Deberia devolver un error 400 si el email no existe', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'superuser123@admin.com',
            password: 'superuser'
        });
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('Usuario o Contraseña incorrecta');
    });
});

describe('Controlador de Login en el metodo GET de la URL /api/login/renew', () => { 
    
        test('Deberia devolver un nuevo token', async () => {
            const response = await request(app).get('/api/login/renew').set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
        });
    
        test('Deberia devolver un error 401 si el token no es valido', async () => {
            const response = await request(app).get('/api/login/renew').set('Authorization', 'token-invalido');
            expect(response.status).toBe(401);
            expect(response.body.msg).toBe('Token no válido');
        });
    
        test('Deberia devolver un error 401 si el token no existe', async () => {
            const response = await request(app).get('/api/login/renew');
            expect(response.status).toBe(401);
            expect(response.body.msg).toBe('No hay token en la petición');
        });
});

afterAll(async () => {
    mongoose.connection.close();
});