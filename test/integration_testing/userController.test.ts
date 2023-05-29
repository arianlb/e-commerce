import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import mongoose from "mongoose";
import Server from '../../src/models/server';

const app = new Server().getApp();
let tokenAdmin = '';
let tokenUser = '';
let userAdminId = '';
let emailAdmin = '';

beforeAll(async () => {
    const response = await request(app).post('/api/login').send({
        email: 'superuser@admin.com',
        password: 'superuser'
    });
    tokenAdmin = response.body.token;
    userAdminId = response.body.user._id;
    emailAdmin = response.body.user.email;

    const response2 = await request(app).post('/api/login').send({
        email: 'testuser@admin.com',
        password: 'testuser'
    });
    tokenUser = response2.body.token;
});

describe('Controlador de Usuarios en el metodo GET de la URL /api/users', () => { 
    
    test('Debería devolver un error 401 si el token no existe', async () => {
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('No hay token en la petición');
    });

    test('Debería devolver un error 401 si el token es incorrecto', async () => {
        const response = await request(app).get('/api/users').set('Authorization', 'token');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('Token no válido');
    });

    test('Debería devolver un error 401 si el token no es de un usuario administrador', async () => {
        const response = await request(app).get('/api/users').set('Authorization', tokenUser);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('El servicio requiere uno de estos roles: ADMIN_ROLE');
    });

    test('Debería devolver un array de usuarios', async () => { 
        const response = await request(app).get('/api/users').set('Authorization', tokenAdmin);
        expect(response.status).toBe(200);
        expect(response.body.users).toBeDefined();
        expect(response.body.users.length).toBeGreaterThan(0);
    });
    
});

describe('Controlador de Usuarios en el metodo GET de la URL /api/users/:id', () => {
    
    test('Debería devolver un error 401 si el token no existe', async () => {
        const response = await request(app).get('/api/users/' + userAdminId);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('No hay token en la petición');
    });

    test('Debería devolver un error 401 si el token es incorrecto', async () => {
        const response = await request(app).get('/api/users/' + userAdminId).set('Authorization', 'token');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('Token no válido');
    });

    test('Debería devolver un error 401 si el token no es de un usuario administrador', async () => {
        const response = await request(app).get('/api/users/' + userAdminId).set('Authorization', tokenUser);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('El servicio requiere uno de estos roles: ADMIN_ROLE');
    });
    
    test('Debería devolver un error 400 si no provee de un id valido', async () => {
        const response = await request(app).get('/api/users/id-no-valido').set('Authorization', tokenAdmin);
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('No es un id válido');
    });

    test('Debería devolver un error 404 si el usuario no se encuentra en la base de datos', async () => {
        const char = userAdminId.charAt(userAdminId.length - 1);
        const id = char + userAdminId.substring(0, userAdminId.length - 1);
        const response = await request(app).get('/api/users/' + id).set('Authorization', tokenAdmin);
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe('No existe el usuario con el id: ' + id);
    });
    
    test('Debería devolver un usuario', async () => {
        const response = await request(app).get('/api/users/' + userAdminId).set('Authorization', tokenAdmin);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    });

});

