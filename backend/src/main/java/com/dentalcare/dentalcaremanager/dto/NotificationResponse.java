package com.dentalcare.dentalcaremanager.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NotificationResponse {

    private Integer id;
    private String recipientEmail;
    private String notificationType;
    private String status;
    private String message;
    private LocalDateTime attemptedAt;
}
