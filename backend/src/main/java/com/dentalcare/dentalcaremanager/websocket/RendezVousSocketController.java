package com.dentalcare.dentalcaremanager.websocket;

import com.dentalcare.dentalcaremanager.dto.RendezVousResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RendezVousSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastRdvCreated(RendezVousResponse response) {
        messagingTemplate.convertAndSend("/topic/rdv/new", response);
    }

    public void broadcastRdvConfirmed(RendezVousResponse response) {
        messagingTemplate.convertAndSend("/topic/rdv/confirmed", response);
    }

    public void broadcastRdvRejected(RendezVousResponse response) {
        messagingTemplate.convertAndSend("/topic/rdv/rejected", response);
    }
}
