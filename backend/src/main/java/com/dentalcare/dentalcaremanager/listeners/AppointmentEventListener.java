package com.dentalcare.dentalcaremanager.listeners;


import com.dentalcare.dentalcaremanager.events.AppointmentCreatedEvent;
import com.dentalcare.dentalcaremanager.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

//A listener that captures appointment creation events and triggers the sending of notifications.
@Slf4j
@Component
@RequiredArgsConstructor
public class AppointmentEventListener {

    private final NotificationService notificationService;

    /**
     * A method that listens for the appointment creation event and triggers notifications..
     *
     * @param event the captured appointment creation event
     */
    @EventListener
    public void handleAppointmentCreatedEvent(AppointmentCreatedEvent event) {
        try {
            log.info("Event captured: New appointment for patient {}", event.getPatient().getEmail());

            notificationService.sendNewAppointmentNotification(
                    event.getPatient(),
                    event.getRendezVous(),
                    event.getCreatedBy()
            );

        } catch (Exception e) {
            log.error("Error sending patient notification {}", event.getPatient().getEmail(), e);
        }
    }
}

