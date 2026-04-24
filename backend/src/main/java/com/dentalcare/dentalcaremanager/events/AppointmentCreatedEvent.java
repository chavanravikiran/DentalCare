package com.dentalcare.dentalcaremanager.events;


import com.dentalcare.dentalcaremanager.patient.Patient;
import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.user.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEvent;

/**
 * Event emitted when a new appointment is created.
 * Serves as a message to trigger notifications.
 */
@Getter
public class AppointmentCreatedEvent extends ApplicationEvent {

    private final User patient;
    private final RendezVous rendezVous;
    private final String createdBy; // Optional: Who created the reservation?

    /**
     * Main constructor without a field createdBy
     */
    public AppointmentCreatedEvent(Object source, User patient, RendezVous rendezVous) {
        super(source);
        this.patient = patient;
        this.rendezVous = rendezVous;
        this.createdBy = null;
    }

    /**
     * Secondary constructor with createdBy specified
     */
    public AppointmentCreatedEvent(Object source, User patient, RendezVous rendezVous, String createdBy) {
        super(source);
        this.patient = patient;
        this.rendezVous = rendezVous;
        this.createdBy = createdBy;
    }
}
