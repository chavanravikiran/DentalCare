package com.dentalcare.dentalcaremanager.service;

import com.dentalcare.dentalcaremanager.patient.Patient;
import com.dentalcare.dentalcaremanager.patient.PatientRepository;
import com.dentalcare.dentalcaremanager.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientCreatorService {

    private final PatientRepository patientRepository;

    @Transactional
    public void createPatientForUser(User user) {
        if (patientRepository.findByUser(user).isPresent()) {
            System.out.println("🔁 Existing patient for: " + user.getEmail());
            return;
        }

        Patient patient = Patient.builder()
                .prenom(user.getFirstname())
                .nom(user.getLastname())
                .email(user.getEmail())
                .enabled(true)
                .user(user)
                .createdByAdmin(false)
                .build();

        patientRepository.save(patient);
        System.out.println("✅ Patient Emails : " + user.getEmail());
        System.out.println("🛠️ Internal call successful: patient creation managed via PatientCreatorService");

    }
}
