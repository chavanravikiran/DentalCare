package com.dentalcare.dentalcaremanager.exception;

/**
 * Exception levée lorsqu'un créneau horaire est déjà réservé
 */
public class SlotConflictException extends RuntimeException {
    public SlotConflictException(String message) {
        super(message);
    }
}
