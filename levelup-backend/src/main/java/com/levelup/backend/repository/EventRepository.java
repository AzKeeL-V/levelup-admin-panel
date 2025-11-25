package com.levelup.backend.repository;

import com.levelup.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByTipo(String tipo);

    List<Event> findByEstado(String estado);

    List<Event> findByActivoTrue();
}
