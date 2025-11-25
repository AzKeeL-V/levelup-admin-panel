import { Event } from "@/types/Event";
import axiosInstance from "@/utils/axiosInstance"; // Usa la instancia de axios para backend

export class EventRepository {
  private static readonly STORAGE_KEY = "levelup_events";

  static async findAll(): Promise<Event[]> {
    try {
      // Si existe backend, usa axios. Si no, usa localStorage o JSON local.
      try {
        const response = await axiosInstance.get('/events');
        return response.data;
      } catch (err) {
        // Si falla axios (no hay backend), usa localStorage o JSON local
      }
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Cargar desde JSON si no hay datos en localStorage
      if (typeof fetch !== 'undefined') {
        const response = await fetch('/levelup_events.json');
        if (!response.ok) {
          throw new Error('Error al cargar eventos desde JSON');
        }
        const events = await response.json();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
        return events;
      }
      return [];
    } catch (error) {
      console.error("Error loading events:", error);
      return [];
    }
  }

  static async findActive(): Promise<Event[]> {
    const events = await this.findAll();
    return events.filter(event => event.activo);
  }

  static async findById(id: string): Promise<Event | null> {
    const events = await this.findAll();
    return events.find(event => event.id === id) || null;
  }

  static async create(event: Omit<Event, "id" | "fechaCreacion" | "inscritos">): Promise<Event> {
    const events = await this.findAll();
    const newEvent: Event = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fechaCreacion: new Date().toISOString(),
      inscritos: 0
    };

    events.push(newEvent);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
    return newEvent;
  }

  static async update(id: string, eventData: Partial<Event>): Promise<void> {
    const events = await this.findAll();
    const index = events.findIndex(event => event.id === id);

    if (index !== -1) {
      events[index] = { ...events[index], ...eventData };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
    }
  }

  static async delete(id: string): Promise<void> {
    const events = await this.findAll();
    const filteredEvents = events.filter(event => event.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredEvents));
  }

  static async toggleActive(id: string): Promise<void> {
    const event = await this.findById(id);
    if (event) {
      await this.update(id, { activo: !event.activo });
    }
  }

  static async registerAttendee(eventId: string): Promise<void> {
    const event = await this.findById(eventId);
    if (event && event.inscritos !== undefined) {
      await this.update(eventId, { inscritos: event.inscritos + 1 });
    }
  }

  static async unregisterAttendee(eventId: string): Promise<void> {
    const event = await this.findById(eventId);
    if (event && event.inscritos !== undefined && event.inscritos > 0) {
      await this.update(eventId, { inscritos: event.inscritos - 1 });
    }
  }
}
