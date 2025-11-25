import axiosInstance from "../utils/axiosInstance";
import { Order } from "@/types/Order";

export class OrderRepository {
  static async findByUserId(userId: string): Promise<Order[]> {
    try {
      const response = await axiosInstance.get(`/orders?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders by user ID:", error);
      throw error;
    }
  }

  static async update(id: string, orderData: Partial<Order>): Promise<Order> {
    try {
      const response = await axiosInstance.put(`/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  }

  static async findAll(): Promise<Order[]> {
    try {
      // 1. Cargar datos de localStorage (donde se guardan los nuevos pedidos)
      const STORAGE_KEY = 'levelup_orders';
      const stored = localStorage.getItem(STORAGE_KEY);
      const localOrders: Order[] = stored ? JSON.parse(stored) : [];

      // 2. Cargar datos del JSON (pedidos históricos/ejemplo)
      let jsonOrders: Order[] = [];
      if (typeof fetch !== 'undefined') {
        try {
          const response = await fetch('/levelup_orders.json');
          if (response.ok) {
            jsonOrders = await response.json();
          }
        } catch (e) {
          console.error("Error cargando JSON de órdenes:", e);
        }
      }

      // 3. Merge inteligente
      const mergedOrders = [...localOrders];
      jsonOrders.forEach(jsonOrder => {
        const exists = localOrders.some(o => o.id === jsonOrder.id);
        if (!exists) {
          mergedOrders.push(jsonOrder);
        }
      });

      // 4. Guardar fusión para persistencia
      if (mergedOrders.length > localOrders.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedOrders));
      }

      return mergedOrders;

    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }

  // Crea un nuevo pedido (compra o canje)
  static async create(orderData: Partial<Order>): Promise<Order> {
    try {
      // Si existe backend, usa axios
      try {
        const response = await axiosInstance.post('/orders', orderData);
        return response.data;
      } catch (err) {
        // Si falla axios (no hay backend), sigue con mock
      }
      // Mock: guarda en localStorage
      const STORAGE_KEY = 'levelup_orders';
      const stored = localStorage.getItem(STORAGE_KEY);
      const orders: Order[] = stored ? JSON.parse(stored) : [];
      // Genera un id único y agrega campos por defecto
      const newOrder: Order = {
        ...orderData,
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        numeroOrden: orderData.numeroOrden || `#ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        estado: orderData.estado || 'pendiente',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
      } as Order;
      orders.push(newOrder);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      return newOrder;
    } catch (error) {
      console.error('Error creando pedido:', error);
      throw error;
    }
  }
  static async delete(id: string): Promise<void> {
    try {
      // Si existe backend, usa axios
      try {
        await axiosInstance.delete(`/orders/${id}`);
        return;
      } catch (err) {
        // Si falla axios (no hay backend), sigue con mock
      }

      const STORAGE_KEY = 'levelup_orders';
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const orders: Order[] = JSON.parse(stored);
        const filteredOrders = orders.filter(o => o.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredOrders));
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }

  static async getOrderStats(): Promise<{
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
  }> {
    const orders = await this.findAll();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(o => o.estado === 'pendiente').length;
    const processingOrders = orders.filter(o => o.estado === 'procesando').length;
    const shippedOrders = orders.filter(o => o.estado === 'enviado').length;
    const deliveredOrders = orders.filter(o => o.estado === 'entregado').length;
    const cancelledOrders = orders.filter(o => o.estado === 'cancelado' || o.estado === 'rechazado').length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalPointsEarned = orders.reduce((sum, order) => sum + (order.puntosGanados || 0), 0);
    const totalPointsUsed = orders.reduce((sum, order) => sum + (order.puntosUsados || 0), 0);

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      averageOrderValue,
      totalPointsEarned,
      totalPointsUsed
    };
  }

  static async getRecentOrders(limit: number = 5): Promise<Order[]> {
    const orders = await this.findAll();
    // Ordenar por fecha de creación descendente
    return orders
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
      .slice(0, limit);
  }
}
