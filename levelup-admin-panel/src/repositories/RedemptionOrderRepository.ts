import { RedemptionOrder } from "@/types/RedemptionOrder";

const STORAGE_KEY = "redemption_orders";
const COUNTER_KEY = "redemption_order_counter";

export class RedemptionOrderRepository {
  static create(order: RedemptionOrder): void {
    try {
      const orders = this.getAll();
      orders.push(order);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Error creating redemption order:", error);
    }
  }

  static getAll(): RedemptionOrder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error fetching redemption orders:", error);
      return [];
    }
  }

  static getById(id: string): RedemptionOrder | null {
    try {
      const orders = this.getAll();
      return orders.find(order => order.id === id) || null;
    } catch (error) {
      console.error("Error fetching redemption order:", error);
      return null;
    }
  }

  static getByUserId(usuarioId: string): RedemptionOrder[] {
    try {
      const orders = this.getAll();
      return orders.filter(order => order.usuarioId === usuarioId);
    } catch (error) {
      console.error("Error fetching user redemption orders:", error);
      return [];
    }
  }

  static update(id: string, updates: Partial<RedemptionOrder>): void {
    try {
      const orders = this.getAll();
      const index = orders.findIndex(order => order.id === id);
      if (index !== -1) {
        orders[index] = { ...orders[index], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      }
    } catch (error) {
      console.error("Error updating redemption order:", error);
    }
  }

  static delete(id: string): void {
    try {
      const orders = this.getAll();
      const filtered = orders.filter(order => order.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting redemption order:", error);
    }
  }

  static generateOrderNumber(): string {
    try {
      let counter = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10);
      counter++;
      localStorage.setItem(COUNTER_KEY, counter.toString());
      const year = new Date().getFullYear();
      return `CANJE-${String(counter).padStart(3, "0")}-${year}`;
    } catch (error) {
      console.error("Error generating order number:", error);
      return `CANJE-${Date.now()}`;
    }
  }
}
