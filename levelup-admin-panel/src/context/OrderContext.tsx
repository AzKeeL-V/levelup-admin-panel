import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Order } from "@/types/Order";
import { OrderRepository } from "@/repositories/OrderRepository";

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  addOrder: (order: Omit<Order, "id" | "numeroOrden" | "fechaCreacion" | "fechaActualizacion">) => Promise<void>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  getOrdersByUser: (userId: string) => Promise<Order[]>;
  getOrderStats: () => Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    averageOrderValue: number;
    totalPointsEarned: number;
    totalPointsUsed: number;
  }>;
  getRecentOrders: (limit?: number) => Promise<Order[]>;
  refreshOrders: (silent?: boolean) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const orderData = await OrderRepository.findAll();
      setOrders(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar pedidos");
      console.error("Error loading orders:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const addOrder = useCallback(async (order: Omit<Order, "id" | "numeroOrden" | "fechaCreacion" | "fechaActualizacion">) => {
    try {
      setError(null);
      await OrderRepository.create(order);
      await loadOrders(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear pedido";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadOrders]);

  const updateOrder = useCallback(async (id: string, orderData: Partial<Order>) => {
    try {
      setError(null);
      await OrderRepository.update(id, orderData);
      await loadOrders(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar pedido";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadOrders]);

  const deleteOrder = useCallback(async (id: string) => {
    try {
      setError(null);
      await OrderRepository.delete(id);
      await loadOrders(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar pedido";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadOrders]);

  const getOrdersByUser = useCallback(async (userId: string) => {
    try {
      return await OrderRepository.findByUserId(userId);
    } catch (err) {
      console.error("Error getting orders by user:", err);
      throw err;
    }
  }, []);

  const getOrderStats = useCallback(async () => {
    try {
      return await OrderRepository.getOrderStats();
    } catch (err) {
      console.error("Error getting order stats:", err);
      throw err;
    }
  }, []);

  const getRecentOrders = useCallback(async (limit?: number) => {
    try {
      return await OrderRepository.getRecentOrders(limit);
    } catch (err) {
      console.error("Error getting recent orders:", err);
      throw err;
    }
  }, []);

  const refreshOrders = useCallback(async (silent = false) => {
    await loadOrders(silent);
  }, [loadOrders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        addOrder,
        updateOrder,
        deleteOrder,
        getOrdersByUser,
        getOrderStats,
        getRecentOrders,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
