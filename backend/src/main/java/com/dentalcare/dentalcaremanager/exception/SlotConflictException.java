package com.dentalcare.dentalcaremanager.exception;

/**
 * An exception is lifted when a time slot is already reserved.
 */
public class SlotConflictException extends RuntimeException {
    public SlotConflictException(String message) {
        super(message);
    }
}
