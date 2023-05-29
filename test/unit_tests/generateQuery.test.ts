import { describe, expect, test } from '@jest/globals';
import { generateQuery } from '../../src/helpers/generateQuery';

describe('Funcion que limpia las req.query para generar una query con criterios de busqueda de producto', () => {
    test('Debería devolver un objeto con todas sus propiedades definidas y solamente propiedes de los productos', () => {
        const reqQuery = {
            test: 'test',
            testUndifned: undefined,
            name: 'test'
        };
        const query = generateQuery(reqQuery);
        expect(query).toEqual({ name: 'test' });
        expect(query).toHaveProperty('name');
        expect(query).not.toHaveProperty('test');
        expect(query).not.toHaveProperty('testUndifned');
    });
});