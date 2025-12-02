export interface RedemptionOrder {
  id: string;
  usuarioId: string;
  productId: string;
  productName: string;
  productImage: string;
  puntosUsados: number;
  cantidad: number; // Siempre 1 para canjes
  direccionEnvio: {
    calle: string;
    numero: string;
    departamento?: string;
    ciudad: string;
    region: string;
  };
  metodoRetiro: "retiro" | "envio"; // retiro = gratis, envio = puede cobrar
  estado: "pendiente" | "confirmado" | "enviado" | "entregado" | "cancelado";
  fechaCreacion: string;
  fechaActualizacion: string;
  notas?: string;
}

export interface RedemptionReceipt {
  id: string;
  redemptionOrderId: string;
  numeroRecibo: string; // Ej: CANJE-001-2025
  fecha: string;
  usuario: {
    nombre: string;
    correo: string;
  };
  producto: {
    nombre: string;
    codigo: string;
    puntosRequeridos: number;
  };
  puntosUsados: number;
  puntosRestantes: number;
  direccionEnvio: string;
  metodoRetiro: string;
  estado: string;
}
