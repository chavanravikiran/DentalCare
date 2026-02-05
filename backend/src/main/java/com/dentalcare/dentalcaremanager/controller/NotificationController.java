package com.dentalcare.dentalcaremanager.controller;



import com.dentalcare.dentalcaremanager.dto.NotificationResponse;
import com.dentalcare.dentalcaremanager.notifications.NotificationEntity;
import com.dentalcare.dentalcaremanager.notifications.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationRepository notificationRepository;

    /**
     * Retrieve all notifications (admin).
     */
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<NotificationResponse> getAllNotifications() {
        log.info("Retrieving all notifications");

        return notificationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieve notifications from the connected patient.
     */
    @GetMapping("/user")
    @PreAuthorize("hasAuthority('USER')")
    public List<NotificationResponse> getUserNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        log.info("Retrieving notifications for {}", email);

        return notificationRepository.findAll()
                .stream()
                .filter(n -> n.getRecipientEmail().equalsIgnoreCase(email))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Map a NotificationEntity to a NotificationResponse.
     */
    private NotificationResponse mapToResponse(NotificationEntity notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .recipientEmail(notification.getRecipientEmail())
                .notificationType(notification.getNotificationType())
                .status(notification.getStatus())
                .message(notification.getMessage())
                .attemptedAt(notification.getAttemptedAt())
                .build();
    }
}
