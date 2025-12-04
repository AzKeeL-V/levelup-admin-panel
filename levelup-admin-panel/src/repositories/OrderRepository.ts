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

  static async update(id: number, updates: Partial<Order>): Promise<Order> {
    try {
      console.log(`OrderRepository: Updating order ${id} with data:`, updates);

      const response = await axiosInstance.put(`/orders/${id}`, updates);
      console.log("OrderRepository: Update success:", response.data);
      return response.data;
    } catch (error) {
      console.error("OrderRepository: Error updating order:", error);
      throw error;
    }
  }

  static async findAll(): Promise<Order[]> {
    try {
      const response = await axiosInstance.get('/orders/all');

      return response.data.map((order: any) => ({
        ...order,
        numeroOrden: order.numeroOrden || `#ORD-${order.id}`,
        userName: order.user?.nombre || "Usuario Desconocido",
        userEmail: order.user?.email || order.user?.correo || "Sin email",
        userRut: order.user?.rut || "",
        userId: order.user?.id?.toString() || "",
        total: typeof order.total === 'number' ? order.total : parseFloat(order.total) || 0,
        puntosGanados: order.puntosGanados || 0,
        puntosUsados: order.puntosUsados || 0,
        fechaCreacion: order.fechaCreacion,
        fechaActualizacion: order.fechaActualizacion || order.fechaCreacion, // Fallback since backend doesn't have this field yet
        direccionEnvio: {
          ...order.direccionEnvio,
          telefono: order.direccionEnvio?.telefono || order.user?.telefono || "Sin teléfono"
        },
        items: (order.items || []).map((item: any) => ({
          id: item.id?.toString() || Math.random().toString(),
          productId: item.product?.id?.toString() || "",
          productName: item.product?.nombre || "Producto Desconocido",
          productImage: item.product?.imagen || "/placeholder.svg",
          quantity: item.quantity || 0,
          unitPrice: item.price || 0,
          totalPrice: (item.price || 0) * (item.quantity || 0),
          puntosGanados: 0 // Backend doesn't seem to send this per item explicitly in the simplified view
        }))
      }));
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
        // Transform payload for backend to match CreateOrderRequest DTO
        const backendPayload = {
          items: (orderData.items || []).reduce((acc: any, item: any) => {
            const pId = Number(item.productId);
            if (!isNaN(pId)) {
              acc[pId] = item.quantity;
            }
            return acc;
          }, {}),
          direccionEnvio: orderData.direccionEnvio,
          metodoPago: orderData.metodoPago,
          subtotal: orderData.subtotal || 0,
          descuentoDuoc: orderData.descuentoDuoc || 0,
          descuentoPuntos: orderData.descuentoPuntos || 0,
          total: orderData.total || 0,
          puntosUsados: orderData.puntosUsados || 0,
          puntosGanados: orderData.puntosGanados || 0,
          notas: orderData.notas || null,
          creadoPor: orderData.creadoPor,
          adminId: orderData.adminId,
          adminNombre: orderData.adminNombre,
          userEmail: orderData.userEmail,
          userName: orderData.userName,
          userRut: orderData.userRut,
          userPhone: orderData.direccionEnvio?.telefono || "Sin teléfono"
        };

        console.log("OrderRepository: Sending order to backend:", backendPayload);
        const response = await axiosInstance.post('/orders', backendPayload);

        // Map backend response to frontend Order format
        const order = response.data;
        return {
          ...order,
          id: order.id?.toString() || `order_${Date.now()}`,
          numeroOrden: order.numeroOrden || `#ORD-${order.id}`,
          userName: order.user?.nombre || "Usuario Desconocido",
          userEmail: order.user?.email || order.user?.correo || "Sin email",
          userRut: order.user?.rut || "",
          userId: order.user?.id?.toString() || "",
          total: typeof order.total === 'number' ? order.total : parseFloat(order.total) || 0,
          puntosGanados: order.puntosGanados || 0,
          puntosUsados: order.puntosUsados || 0,
          estado: order.estado || 'pendiente',
          fechaCreacion: order.fechaCreacion || new Date().toISOString(),
          fechaActualizacion: order.fechaActualizacion || new Date().toISOString(),
          metodoPago: order.metodoPago || orderData.metodoPago || 'efectivo',
          direccionEnvio: order.direccionEnvio || orderData.direccionEnvio || {},
          items: (order.items && order.items.length > 0) ? order.items.map((item: any) => ({
            id: item.id,
            productId: item.product?.id?.toString() || "",
            productName: item.product?.nombre || "Producto Desconocido",
            productImage: item.product?.imagen || "/placeholder.svg",
            quantity: item.quantity || 0,
            unitPrice: item.price || 0,
            totalPrice: (item.price || 0) * (item.quantity || 0),
            puntosGanados: item.puntosGanados || 0
          })) : (orderData.items || []),
          datosPago: orderData.datosPago // Preserve frontend-only payment details
        };
      } catch (err: any) {
        console.error("OrderRepository: Backend creation failed, falling back to local:", err.response?.data || err.message);
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
