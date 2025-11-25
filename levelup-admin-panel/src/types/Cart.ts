export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  puntosGanados?: number; // Puntos que gana el usuario con esta compra
  origen?: 'tienda' | 'recompensas';
  puntosRequeridos?: number; // Puntos que cuesta canjear este producto
  canjeable?: boolean;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}
