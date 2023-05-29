import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import mongoose from "mongoose";
import Server from '../../src/models/server';

const app = new Server().getApp();
let tokenAdmin = '';
let tokenUser = '';
let userAdminId = '';

beforeAll(async () => {
    const response = await request(app).post('/api/login').send({
        email: 'superuser@admin.com',
        password: 'superuser'
    });
    tokenAdmin = response.body.token;
    userAdminId = response.body.user._id;

    const response2 = await request(app).post('/api/login').send({
        email: 'testuser@admin.com',
        password: 'testuser'
    });
    tokenUser = response2.body.token;
});

describe('Controlador de Productos en el metodo GET de la URL /api/product', () => { 
    
    test('Deberia devolver el total y la lista de productos', async () => {
        const response = await request(app).get('/api/products');
        expect(response.status).toBe(200);
        expect(response.body.total).toBeDefined();
        expect(response.body.products).toBeDefined();
    });
});

describe('Controlador de Productos en el metodo GET de la URL /api/product/:id', () => {
    
    test('Debería devolver un error 400 si no provee de un id valido', async () => {
        const response = await request(app).get('/api/products/id-no-valido');
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('No es un id válido');
    });

    test('Debería devolver un error 404 si el producto no se encuentra en la base de datos', async () => {
        const response = await request(app).get('/api/products/' + userAdminId);
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe('No existe el producto con el id: ' + userAdminId);
    });
});

describe('Controlador de Productos en el metodo GET de la URL /api/product/sku/:sku', () => {

    test('Debería devolver un error 400 si no provee de un SKU', async () => {
        const response = await request(app).get('/api/products/sku/');
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('No es un id válido');
    });

    test('Debería devolver un error 404 si el producto no se encuentra en la base de datos', async () => {
        const response = await request(app).get('/api/products/sku/test');
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe('No existe el producto con el sku: test');
    });
});

describe('Controlador de Productos en el metodo GET de la URL /api/product/quantity/these', () => {

    test('Debería devolver el total de producto segun el criterio de busqueda', async () => {
        const response = await request(app).get('/api/products/quantity/these');
        expect(response.status).toBe(200);
        expect(response.body.total).toBeDefined();
    });
});

