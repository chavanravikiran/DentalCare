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
        // 🔐 Minimum security: checks essential parameters
        if (to == null || to.isBlank()) {
            throw new IllegalArgumentException("The recipient's email address is missing.");
        }
        if (emailTemplate == null) {
            throw new IllegalArgumentException("The email template is required.");
        }


        // 📄 Template name from the secure Enum
        String templateName = emailTemplate.getName();
        // ✉️ Preparing the message
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                UTF_8.name()
        );
        // 📦 Variables to inject into the template
        Map<String, Object> properties = new HashMap<>();
        properties.put("username", username);
        properties.put("confirmationUrl", confirmationUrl);
        properties.put("activation_code", activationCode);

        Context context = new Context();
        context.setVariables(properties);

        // 🔧 Email Setup
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(templateEngine.process(templateName, context), true);

        // 🚀 Sending the email
        mailSender.send(mimeMessage);
        
    }
}