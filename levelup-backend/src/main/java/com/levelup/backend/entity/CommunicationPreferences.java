package com.levelup.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class CommunicationPreferences {
    @Builder.Default
    private Boolean email = true;

    @Builder.Default
    private Boolean sms = false;
}
