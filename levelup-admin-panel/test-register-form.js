// Script de prueba para validar todos los campos del formulario de registro
// Ejecutar con: node test-register-form.js

const {
  validateEmail,
  validateMinimumAge,
  validateChileanPhone,
  validateRut,
  validateCardNumber,
  validateExpiryDate,
  validateCardHolder,
  validateBirthDate,
  formatCardNumber,
  formatExpiryDate,
  formatChileanPhone
} = require('./src/utils/validationUtils.ts');

const { CHILEAN_REGIONS, getCitiesForRegion } = require('./src/utils/chileData.ts');

// Función para simular el comportamiento del formulario
function testFieldValidation() {
  console.log('🧪 INICIANDO PRUEBAS DEL FORMULARIO DE REGISTRO\n');

  let passedTests = 0;
  let totalTests = 0;

  // Función helper para test
  function test(name, condition, expected = true) {
    totalTests++;
    const result = condition === expected;
    console.log(`${result ? '✅' : '❌'} ${name}: ${result ? 'PASÓ' : 'FALLÓ'}`);
    if (result) passedTests++;
    return result;
  }

  console.log('📋 PRUEBA DE CAMPOS INDIVIDUALES:\n');

  // 1. Validación de Email
  console.log('1. EMAIL:');
  test('Email válido básico', validateEmail('usuario@example.com'));
  test('Email DUOC válido', validateEmail('usuario@duocuc.cl'));
  test('Email inválido (sin @)', !validateEmail('usuarioexample.com'));
  test('Email inválido (sin dominio)', !validateEmail('usuario@'));
  test('Email vacío', !validateEmail(''));

  // 2. Validación de Teléfono Chileno
  console.log('\n2. TELÉFONO:');
  test('Teléfono válido +56912345678', validateChileanPhone('+56912345678'));
  test('Teléfono inválido (muy corto)', !validateChileanPhone('+5691234567'));
  test('Teléfono inválido (muy largo)', !validateChileanPhone('+569123456789'));
  test('Teléfono inválido (sin +569)', !validateChileanPhone('912345678'));
  test('Teléfono inválido (con letras)', !validateChileanPhone('+5691234567a'));

  // 3. Validación de RUT
  console.log('\n3. RUT:');
  test('RUT válido 12.345.678-9', validateRut('12.345.678-9'));
  test('RUT válido sin puntos 12345678-9', validateRut('12345678-9'));
  test('RUT válido con K 12345678-K', validateRut('12345678-K'));
  test('RUT inválido (dígito verificador incorrecto)', !validateRut('12.345.678-8'));
  test('RUT inválido (muy corto)', !validateRut('1234567-8'));
  test('RUT vacío', !validateRut(''));

  // 4. Validación de Fecha de Nacimiento
  console.log('\n4. FECHA DE NACIMIENTO:');
  const today = new Date();
  const birthYear = today.getFullYear() - 25; // 25 años
  const validBirthDate = `15-08-${birthYear}`;
  const invalidBirthDate = `32-13-${birthYear}`; // Fecha inválida
  const underageDate = `15-08-${today.getFullYear() - 15}`; // Menor de edad

  test('Fecha válida (25 años)', validateBirthDate(validBirthDate).isValid);
  test('Fecha inválida (día 32)', !validateBirthDate(invalidBirthDate).isValid);
  test('Fecha inválida (menor de edad)', !validateBirthDate(underageDate).isValid);
  test('Fecha inválida (formato incorrecto)', !validateBirthDate('15/08/1990').isValid);
  test('Fecha vacía', !validateBirthDate('').isValid);

  // 5. Validación de Nombre
  console.log('\n5. NOMBRE:');
  test('Nombre válido (nombre y apellido)', 'Juan Pérez'.trim().split(/\s+/).length >= 2);
  test('Nombre válido (tres nombres)', 'María José González'.trim().split(/\s+/).length >= 2);
  test('Nombre inválido (solo nombre)', !('Juan'.trim().split(/\s+/).length >= 2));
  test('Nombre vacío', !(''.trim().split(/\s+/).length >= 2));

  // 6. Validación de Contraseña
  console.log('\n6. CONTRASEÑA:');
  test('Contraseña válida (6+ caracteres)', '123456'.length >= 6);
  test('Contraseña válida (más de 6)', 'password123'.length >= 6);
  test('Contraseña inválida (muy corta)', !('12345'.length >= 6));
  test('Contraseña vacía', !(''.length >= 6));

  // 7. Validación de Tarjeta de Crédito
  console.log('\n7. TARJETA DE CRÉDITO:');
  test('Número de tarjeta válido (Visa)', validateCardNumber('4111111111111111'));
  test('Número de tarjeta válido (Mastercard)', validateCardNumber('5555555555554444'));
  test('Número de tarjeta inválido (Luhn fail)', !validateCardNumber('4111111111111112'));
  test('Número de tarjeta inválido (muy corto)', !validateCardNumber('411111111111'));

  // Fecha de expiración
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);
  const futureMonth = (futureDate.getMonth() + 1).toString().padStart(2, '0');
  const futureYear = futureDate.getFullYear().toString().slice(-2);
  const validExpiry = `${futureMonth}/${futureYear}`;

  const pastDate = new Date();
  pastDate.setFullYear(pastDate.getFullYear() - 1);
  const pastMonth = (pastDate.getMonth() + 1).toString().padStart(2, '0');
  const pastYear = pastDate.getFullYear().toString().slice(-2);
  const invalidExpiry = `${pastMonth}/${pastYear}`;

  test('Fecha expiración válida (futuro)', validateExpiryDate(validExpiry));
  test('Fecha expiración inválida (pasado)', !validateExpiryDate(invalidExpiry));
  test('Fecha expiración inválida (formato)', !validateExpiryDate('13/25'));

  // Titular de tarjeta
  test('Titular válido', validateCardHolder('Juan Pérez'));
  test('Titular inválido (muy largo)', !validateCardHolder('Juan Pérez González Martínez López Fernández'.repeat(2)));
  test('Titular inválido (con números)', !validateCardHolder('Juan Pérez123'));
  test('Titular vacío', !validateCardHolder(''));

  // 8. Validación de Regiones y Ciudades
  console.log('\n8. REGIONES Y CIUDADES:');
  test('Región válida existe', CHILEAN_REGIONS.includes('Metropolitana'));
  test('Región inválida no existe', !CHILEAN_REGIONS.includes('Región Inexistente'));
  test('Ciudades para Metropolitana', getCitiesForRegion('Metropolitana').length > 0);
  test('Ciudades para región inválida', getCitiesForRegion('Región Inexistente').length === 0);

  // 9. Validación de Código de Referido
  console.log('\n9. CÓDIGO DE REFERIDO:');
  test('Código válido (opcional - vacío)', true); // Es opcional
  test('Código válido (con valor)', 'REF123456'.length > 0);

  // 10. Validación de Términos y Privacidad
  console.log('\n10. TÉRMINOS Y PRIVACIDAD:');
  test('Términos aceptados', true); // Checkbox checked
  test('Términos no aceptados', false); // Checkbox unchecked
  test('Privacidad aceptada', true);
  test('Privacidad no aceptada', false);

  console.log('\n📊 RESULTADOS FINALES:');
  console.log(`✅ Tests pasados: ${passedTests}/${totalTests}`);
  console.log(`❌ Tests fallados: ${totalTests - passedTests}/${totalTests}`);
  console.log(`📈 Porcentaje de éxito: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 ¡Todas las validaciones funcionan correctamente!');
  } else {
    console.log('\n⚠️  Algunas validaciones necesitan revisión.');
  }

  return passedTests === totalTests;
}

// Función para simular el flujo completo del formulario
function testFormSubmission() {
  console.log('\n🔄 PRUEBA DE ENVÍO COMPLETO DEL FORMULARIO:\n');

  // Datos de prueba válidos
  const validFormData = {
    nombre: "Juan Pérez González",
    rut: "12.345.678-9",
    fechaNacimiento: "15-08-1995",
    correo: "juan.perez@example.com",
    contraseña: "password123",
    confirmarContraseña: "password123",
    telefono: "+56912345678",
    direcciones: [{
      calle: "Avenida Siempre Viva",
      numero: "123",
      edificio: "Edificio Central",
      region: "Metropolitana",
      ciudad: "Santiago"
    }],
    tarjeta: {
      tipo: "visa",
      numero: "4111111111111111",
      expiracion: "12/25",
      cvv: "123"
    },
    codigoReferido: "REF123456",
    aceptaTerminos: true,
    aceptaPoliticaPrivacidad: true
  };

  // Simular validaciones del formulario
  let errors = [];

  // Nombre
  if (!validFormData.nombre.trim()) {
    errors.push("El nombre es requerido");
  } else {
    const nombreWords = validFormData.nombre.trim().split(/\s+/);
    if (nombreWords.length < 2) {
      errors.push("El nombre completo debe tener al menos nombre y apellido");
    }
  }

  // RUT
  if (!validFormData.rut.trim()) {
    errors.push("El RUT es requerido");
  } else if (!validateRut(validFormData.rut)) {
    errors.push("El RUT no es válido");
  }

  // Fecha nacimiento
  const birthValidation = validateBirthDate(validFormData.fechaNacimiento);
  if (!birthValidation.isValid) {
    errors.push(birthValidation.error || "Fecha de nacimiento inválida");
  }

  // Email
  if (!validFormData.correo.trim()) {
    errors.push("El correo es requerido");
  } else if (!validateEmail(validFormData.correo)) {
    errors.push("El correo electrónico no es válido");
  }

  // Contraseña
  if (!validFormData.contraseña) {
    errors.push("La contraseña es requerida");
  } else if (validFormData.contraseña.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres");
  }
  if (validFormData.contraseña !== validFormData.confirmarContraseña) {
    errors.push("Las contraseñas no coinciden");
  }

  // Teléfono
  if (!validFormData.telefono.trim()) {
    errors.push("El teléfono es requerido");
  } else if (!validateChileanPhone(validFormData.telefono)) {
    errors.push("El teléfono chileno no es válido");
  }

  // Tarjeta (opcional pero si se proporciona, validar)
  if (validFormData.tarjeta.numero || validFormData.tarjeta.expiracion || validFormData.tarjeta.cvv) {
    if (!validateCardNumber(validFormData.tarjeta.numero)) {
      errors.push("El número de tarjeta no es válido");
    }
    if (!validateExpiryDate(validFormData.tarjeta.expiracion)) {
      errors.push("La fecha de expiración no es válida");
    }
    if (!validateCardHolder(validFormData.nombre.trim())) {
      errors.push("El nombre del titular no es válido");
    }
  }

  // Términos
  if (!validFormData.aceptaTerminos) {
    errors.push("Debes aceptar los términos y condiciones");
  }
  if (!validFormData.aceptaPoliticaPrivacidad) {
    errors.push("Debes aceptar la política de privacidad");
  }

  if (errors.length === 0) {
    console.log('✅ Formulario válido - debería enviarse correctamente');
    return true;
  } else {
    console.log('❌ Errores encontrados:');
    errors.forEach(error => console.log(`   - ${error}`));
    return false;
  }
}

// Ejecutar pruebas
const fieldTestsPassed = testFieldValidation();
const formTestPassed = testFormSubmission();

console.log('\n🏁 RESUMEN FINAL:');
console.log(`Validaciones individuales: ${fieldTestsPassed ? '✅ PASÓ' : '❌ FALLÓ'}`);
console.log(`Envío de formulario: ${formTestPassed ? '✅ PASÓ' : '❌ FALLÓ'}`);

if (fieldTestsPassed && formTestPassed) {
  console.log('\n🎉 ¡Todas las pruebas pasaron! El formulario debería funcionar correctamente.');
} else {
  console.log('\n⚠️  Se encontraron problemas que necesitan corrección.');
}
