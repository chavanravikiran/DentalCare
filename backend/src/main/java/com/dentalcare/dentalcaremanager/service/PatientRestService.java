package com.dentalcare.dentalcaremanager.service;

import com.dentalcare.dentalcaremanager.dto.PatientRequest;
import com.dentalcare.dentalcaremanager.dto.PatientResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PatientRestService {

    /**
     * 🔄 Creates a new patient (used on the admin side).
     */
    PatientResponse createPatient(PatientRequest request);

    /**
     * 🔍 Retrieve all the patients.
     */
    List<PatientResponse> getAllPatients();

    /**
     * 🔍 Retrieves a patient by their ID.
     */
    PatientResponse getPatientById(Integer id);

    /**
     * ♻️ Updates an existing patient.
     */
    PatientResponse updatePatient(Integer id, PatientRequest request);

    /**
     * ❌ Delete a patient by their ID.
     */
    void deletePatient(Integer id);

    /**
     * 🔍 Searching for patients based on several criteria.
     */
    List<PatientResponse> searchPatients(String nom, String email, Integer userId);

    List<PatientResponse> getPatientsWithUserAccount();
    Page<PatientResponse> getPaginatedPatients(int page, int size, String nom, Boolean createdByAdmin, Boolean enabled);
    PatientResponse getPatientByEmail(String email);
    PatientResponse getCurrentPatient();


}