describe('Controlador de Productos en el metodo GET de la URL /api/products/list/sold', () => {

    test('Debería devolver un error 401 si el token no existe', async () => {
        const response = await request(app).get('/api/products/list/sold');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('No hay token en la petición');
    });

    test('Debería devolver un error 401 si el token es incorrecto', async () => {
        const response = await request(app).get('/api/products/list/sold').set('Authorization', 'token');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('Token no válido');
    });

    test('Debería devolver un error 401 si el token no es de un usuario administrador', async () => {
        const response = await request(app).get('/api/products/list/sold').set('Authorization', tokenUser);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('El servicio requiere uno de estos roles: ADMIN_ROLE,EDITOR_ROLE');
    });

    test('Debería devolver la lista de productos vendidos', async () => {
        const response = await request(app).get('/api/products/list/sold').set('Authorization', tokenAdmin);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});

describe('Controlador de Productos en el metodo GET de la URL /api/products/total/profit', () => {

    test('Debería devolver un error 401 si el token no existe', async () => {
        const response = await request(app).get('/api/products/total/profit');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('No hay token en la petición');
    });

    test('Debería devolver un error 401 si el token es incorrecto', async () => {
        const response = await request(app).get('/api/products/total/profit').set('Authorization', 'token');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('Token no válido');
    });

    test('Debería devolver un error 401 si el token no es de un usuario administrador', async () => {
        const response = await request(app).get('/api/products/total/profit').set('Authorization', tokenUser);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('El servicio requiere uno de estos roles: ADMIN_ROLE,EDITOR_ROLE');
    });

    test('Debería devolver el total de la ganancia', async () => {
        const response = await request(app).get('/api/products/total/profit').set('Authorization', tokenAdmin);
        expect(response.status).toBe(200);
        expect(response.body.profit).toBeDefined();
    });
});

describe('Controlador de Productos en el metodo GET de la URL /api/products/out-of/stock', () => {

    test('Debería devolver un error 401 si el token no existe', async () => {
        const response = await request(app).get('/api/products/out-of/stock');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('No hay token en la petición');
    });

    test('Debería devolver un error 401 si el token es incorrecto', async () => {
        const response = await request(app).get('/api/products/out-of/stock').set('Authorization', 'token');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('Token no válido');
    });

    test('Debería devolver un error 401 si el token no es de un usuario administrador', async () => {
        const response = await request(app).get('/api/products/out-of/stock').set('Authorization', tokenUser);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('El servicio requiere uno de estos roles: ADMIN_ROLE,EDITOR_ROLE');
    });

    test('Debería devolver la lista de productos sin stock', async () => {
        const response = await request(app).get('/api/products/out-of/stock').set('Authorization', tokenAdmin);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});

describe('Controlador de Productos en el metodo POST de la URL /api/products', () => {

    test('Debería devolver un error 401 si el token no existe', async () => {
        const response = await request(app).post('/api/products');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('No hay token en la petición');
    });

    test('Debería devolver un error 401 si el token es incorrecto', async () => {
        const response = await request(app).post('/api/products').set('Authorization', 'token');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('Token no válido');
    });

    test('Debería devolver un error 401 si el token no es de un usuario administrador', async () => {
        const response = await request(app).post('/api/products').set('Authorization', tokenUser);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('El servicio requiere uno de estos roles: ADMIN_ROLE,EDITOR_ROLE');
    });

    test('Debería devolver un error 400 si no se provee el name', async () => {
        const response = await request(app).post('/api/products').set('Authorization', tokenAdmin).send({});
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('El nombre es obligatorio');
    });
    
    test('Debería devolver un error 400 si no se provee el price', async () => {
        const response = await request(app).post('/api/products').set('Authorization', tokenAdmin).send({
            name: 'Test'
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('El precio es obligatorio');
    });
    
    test('Debería devolver un error 400 si no se provee la categoría', async () => {
        const response = await request(app).post('/api/products').set('Authorization', tokenAdmin).send({
            name: 'Test',
            price: 10
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('La categoría es obligatoria');
    });
    
    test('Debería devolver un error 400 si no se provee los tags', async () => {
        const response = await request(app).post('/api/products').set('Authorization', tokenAdmin).send({
            name: 'Test',
            price: 10,
            category: 'Test'
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Los tags son obligatorios');
    });
    
    test('Debería devolver un error 400 si no se provee la descripción', async () => {
        const response = await request(app).post('/api/products').set('Authorization', tokenAdmin).send({
            name: 'Test',
            price: 10,
            category: 'Test',
            tags: ['Test']
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('La descripción es obligatoria');
    });
    
    test('Debería devolver un error 400 si no se provee el sku', async () => {
        const response = await request(app).post('/api/products').set('Authorization', tokenAdmin).send({
            name: 'Test',
            price: 10,
            category: 'Test',
            tags: ['Test'],
            description: 'Test'
        });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('El sku es obligatorio');
    });
});

describe('Controlador de Productos en el metodo PUT de la URL /api/products/:id', () => {

    test('Debería devolver un error 401 si el token no existe', async () => {
        const response = await request(app).put('/api/products/' + userAdminId);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('No hay token en la petición');
    });

    test('Debería devolver un error 401 si el token es incorrecto', async () => {
        const response = await request(app).put('/api/products/' + userAdminId).set('Authorization', 'token');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('Token no válido');
    });

    test('Debería devolver un error 401 si el token no es de un usuario administrador', async () => {
        const response = await request(app).put('/api/products/' + userAdminId).set('Authorization', tokenUser);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('El servicio requiere uno de estos roles: ADMIN_ROLE,EDITOR_ROLE');
    });

    test('Debería devolver un error 400 si no provee de un id valido', async () => {
        const response = await request(app).put('/api/products/id-no-valido').set('Authorization', tokenAdmin);
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('No es un id válido');
    });
    
    test('Debería devolver un error 400 si el producto no se encuentra en la base de datos', async () => {
        const response = await request(app).put('/api/products/' + userAdminId).set('Authorization', tokenAdmin);
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe(`El producto con el id ${userAdminId} no existe en la BD`);
    });
});

describe('Controlador de Productos en el metodo DELETE de la URL /api/products/:id', () => {

    test('Debería devolver un error 401 si el token no existe', async () => {
        const response = await request(app).delete('/api/products/' + userAdminId);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('No hay token en la petición');
    });

    test('Debería devolver un error 401 si el token es incorrecto', async () => {
        const response = await request(app).delete('/api/products/' + userAdminId).set('Authorization', 'token');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('Token no válido');
    });

    test('Debería devolver un error 401 si el token no es de un usuario administrador', async () => {
        const response = await request(app).delete('/api/products/' + userAdminId).set('Authorization', tokenUser);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('El servicio requiere uno de estos roles: ADMIN_ROLE,EDITOR_ROLE');
    });

    test('Debería devolver un error 400 si no provee de un id valido', async () => {
        const response = await request(app).delete('/api/products/id-no-valido').set('Authorization', tokenAdmin);
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('No es un id válido');
    });
    
    test('Debería devolver un error 404 si el producto no se encuentra en la base de datos', async () => {
        const response = await request(app).delete('/api/products/' + userAdminId).set('Authorization', tokenAdmin);
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe('No existe el producto con el id: ' + userAdminId);
    });
});

describe('Controlador de Productos en el metodo PUT de la URL /api/products/sell/:id', () => {

    test('Debería devolver un error 401 si el token no existe', async () => {
        const response = await request(app).put('/api/products/sell/' + userAdminId);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('No hay token en la petición');
    });

    test('Debería devolver un error 401 si el token es incorrecto', async () => {
        const response = await request(app).put('/api/products/sell/' + userAdminId).set('Authorization', 'token');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('Token no válido');
    });

    test('Debería devolver un error 400 si no provee de un id valido', async () => {
        const response = await request(app).put('/api/products/sell/id-no-valido').set('Authorization', tokenAdmin);
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('No es un id válido');
    });

    test('Debería devolver un error 404 si el producto no se encuentra en la base de datos', async () => {
        const response = await request(app).put('/api/products/sell/' + userAdminId).set('Authorization', tokenAdmin);
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe('No existe el producto con el id: ' + userAdminId);
    });
});

describe('Controlador de Productos en el metodo POST de la URL /api/products/picture/:id', () => {

    test('Debería devolver un error 401 si el token no existe', async () => {
        const response = await request(app).post('/api/products/picture/' + userAdminId);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('No hay token en la petición');
    });

    test('Debería devolver un error 401 si el token es incorrecto', async () => {
        const response = await request(app).post('/api/products/picture/' + userAdminId).set('Authorization', 'token');
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('Token no válido');
    });

    test('Debería devolver un error 401 si el token no es de un usuario administrador', async () => {
        const response = await request(app).post('/api/products/picture/' + userAdminId).set('Authorization', tokenUser);
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe('El servicio requiere uno de estos roles: ADMIN_ROLE,EDITOR_ROLE');
    });
});

afterAll(async () => {
    mongoose.connection.close();
});