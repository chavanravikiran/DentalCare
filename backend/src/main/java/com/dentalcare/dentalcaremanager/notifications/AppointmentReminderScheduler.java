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
 * Scheduler qui envoie automatiquement des rappels
 * 24h avant les rendez-vous confirmés.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentReminderScheduler {

    private final RendezVousRepository rendezVousRepository;
    private final NotificationService notificationService;

    /**
     * Tâche planifiée pour envoyer des rappels toutes les heures.
     */
    @Scheduled(cron = "0 0 * * * *") // Toutes les heures pile (HH:00)
    public void scheduleReminderNotifications() {
        log.info("Démarrage du scheduler de rappel de rendez-vous...");

        try {
            LocalDate tomorrow = LocalDate.now().plusDays(1);
            List<RendezVous> rendezVousList = rendezVousRepository.findByDateAndStatus(tomorrow, StatusRdv.CONFIRME);

            log.info("Nombre de rendez-vous confirmés pour demain : {}", rendezVousList.size());

            for (RendezVous rdv : rendezVousList) {
                try {
                    if (rdv.getPatient() != null) {
                        notificationService.sendReminderNotification(rdv.getPatient(), rdv);
                    } else {
                        log.warn("Patient nul pour RDV id={}, skipping notification", rdv.getId());
                    }
                } catch (Exception e) {
                    log.error("Erreur lors de l'envoi du rappel pour RDV id={}", rdv.getId(), e);
                }
            }

        } catch (Exception e) {
            log.error("Erreur globale du scheduler de rappel de rendez-vous", e);
        }

        log.info("Fin du scheduler de rappel de rendez-vous.");
    }
}

