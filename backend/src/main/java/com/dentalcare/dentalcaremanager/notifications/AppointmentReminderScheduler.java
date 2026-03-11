package com.dentalcare.dentalcaremanager.notifications;


import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.rdv.RendezVousRepository;
import com.dentalcare.dentalcaremanager.rdv.StatusRdv;
import com.dentalcare.dentalcaremanager.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * A scheduler that automatically sends reminders
 * 24 hours before confirmed appointments.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentReminderScheduler {

    private final RendezVousRepository rendezVousRepository;
    private final NotificationService notificationService;

    /**
     * Scheduled task to send reminders every hour.
     */
    @Scheduled(cron = "0 0 * * * *") // Every hour on the hour (HH:00)
    public void scheduleReminderNotifications() {
        log.info("Starting the appointment reminder scheduler...");

        try {
            LocalDate tomorrow = LocalDate.now().plusDays(1);
            List<RendezVous> rendezVousList = rendezVousRepository.findByDateAndStatus(tomorrow, StatusRdv.CONFIRME);

            log.info("Number of appointments confirmed for tomorrow : {}", rendezVousList.size());

            for (RendezVous rdv : rendezVousList) {
                try {
                    if (rdv.getPatient() != null) {
                        notificationService.sendReminderNotification(rdv.getPatient(), rdv);
                    } else {
                        log.warn("Patient missed appointment id={}, skipping notification", rdv.getId());
                    }
                } catch (Exception e) {
                    log.error("Error sending appointment reminder id={}", rdv.getId(), e);
                }
            }

        } catch (Exception e) {
            log.error("Global error in the appointment reminder scheduler", e);
        }

        log.info("End of appointment reminder scheduler.");
    }
}

