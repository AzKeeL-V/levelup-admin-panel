import api from './api';
import { Event } from '../types/Event';

const EventService = {
    getAllEvents: async (): Promise<Event[]> => {
        const response = await api.get('/events');
        return response.data;
    },

    getEventById: async (id: string): Promise<Event> => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    createEvent: async (event: Event): Promise<Event> => {
        const response = await api.post('/events', event);
        return response.data;
    },

    updateEvent: async (id: string, event: Event): Promise<Event> => {
        const response = await api.put(`/events/${id}`, event);
        return response.data;
    },

    deleteEvent: async (id: string): Promise<void> => {
        await api.delete(`/events/${id}`);
    },
};

export default EventService;
