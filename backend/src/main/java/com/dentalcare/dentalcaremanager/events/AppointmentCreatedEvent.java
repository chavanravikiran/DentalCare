package com.dentalcare.dentalcaremanager.events;


import com.dentalcare.dentalcaremanager.patient.Patient;
import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.user.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEvent;

/**
 * Événement émis lorsqu'un nouveau rendez-vous est créé.
 * Sert de message pour déclencher les notifications.
 */
@Getter
public class AppointmentCreatedEvent extends ApplicationEvent {

    private final User patient;
    private final RendezVous rendezVous;
    private final String createdBy; // optionnel : qui a créé la réservation

    /**
     * Constructeur principal sans champ createdBy
     */
    public AppointmentCreatedEvent(Object source, User patient, RendezVous rendezVous) {
        super(source);
        this.patient = patient;
        this.rendezVous = rendezVous;
        this.createdBy = null;
    }

    /**
     * Constructeur secondaire avec createdBy renseigné
     */
    public AppointmentCreatedEvent(Object source, User patient, RendezVous rendezVous, String createdBy) {
        super(source);
        this.patient = patient;
        this.rendezVous = rendezVous;
        this.createdBy = createdBy;
    }
}
