package com.dentalcare.dentalcaremanager.email;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.mail.javamail.MimeMessageHelper.MULTIPART_MODE_MIXED;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {


    @Value("${application.mailing.from}")
    private String from;

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Async
    public void sendEmail(
            String to,
            String username,
            EmailTemplateName emailTemplate,
            String confirmationUrl,
            String activationCode,
            String subject
    ) throws MessagingException {
        // 🔐 Sécurité minimale : vérifie les paramètres essentiels
        if (to == null || to.isBlank()) {
            throw new IllegalArgumentException("L'adresse e-mail du destinataire est manquante.");
        }
        if (emailTemplate == null) {
            throw new IllegalArgumentException("Le modèle d'email est requis.");
        }


        // 📄 Template name depuis l'Enum sécurisé
        String templateName = emailTemplate.getName();
        // ✉️ Préparation du message
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                UTF_8.name()
        );
        // 📦 Variables à injecter dans le template
        Map<String, Object> properties = new HashMap<>();
        properties.put("username", username);
        properties.put("confirmationUrl", confirmationUrl);
        properties.put("activation_code", activationCode);

        Context context = new Context();
        context.setVariables(properties);

        // 🔧 Configuration de l'e-mail
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(templateEngine.process(templateName, context), true);

        // 🚀 Envoi de l'email
        mailSender.send(mimeMessage);
    }
}