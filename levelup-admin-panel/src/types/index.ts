// Review types
export interface Review {
    id: string;
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    comment: string;
    fechaCreacion: string;
    verified: boolean;
    util: number;
    noUtil: number;
}

// Order types
export interface OrderAddress {
    calle: string;
    numero: string;
    ciudad: string;
    region: string;
    telefono?: string;
}

export interface OrderItem {
    quantity: number;
    productName: string;
    unitPrice: number;
    totalPrice: number;
}

export interface Order {
    numeroOrden: string;
    fechaCreacion: string;
    userName: string;
    userEmail: string;
    userRut?: string;
    direccionEnvio: OrderAddress;
    items: OrderItem[];
    total: number;
    descuentoDuoc: number;
    descuentoPuntos: number;
    metodoPago: string;
}
