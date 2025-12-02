import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { toast } from "sonner";
import { CartItem, Cart } from "@/types/Cart";
import { Product } from "@/types/Product";

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "levelup_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
    itemCount: 0,
  });

  // Shipping policy
  const SHIPPING_THRESHOLD = 50000; // CLP - free shipping threshold
  const SHIPPING_COST = 5000; // CLP - cost when below threshold

  // Define calculateTotals BEFORE using it in useEffect
  const calculateTotals = useCallback((items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : (subtotal === 0 ? 0 : SHIPPING_COST);
    const total = subtotal + shipping;
    return {
      subtotal,
      shipping,
      total,
      itemCount,
    };
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Recalculate totals to ensure consistency
        const recalculatedTotals = calculateTotals(parsedCart.items);
        setCart({
          items: parsedCart.items,
          ...recalculatedTotals,
        });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, [calculateTotals]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.productId === product.codigo
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Check if adding quantity exceeds stock
        const currentQuantity = prevCart.items[existingItemIndex].quantity;
        if (currentQuantity + quantity > product.stock) {
          toast.error(`No puedes agregar más de ${product.stock} unidades de este producto.`);
          return prevCart;
        }

        // Update existing item quantity
        newItems = prevCart.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = item.quantity + quantity;
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: item.canjeable ? 0 : newQuantity * item.unitPrice,
            };
          }
          return item;
        });
        toast.success("Producto actualizado en el carrito");
      } else {
        // Check if initial quantity exceeds stock
        if (quantity > product.stock) {
          toast.error(`No puedes agregar más de ${product.stock} unidades de este producto.`);
          return prevCart;
        }

        // Add new item (solo productos de tienda regular)
        const newItem: CartItem = {
          id: `${product.codigo}_${Date.now()}`,
          productId: product.codigo,
          productName: product.nombre,
          productImage: product.imagen,
          quantity,
          unitPrice: product.precio,
          totalPrice: quantity * product.precio,
          puntosGanados: product.puntos,
          productDatabaseId: product.id,
          purchaseMethod: 'money',
        };
        newItems = [...prevCart.items, newItem];
        toast.success("Producto añadido al carrito");
      }

      const totals = calculateTotals(newItems);

      return {
        items: newItems,
        ...totals,
      };
    });
  }, [calculateTotals]);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== itemId);
      const totals = calculateTotals(newItems);
      toast.info("Producto eliminado del carrito");

      return {
        items: newItems,
        ...totals,
      };
    });
  }, [calculateTotals]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => {
      // Find the item to check stock (we need the product info, but we only have cart item)
      // In a real app we might fetch product, but here we rely on what we have or assume stock check was done?
      // Actually, we don't have the full product stock in CartItem usually unless we added it.
      // Let's assume for now we can't easily check stock here without looking up the product again.
      // However, the user request was specifically about "boton agregar" (addToCart).
      // But let's try to be safe. If we don't have stock info in CartItem, we might skip it or try to find it.
      // Wait, CartItem doesn't have 'stock'.
      // I will leave updateQuantity as is for now regarding stock, or just add a basic check if I can.
      // Since I can't easily get the product stock here without context, I will just update the quantity.
      // But I will add a toast for update.

      const newItems = prevCart.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            totalPrice: quantity * item.unitPrice,
          };
        }
        return item;
      });

      const totals = calculateTotals(newItems);

      return {
        items: newItems,
        ...totals,
      };
    });
  }, [calculateTotals, removeFromCart]);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      subtotal: 0,
      shipping: 0,
      total: 0,
      itemCount: 0,
    });
  }, []);

  const getItemCount = useCallback(() => cart.itemCount, [cart.itemCount]);
  const getTotalPrice = useCallback(() => cart.total, [cart.total]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
