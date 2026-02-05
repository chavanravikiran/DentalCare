package com.dentalcare.dentalcaremanager.service;

import com.dentalcare.dentalcaremanager.dto.PatientRequest;
import com.dentalcare.dentalcaremanager.dto.PatientResponse;
import com.dentalcare.dentalcaremanager.patient.Patient;
import com.dentalcare.dentalcaremanager.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.dentalcare.dentalcaremanager.patient.PatientRepository;

import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
public class PatientRestServiceImpl implements PatientRestService {

    private final PatientService patientService;
    private final PatientRepository patientRepository;

    private void mapRequestToPatient(PatientRequest request, Patient patient) {
        patient.setNom(request.getNom());
        patient.setPrenom(request.getPrenom());
        patient.setEmail(request.getEmail());
        patient.setCin(request.getCin());
        patient.setDateNaissance(request.getDateNaissance());
        patient.setAdresse(request.getAdresse());
        patient.setGenre(request.getGenre());
        patient.setEnabled(request.isEnabled());
    }


    @Override
    public PatientResponse createPatient(PatientRequest request) {
        Patient patient = new Patient();
        mapRequestToPatient(request, patient);
        patient.setCreatedByAdmin(true);

        if (request.getUserId() != null) {
            User user = patientService.findUserById(request.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
            patient.setUser(user);
        }

        Patient saved = patientService.save(patient);
        return mapToResponse(saved);
    }

    @Override
    public List<PatientResponse> getAllPatients() {
        return patientService.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public PatientResponse getPatientById(Integer id) {
        System.out.println("🔍 [Backend] Patient wanted ID = " + id);
        Patient patient = patientService.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found"));
        return mapToResponse(patient);
    }

    @Override
    public PatientResponse updatePatient(Integer id, PatientRequest request) {
        Patient patient = patientService.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

        mapRequestToPatient(request, patient);
        patient.setEnabled(request.isEnabled());

        return mapToResponse(patientService.save(patient));
    }

    @Override
    public void deletePatient(Integer id) {
        Patient patient = patientService.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found ID=" + id));

        patientService.deleteById(id);
        log.info("🗑️ Patient deleted : ID={}, Nom={} {}", patient.getId(), patient.getNom(), patient.getPrenom());
    }

    @Override
    public List<PatientResponse> searchPatients(String nom, String email, Integer userId) {
        return patientService.search(nom).stream()
                .filter(p ->
                        (email == null || p.getEmail().equalsIgnoreCase(email)) &&
                                (userId == null || (p.getUser() != null && p.getUser().getId().equals(userId)))
                )
                .map(this::mapToResponse)
                .toList();
    }
    /** 🧠 Mapping DTO */
    private PatientResponse mapToResponse(Patient patient) {
        return PatientResponse.builder()
                .id(patient.getId())
                .nom(patient.getNom())
                .prenom(patient.getPrenom())
                .email(patient.getEmail())
                .cin(patient.getCin())
                .dateNaissance(patient.getDateNaissance())
                .adresse(patient.getAdresse())
                .genre(patient.getGenre())
                .enabled(patient.isEnabled())
                .createdByAdmin(patient.isCreatedByAdmin())
                .dateDesactivation(patient.getDateDesactivation())
                .userId(patient.getUser() != null ? patient.getUser().getId() : null)
                .build();
    }
    @Override
    public List<PatientResponse> getPatientsWithUserAccount() {
        return patientService.getPatientsWithUserAccount()
                .stream()
                .map(this::mapToResponse) // ✅ conversion propre
                .toList();
    }
    @Override
    public Page<PatientResponse> getPaginatedPatients(int page, int size, String nom, Boolean createdByAdmin, Boolean enabled) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Patient> patientsPage = patientService.getFilteredPatients(pageable, nom, createdByAdmin, enabled);
        return patientsPage.map(this::mapToResponse);
    }

    @Override
    public PatientResponse getPatientByEmail(String email) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("No patients found for the email address : " + email));
        return mapToResponse(patient);
    }


    @Override
    public PatientResponse getCurrentPatient() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = patientService.findUserById(
                patientService.findUserByEmail(email)
                        .orElseThrow(() -> new EntityNotFoundException("User not found"))
                        .getId()
        ).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Patient patient = patientService.findByUserId(user.getId())
                .orElseThrow(() -> new EntityNotFoundException("No patients associated with the user"));

        return mapToResponse(patient);
    }


}
