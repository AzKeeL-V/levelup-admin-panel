// Utilidades de validación para formularios

/**
 * Valida un número de tarjeta usando el algoritmo Luhn
 */
export const validateCardNumber = (cardNumber: string): boolean => {
  // Remover espacios y caracteres no numéricos
  const cleanNumber = cardNumber.replace(/\D/g, '');

  // Verificar longitud básica (13-19 dígitos para tarjetas comunes)
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }

  // Algoritmo Luhn
  let sum = 0;
  let shouldDouble = false;

  // Procesar dígitos de derecha a izquierda
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

/**
 * Valida fecha de expiración de tarjeta (MM/YY)
 */
export const validateExpiryDate = (expiryDate: string): boolean => {
  // Formato esperado: MM/YY
  const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000; // Convertir YY a YYYY

  // Validar mes (01-12)
  if (month < 1 || month > 12) return false;

  // Validar que no esté expirada
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() devuelve 0-11

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
};

/**
 * Valida titular de tarjeta (solo letras, espacios, máximo 50 caracteres)
 */
export const validateCardHolder = (holderName: string): boolean => {
  if (!holderName.trim()) return false;
  if (holderName.length > 50) return false;

  // Solo letras, espacios y algunos caracteres especiales comunes en nombres
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-.]+$/;
  return nameRegex.test(holderName.trim());
};

/**
 * Valida teléfono chileno (+569XXXXXXXX)
 */
export const validateChileanPhone = (phone: string): boolean => {
  const phoneRegex = /^\+569\d{8}$/;
  return phoneRegex.test(phone);
};

/**
 * Valida email básico
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida fecha de nacimiento completa (día, mes, año)
 */
export const validateBirthDate = (birthDate: string): { isValid: boolean; error?: string } => {
  if (!birthDate) {
    return { isValid: false, error: "La fecha de nacimiento es requerida" };
  }

  // Parsear fecha en formato dd-mm-yyyy
  const dateParts = birthDate.split('-');
  if (dateParts.length !== 3) {
    return { isValid: false, error: "Formato de fecha inválido. Use dd-mm-yyyy" };
  }

  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const year = parseInt(dateParts[2], 10);

  // Validar que los valores sean números válidos
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return { isValid: false, error: "Fecha de nacimiento inválida" };
  }

  // Validar año mínimo (1930)
  if (year < 1930) {
    return { isValid: false, error: "El año debe ser 1930 o posterior" };
  }

  // Validar año máximo (menor de edad)
  const currentYear = new Date().getFullYear();
  if (year > currentYear - 18) {
    return { isValid: false, error: "Debes tener al menos 18 años" };
  }

  // Validar mes (1-12)
  if (month < 1 || month > 12) {
    return { isValid: false, error: "El mes debe estar entre 1 y 12" };
  }

  // Validar días según el mes
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return { isValid: false, error: `El mes ${month} tiene máximo ${daysInMonth} días` };
  }

  return { isValid: true };
};

/**
 * Valida edad mínima (18 años) - función de compatibilidad
 */
export const validateMinimumAge = (birthDate: string): boolean => {
  return validateBirthDate(birthDate).isValid;
};

/**
 * Calcula el dígito verificador del RUT chileno
 */
function calculateDv(rutNumber: string): string {
  let sum = 0;
  let multiplier = 2;
  // Procesar de derecha a izquierda
  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const mod = sum % 11;
  if (mod === 0) return '0';
  if (mod === 1) return 'k';
  return String(11 - mod);
}

/**
 * Valida RUT chileno (formato chileno con puntos y guion)
 */
export const validateRut = (rut: string): boolean => {
  if (!rut || typeof rut !== 'string') return false;

  // Limpiar: remover espacios, pero mantener puntos y guion
  const cleanRut = rut.trim();

  // Verificar formato básico: debe contener números, puntos opcionales, guion y dígito verificador
  // Ejemplos válidos: 12345678-9, 12.345.678-9, 12345678-K
  const rutRegex = /^[0-9]+(?:\.[0-9]+)*-[0-9kK]$/;
  if (!rutRegex.test(cleanRut)) {
    return false;
  }

  // Remover puntos para calcular
  const rutWithoutDots = cleanRut.replace(/\./g, '');

  // Separar número y dígito verificador
  const parts = rutWithoutDots.split('-');
  if (parts.length !== 2) return false;

  const rutNumber = parts[0];
  const dv = parts[1].toLowerCase();

  // Verificar que el número tenga al menos 7 dígitos (RUT mínimo)
  if (rutNumber.length < 7 || rutNumber.length > 8) return false;

  // Calcular dígito verificador
  const dvCalculated = calculateDv(rutNumber);

  return dv === dvCalculated;
};

/**
 * Formatea número de tarjeta con espacios cada 4 dígitos
 */
export const formatCardNumber = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const groups = cleanValue.match(/(\d{1,4})/g);
  return groups ? groups.join(' ') : cleanValue;
};

/**
 * Formatea fecha de expiración MM/YY
 */
export const formatExpiryDate = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length >= 2) {
    return cleanValue.slice(0, 2) + '/' + cleanValue.slice(2, 4);
  }
  return cleanValue;
};

/**
 * Formatea teléfono chileno
 */
export const formatChileanPhone = (value: string): string => {
  // Remover todo lo que no sea dígito
  const cleanValue = value.replace(/\D/g, "");

  // Si empieza con 569 (ej: usuario pegó 56912345678), tomamos lo que sigue
  if (cleanValue.startsWith("569")) {
    const digits = cleanValue.slice(3).slice(0, 8);
    return "+569" + digits;
  }

  // Si no tiene el prefijo, tomamos los primeros 8 dígitos
  const digits = cleanValue.slice(0, 8);
  return "+569" + digits;
};
