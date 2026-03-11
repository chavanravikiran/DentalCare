package com.dentalcare.dentalcaremanager.service;

import com.dentalcare.dentalcaremanager.dto.NotificationResponse;
import com.dentalcare.dentalcaremanager.notifications.NotificationEntity;
import com.dentalcare.dentalcaremanager.notifications.NotificationRepository;
import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.user.User;
import com.dentalcare.dentalcaremanager.websocket.NotificationSocketController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationSocketController notificationSocketController;

    public void sendNewAppointmentNotification(User patient, RendezVous rendezVous, String createdBy) {
        try {
            String subject = "Confirmation of your DentalCare appointment";
            String message = buildNewAppointmentMessage(patient, rendezVous, createdBy);

            sendEmail(patient.getEmail(), subject, message);

            // ✅ Save and send via WebSocket
            sendAndBroadcast(patient.getEmail(), "NEW_APPOINTMENT", "SUCCESS", message, null, rendezVous);

            log.info("Appointment creation notification sent to {}", patient.getEmail());
        } catch (Exception e) {
            log.error("Error sending appointment creation notification to {}", patient.getEmail(), e);
            throw e;
        }
    }

    public void sendReminderNotification(User patient, RendezVous rendezVous) {
        try {
            String subject = "Reminder: DentalCare appointment tomorrow";
            String message = buildReminderMessage(patient, rendezVous);

            sendEmail(patient.getEmail(), subject, message);

            // ✅ Save and send via WebSocket
            sendAndBroadcast(patient.getEmail(), "REMINDER", "SUCCESS", message, null, rendezVous);

            log.info("Appointment reminder notification sent to {}", patient.getEmail());
        } catch (Exception e) {
            log.error("Error sending appointment reminder notification to {}", patient.getEmail(), e);
            throw e;
        }
    }

    // ============================================

    public void sendAndBroadcast(String recipientEmail, String type, String status, String message, String errorMessage, RendezVous rendezVous) {
        String trimmedMessage = (message != null && message.length() > 1000)
                ? message.substring(0, 1000) + "..."
                : message;

        NotificationEntity notification = NotificationEntity.builder()
                .recipientEmail(recipientEmail)
                .notificationType(type)
                .status(status)
                .message(trimmedMessage)
                .attemptedAt(LocalDateTime.now())
                .errorMessage(errorMessage)
                .rendezVousId(rendezVous != null ? rendezVous.getId() : null)
                .build();

        notificationRepository.save(notification);

        // 📡 WebSocket de diffusion
        notificationSocketController.broadcastNotification(
                NotificationResponse.builder()
                        .id(notification.getId())
                        .recipientEmail(notification.getRecipientEmail())
                        .notificationType(notification.getNotificationType())
                        .status(notification.getStatus())
                        .message(notification.getMessage())
                        .attemptedAt(notification.getAttemptedAt())
                        .build()
        );
    }

    private String buildNewAppointmentMessage(User patient, RendezVous rendezVous, String createdBy) {
        String intro = (createdBy != null)
                ? "Your appointment has been made by " + createdBy + "."
                : "You have booked a new appointment.";

        return String.format(
                "Good morning %s,\n\n%s\n\nAppointment details :\n- Date : %s\n- Hour : %s\n- Motif : %s\n\nSee you soon at DentalCare !",
                patient.getFirstname(),
                intro,
                rendezVous.getDate(),
                rendezVous.getHeureDebut(),
                rendezVous.getMotif()
        );
    }

    private String buildReminderMessage(User patient, RendezVous rendezVous) {
        return String.format(
                "Good morning %s,\n\nThis is a reminder for your appointment tomorrow. :\n- Date : %s\n- Hour : %s\n- Motif : %s\n\nThank you and see you soon at DentalCare !",
                patient.getFirstname(),
                rendezVous.getDate(),
                rendezVous.getHeureDebut(),
                rendezVous.getMotif()
        );
    }

    private void sendEmail(String to, String subject, String message) {
        // Email sending simulation
        log.info("=== Send Email ===\n HAS: {}\nSujet: {}\nMessage:\n{}\n", to, subject, message);
    }
}
