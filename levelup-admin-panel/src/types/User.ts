export interface User {
  id: string;
  // Información básica (obligatoria)
  nombre: string;
  correo: string;
  contraseña: string; // Hashed password
  rut: string;
  tipo: "duoc" | "normal";
  puntos: number;
  nivel: "bronce" | "plata" | "oro" | "diamante";
  rol?: "admin" | "user"; // Rol del usuario

  // Información para envío de productos
  telefono?: string;
  direcciones?: {
    calle: string;
    numero: string;
    apartamento?: string;
    ciudad: string;
    region: string;
  }[];

  // Información de pago (opcional, se pide en primera compra)
  metodoPagoPreferido?: "tarjeta" | "credito" | "debito" | "transferencia" | "efectivo" | "paypal" | "mach" | "mercadopago";
  metodosPago?: {
    id: string;
    tipo: "tarjeta" | "credito" | "debito" | "transferencia" | "efectivo" | "paypal" | "mach" | "mercadopago";
    tarjeta?: {
      numero: string; // Encriptado
      fechaExpiracion: string;
      titular: string;
      franquicia?: string; // e.g. Visa, Mastercard
    };
    banco?: string; // Para transferencias
    cuenta?: string; // Para transferencias
    emailPaypal?: string; // Para PayPal
    esPredeterminado: boolean;
  }[];

  // Preferencias y marketing
  preferenciasComunicacion: {
    email: boolean;
    sms: boolean;
  };
  intereses: string[]; // Categorías favoritas

  // Seguridad y legal
  aceptaTerminos: boolean;
  aceptaPoliticaPrivacidad: boolean;
  captchaVerificado: boolean;

  // Sistema
  fechaRegistro: string;
  ultimoAcceso?: string;
  activo: boolean;
  codigoReferido: string; // Código único de referido
  referidoPor?: string; // Código de quien lo refirió (opcional)
}
