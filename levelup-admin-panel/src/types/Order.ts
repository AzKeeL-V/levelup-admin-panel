export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  puntosGanados?: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRut?: string;
  items: OrderItem[];
  subtotal: number;
  descuentoDuoc: number;
  descuentoPuntos: number;
  total: number;
  puntosUsados: number;
  puntosGanados: number;
  estado: "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado" | "rechazado";
  fechaCreacion: string;
  fechaActualizacion: string;
  // Información de envío
  // Información de envío
  direccionEnvio: {
    nombre: string;
    calle: string;
    numero: string;
    apartamento?: string;
    ciudad: string;
    region: string;
    telefono: string;
  };
  // Información de pago (simplificada para demo)
  metodoPago: "tarjeta" | "credito" | "debito" | "transferencia" | "efectivo" | "mach" | "mercadopago";
  numeroOrden: string;
  notas?: string;

  // Nuevos campos para identificar origen del pedido
  creadoPor: "usuario" | "admin";  // Identificar quién creó el pedido
  adminId?: string;                 // ID del admin que creó el pedido (si aplica)
  adminNombre?: string;             // Nombre del admin que realizó la venta

  // Información de pago extendida (para ventas admin)
  datosPago?: {
    numeroTarjeta?: string;         // Últimos 4 dígitos solamente
    titular?: string;               // Nombre del titular de la tarjeta
    tipoTarjeta?: string;           // Visa, Mastercard, Amex, etc.
  };
}
