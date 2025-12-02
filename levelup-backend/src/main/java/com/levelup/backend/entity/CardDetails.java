package com.levelup.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardDetails {

    private String numero; // Stored as masked: "**** **** **** 1234"
    private String fechaExpiracion;
    private String titular;

    /**
     * Masks a full card number to show only the last 4 digits.
     * Example: "4111111111111111" -> "**** **** **** 1111"
     * 
     * @param fullCardNumber The complete card number
     * @return Masked card number with only last 4 digits visible
     */
    public static String maskCardNumber(String fullCardNumber) {
        if (fullCardNumber == null || fullCardNumber.isEmpty()) {
            return "";
        }

        // Remove any spaces or dashes
        String cleanNumber = fullCardNumber.replaceAll("[\\s-]", "");

        // If already masked, return as is
        if (cleanNumber.contains("*")) {
            return fullCardNumber;
        }

        // Validate minimum length
        if (cleanNumber.length() < 4) {
            return "**** **** **** ****";
        }

        // Get last 4 digits
        String lastFour = cleanNumber.substring(cleanNumber.length() - 4);

        // Return masked format
        return "**** **** **** " + lastFour;
    }

    /**
     * Sets the card number, automatically masking it if it's a full number.
     * 
     * @param cardNumber The card number (full or already masked)
     */
    public void setNumero(String cardNumber) {
        this.numero = maskCardNumber(cardNumber);
    }
}
