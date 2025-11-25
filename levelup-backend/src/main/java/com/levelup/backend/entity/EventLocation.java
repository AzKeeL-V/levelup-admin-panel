package com.levelup.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventLocation {
    private Double latitud;
    private Double longitud;
    private String direccion;
    private String ciudad;
    private String region;
}
