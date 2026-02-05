package com.dentalcare.dentalcaremanager.websocket;

import com.dentalcare.dentalcaremanager.dto.NotificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * WebSocket controller dedicated to sending real-time notifications
 * to the Angular frontend via /topic/notifications.
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class NotificationSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Sends a notification to all subscribers of the WebSocket topic.
     *
     * @param response the NotificationResponse object to send
     */
    public void broadcastNotification(NotificationResponse response) {
        try {
            messagingTemplate.convertAndSend("/topic/notifications", response);
            log.info("📡 WebSocket notification sent to /topic/notifications for {}", response.getRecipientEmail());
        } catch (Exception e) {
            log.error("❌ WebSocket notification failed to send : {}", e.getMessage(), e);
        }
    }
}
