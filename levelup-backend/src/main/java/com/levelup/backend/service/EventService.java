package com.levelup.backend.service;

import com.levelup.backend.entity.Event;
import com.levelup.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = getEventById(id);
        event.setTitulo(eventDetails.getTitulo());
        event.setDescripcion(eventDetails.getDescripcion());
        event.setFecha(eventDetails.getFecha());
        event.setUbicacion(eventDetails.getUbicacion());
        event.setImagen(eventDetails.getImagen());
        // Update other fields
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
}
