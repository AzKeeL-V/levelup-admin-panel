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
    comuna?: string;
    region: string;
    codigoPostal?: string;
    pais?: string;
  }[];

  // Información de pago (opcional, se pide en primera compra)
  metodoPagoPreferido?: "tarjeta" | "transferencia" | "efectivo" | "paypal";
  metodosPago?: {
    id: string;
    tipo: "tarjeta" | "transferencia" | "efectivo" | "paypal";
    tarjeta?: {
      numero: string; // Encriptado
      fechaExpiracion: string;
      titular: string;
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
  newsletter: boolean; // Indica si el usuario está suscrito al boletín

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
