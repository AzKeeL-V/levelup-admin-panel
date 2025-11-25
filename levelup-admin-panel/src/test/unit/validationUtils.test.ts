import { describe, it, expect } from 'vitest';
import {
    validateChileanPhone,
    validateEmail,
    validateCardNumber,
    validateRut,
    validateBirthDate,
    validateExpiryDate,
    validateCardHolder,
    formatCardNumber,
    formatExpiryDate,
    formatChileanPhone,
    validateMinimumAge
} from '../../utils/validationUtils';

describe('Pruebas Unitarias: validationUtils', () => {

    // 1. validateChileanPhone
    describe('validateChileanPhone', () => {
        it('debería retornar true para un número chileno válido', () => {
            expect(validateChileanPhone('+56912345678')).toBe(true);
        });

        it('debería retornar false para un número con formato incorrecto', () => {
            expect(validateChileanPhone('12345678')).toBe(false);
            expect(validateChileanPhone('+5691234567')).toBe(false); // Muy corto
            expect(validateChileanPhone('+569123456789')).toBe(false); // Muy largo
        });
    });

    // 2. validateEmail
    describe('validateEmail', () => {
        it('debería retornar true para un email válido', () => {
            expect(validateEmail('usuario@ejemplo.com')).toBe(true);
        });

        it('debería retornar false para un email inválido', () => {
            expect(validateEmail('usuarioejemplo.com')).toBe(false);
            expect(validateEmail('usuario@')).toBe(false);
            expect(validateEmail('@ejemplo.com')).toBe(false);
        });
    });

    // 3. validateCardNumber (Luhn)
    describe('validateCardNumber', () => {
        it('debería retornar true para un número de tarjeta válido (Luhn)', () => {
            // 4111 1111 1111 1111 es un número de prueba Visa válido
            expect(validateCardNumber('4111111111111111')).toBe(true);
        });

        it('debería retornar false para un número de tarjeta inválido', () => {
            expect(validateCardNumber('1234567812345678')).toBe(false);
        });

        it('debería manejar caracteres no numéricos y longitud', () => {
            expect(validateCardNumber('4111-1111-1111-1111')).toBe(true); // Debería limpiar guiones
            expect(validateCardNumber('123')).toBe(false); // Muy corto
        });
    });

    // 4. validateRut
    describe('validateRut', () => {
        it('debería retornar true para un RUT válido', () => {
            expect(validateRut('11.111.111-1')).toBe(true);
            expect(validateRut('12345678-5')).toBe(true); // Sin puntos
        });

        it('debería retornar false para un RUT inválido', () => {
            expect(validateRut('11.111.111-2')).toBe(false); // DV incorrecto
            expect(validateRut('1-9')).toBe(false); // Muy corto
            expect(validateRut('')).toBe(false); // Vacío
            // @ts-ignore
            expect(validateRut(null)).toBe(false); // Null
        });
    });

    // 5. validateBirthDate & validateMinimumAge
    describe('validateBirthDate', () => {
        it('debería validar correctamente la edad', () => {
            expect(validateBirthDate('01-01-2000').isValid).toBe(true);

            const today = new Date();
            const currentYear = today.getFullYear();
            expect(validateBirthDate(`01-01-${currentYear}`).isValid).toBe(false); // Menor de edad
        });

        it('debería manejar formatos inválidos', () => {
            expect(validateBirthDate('').isValid).toBe(false);
            expect(validateBirthDate('invalid-date').isValid).toBe(false);
            expect(validateBirthDate('32-01-2000').isValid).toBe(false); // Día inválido
            expect(validateBirthDate('01-13-2000').isValid).toBe(false); // Mes inválido
            expect(validateBirthDate('01-01-1800').isValid).toBe(false); // Año muy antiguo
        });
    });

    describe('validateMinimumAge', () => {
        it('debería retornar booleano directamente', () => {
            expect(validateMinimumAge('01-01-2000')).toBe(true);
        });
    });

    // 6. validateExpiryDate
    describe('validateExpiryDate', () => {
        it('debería validar fechas futuras', () => {
            // Asumimos que el año actual es menor a 2099
            expect(validateExpiryDate('12/99')).toBe(true);
        });

        it('debería invalidar fechas pasadas o formatos incorrectos', () => {
            expect(validateExpiryDate('01/00')).toBe(false); // Pasado
            expect(validateExpiryDate('13/25')).toBe(false); // Mes inválido
            expect(validateExpiryDate('invalid')).toBe(false);
        });
    });

    // 7. validateCardHolder
    describe('validateCardHolder', () => {
        it('debería validar nombres correctos', () => {
            expect(validateCardHolder('Juan Perez')).toBe(true);
        });

        it('debería invalidar nombres vacíos o con caracteres raros', () => {
            expect(validateCardHolder('')).toBe(false);
            expect(validateCardHolder('   ')).toBe(false);
            expect(validateCardHolder('Juan123')).toBe(false); // Números no permitidos
        });
    });

    // 8. formatCardNumber
    describe('formatCardNumber', () => {
        it('debería formatear con espacios cada 4 dígitos', () => {
            expect(formatCardNumber('1234567812345678')).toBe('1234 5678 1234 5678');
        });

        it('debería manejar input parcial', () => {
            expect(formatCardNumber('123456')).toBe('1234 56');
        });
    });

    // 9. formatExpiryDate
    describe('formatExpiryDate', () => {
        it('debería agregar slash después de 2 dígitos', () => {
            expect(formatExpiryDate('1234')).toBe('12/34');
        });

        it('debería manejar input corto', () => {
            expect(formatExpiryDate('1')).toBe('1');
        });
    });

    // 10. formatChileanPhone
    describe('formatChileanPhone', () => {
        it('debería mantener el prefijo +569', () => {
            expect(formatChileanPhone('12345678')).toBe('+56912345678');
            expect(formatChileanPhone('+56912345678')).toBe('+56912345678');
        });

        it('debería retornar solo el prefijo si está vacío', () => {
            expect(formatChileanPhone('')).toBe('+569');
        });
    });

});
