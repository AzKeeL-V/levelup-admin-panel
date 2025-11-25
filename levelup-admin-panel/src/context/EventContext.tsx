import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Event } from "@/types/Event";
import { EventRepository } from "@/repositories/EventRepository";

interface EventContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
  addEvent: (event: Omit<Event, "id" | "fechaCreacion" | "inscritos">) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  toggleEventActive: (id: string) => Promise<void>;
  registerAttendee: (eventId: string) => Promise<void>;
  unregisterAttendee: (eventId: string) => Promise<void>;
  getActiveEvents: () => Promise<Event[]>;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      console.log("EventContext: Loading events...");
      setLoading(true);
      setError(null);
      const eventData = await EventRepository.findAll();
      console.log("EventContext: Events loaded:", eventData?.length || 0, "events");
      setEvents(eventData);
    } catch (err) {
      console.error("EventContext: Error loading events:", err);
      setError(err instanceof Error ? err.message : "Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const addEvent = useCallback(async (event: Omit<Event, "id" | "fechaCreacion" | "inscritos">) => {
    try {
      setError(null);
      await EventRepository.create(event);
      await loadEvents(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear evento";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadEvents]);

  const updateEvent = useCallback(async (id: string, eventData: Partial<Event>) => {
    try {
      setError(null);
      await EventRepository.update(id, eventData);
      await loadEvents(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar evento";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadEvents]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      setError(null);
      await EventRepository.delete(id);
      await loadEvents(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar evento";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadEvents]);

  const toggleEventActive = useCallback(async (id: string) => {
    try {
      setError(null);
      await EventRepository.toggleActive(id);
      await loadEvents();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cambiar estado del evento";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadEvents]);

  const registerAttendee = useCallback(async (eventId: string) => {
    try {
      setError(null);
      await EventRepository.registerAttendee(eventId);
      await loadEvents();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al registrar asistente";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadEvents]);

  const unregisterAttendee = useCallback(async (eventId: string) => {
    try {
      setError(null);
      await EventRepository.unregisterAttendee(eventId);
      await loadEvents();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al quitar registro de asistente";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadEvents]);

  const getActiveEvents = useCallback(async () => {
    try {
      return await EventRepository.findActive();
    } catch (err) {
      console.error("Error getting active events:", err);
      throw err;
    }
  }, []);

  const refreshEvents = useCallback(async () => {
    await loadEvents();
  }, [loadEvents]);

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        error,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleEventActive,
        registerAttendee,
        unregisterAttendee,
        getActiveEvents,
        refreshEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
