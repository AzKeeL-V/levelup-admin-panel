export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  puntosGanados?: number; // Puntos que gana el usuario con esta compra
  purchaseMethod: 'money' | 'points'; // Método de compra: dinero o puntos
  puntosRequeridos?: number; // Puntos que cuesta canjear este producto
  canjeable?: boolean;
  productDatabaseId?: number; // ID numérico de la base de datos para el backend
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}
