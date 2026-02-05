package com.dentalcare.dentalcaremanager.notifications;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entité représentant une notification envoyée par le système.
 */
@Entity
@Table(name = "notifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String recipientEmail;

    private String notificationType; // NEW_APPOINTMENT, REMINDER, etc.

    private String status; // SUCCESS ou FAILURE

    @Column(length = 2000)
    private String message;

    private LocalDateTime attemptedAt;
    @Column
    private Integer rendezVousId;

    @Column(length = 1000)
    private String errorMessage; // peut être null si pas d'erreur
}
