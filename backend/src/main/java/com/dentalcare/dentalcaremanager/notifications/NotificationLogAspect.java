package com.dentalcare.dentalcaremanager.notifications;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class NotificationLogAspect {

    private final NotificationRepository notificationRepository;

    @AfterThrowing(pointcut = "execution(* com.dentalcare.dentalcaremanager.service.NotificationService.send*(..))", throwing = "ex")
    public void logAfterFailedNotification(JoinPoint joinPoint, Throwable ex) {
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        log.error("[NotificationLogAspect] Échec méthode '{}', destinataire : {}, exception : {}",
                methodName, extractRecipient(args), ex.getMessage());

        // 🔥 Enregistrer l'échec dans la base
        NotificationEntity failedNotification = NotificationEntity.builder()
                .recipientEmail(extractRecipient(args))
                .notificationType(methodName.toUpperCase()) // Ex: SENDNEWAPPOINTMENTNOTIFICATION
                .status("FAILURE")
                .message("Erreur lors de l'envoi de notification.")
                .attemptedAt(LocalDateTime.now())
                .errorMessage(ex.getMessage())
                .build();

        notificationRepository.save(failedNotification);
    }

    private String extractRecipient(Object[] args) {
        if (args != null && args.length > 0 && args[0] instanceof com.dentalcare.dentalcaremanager.user.User user) {
            return user.getEmail();
        }
        return "Inconnu";
    }
}