describe('Controlador de Usuarios en el metodo POST de la URL /api/users', () => { 
    
    test('Debería devolver un error 401 si el token no existe', async () => {
        const response = await request(app).post('/api/users');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('No hay token en la petición');
    });

    test('Debería devolver un error 401 si el token es incorrecto', async () => {
        const response = await request(app).post('/api/users').set('Authorization', 'token');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('Token no válido');
    });

    test('Debería devolver un error 401 si el token no es de un usuario administrador', async () => {
        const response = await request(app).post('/api/users').set('Authorization', tokenUser);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('El servicio requiere uno de estos roles: ADMIN_ROLE');
    });
    
    test('Debería devolver un error 400 si no se provee el name', async () => {
        const response = await request(app).post('/api/users').set('Authorization', tokenAdmin).send({});
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('El nombre es obligatorio');
    });
    
    test('Debería devolver un error 400 si no se provee el email', async () => {
        const response = await request(app).post('/api/users').set('Authorization', tokenAdmin).send({
            name: 'test',
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('El email es obligatorio');
    });
    
    test('Debería devolver un error 400 si ya existe un usuario con ese email', async () => {
        const response = await request(app).post('/api/users').set('Authorization', tokenAdmin).send({
            name: 'test',
            email: emailAdmin,
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe(`El email ${emailAdmin} ya existe en la BD`);
    });
    
    test('Debería devolver un error 400 si no se provee el password', async () => {
        const response = await request(app).post('/api/users').set('Authorization', tokenAdmin).send({
            name: 'test',
            email: 'test@test.test',
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('La contraseña es obligatoria');
    });
    
    test('Debería devolver un error 400 si no se provee los roles', async () => {
        const response = await request(app).post('/api/users').set('Authorization', tokenAdmin).send({
            name: 'test',
            email: 'test@test.test',
            password: 'test',
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Los roles son obligatorios');
    });
    
    test('Debería devolver un error 400 si no se provee roles validos', async () => {
        const response = await request(app).post('/api/users').set('Authorization', tokenAdmin).send({
            name: 'test',
            email: 'test@test.test',
            password: 'test',
            roles: ['TEST_ROLE']
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('El rol TEST_ROLE no es un rol válido');
    });
});

describe('Controlador de Usuarios en el metodo PUT de la URL /api/users/:id', () => {

    test('Debería devolver un error 401 si el token no existe', async () => {
        const response = await request(app).put('/api/users/' + userAdminId);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('No hay token en la petición');
    });

    test('Debería devolver un error 401 si el token es incorrecto', async () => {
        const response = await request(app).put('/api/users/' + userAdminId).set('Authorization', 'token');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('Token no válido');
    });

    test('Debería devolver un error 401 si el token no es de un usuario administrador', async () => {
        const response = await request(app).put('/api/users/' + userAdminId).set('Authorization', tokenUser);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('El servicio requiere uno de estos roles: ADMIN_ROLE');
    });

    test('Debería devolver un error 400 si no provee de un id valido', async () => {
        const response = await request(app).put('/api/users/id-no-valido').set('Authorization', tokenAdmin);
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('No es un id válido');
    });

    test('Debería devolver un error 400 si el usuario no se encuentra en la base de datos', async () => {
        const char = userAdminId.charAt(userAdminId.length - 1);
        const id = char + userAdminId.substring(0, userAdminId.length - 1);
        const response = await request(app).put('/api/users/' + id).set('Authorization', tokenAdmin);
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe(`El usuario con el id ${id} no existe en la BD`);
    });

});

describe('Controlador de Usuarios en el metodo DELETE de la URL /api/users/:id', () => {

    test('Debería devolver un error 401 si el token no existe', async () => {
        const response = await request(app).delete('/api/users/' + userAdminId);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('No hay token en la petición');
    });

    test('Debería devolver un error 401 si el token es incorrecto', async () => {
        const response = await request(app).delete('/api/users/' + userAdminId).set('Authorization', 'token');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('Token no válido');
    });

    test('Debería devolver un error 401 si el token no es de un usuario administrador', async () => {
        const response = await request(app).delete('/api/users/' + userAdminId).set('Authorization', tokenUser);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('El servicio requiere uno de estos roles: ADMIN_ROLE');
    });

    test('Debería devolver un error 400 si no provee de un id valido', async () => {
        const response = await request(app).delete('/api/users/id-no-valido').set('Authorization', tokenAdmin);
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('No es un id válido');
    });

    test('Debería devolver un error 400 si el usuario no se encuentra en la base de datos', async () => {
        const char = userAdminId.charAt(userAdminId.length - 1);
        const id = char + userAdminId.substring(0, userAdminId.length - 1);
        const response = await request(app).delete('/api/users/' + id).set('Authorization', tokenAdmin);
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe(`El usuario con el id ${id} no existe en la BD`);
    });

});


afterAll(async () => {
    mongoose.connection.close();
});