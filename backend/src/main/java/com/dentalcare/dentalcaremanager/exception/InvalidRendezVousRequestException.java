package com.dentalcare.dentalcaremanager.exception;

/**
 * Exception levée lorsqu'une requête de création ou modification de rendez-vous est invalide
 */
public class InvalidRendezVousRequestException extends RuntimeException {
    public InvalidRendezVousRequestException(String message) {
        super(message);
    }
}
