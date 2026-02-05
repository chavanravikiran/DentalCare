package com.dentalcare.dentalcaremanager.service;

import com.dentalcare.dentalcaremanager.patient.Patient;
import com.dentalcare.dentalcaremanager.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
//Defines the necessary business functionalities + interaction with PatientServiceImpl, PatientController
public interface PatientService {

    /**
     * 🔍 Searching for a patient by ID.
     */
    Optional<Patient> findById(Integer id);

    /**
     * 🔍 Searching for a patient via the linked user ID.
     */
    Optional<Patient> findByUserId(Integer userId);

    /**
     * ✅ Automatically creates a patient from an existing user.
     * Used for user accounts registered via the public interface.
     *
     * @param user 
     */
    void createPatientForUser(User user);

    /**
     * ✅ Variant for creating a patient from a user ID.
     *
     * @param userId
     */
    void createPatientForUser(Integer userId);

    /**
     * 📋 Retrieves all patients (admin).
     */
    List<Patient> findAll();

    /**
     * 💾 Saves or updates a patient.
     */
    Patient save(Patient patient);

    /**
     * ❌ Delete one patient per ID.
     */
    void deleteById(Integer id);

    /**
     * 🔍 Recherche avancée par nom, prénom ou email (partiel ou complet).
     */
    List<Patient> search(String keyword);

    /**
     * 👤 Searching for a user via their ID (used in RestService).
     */
    Optional<User> findUserById(Integer id);

    List<Patient> getPatientsWithUserAccount();
    int synchronizeAllPatientsFromUsers();
    Page<Patient> getFilteredPatients(Pageable pageable, String nom, Boolean createdByAdmin, Boolean enabled);
    Optional<User> findUserByEmail(String email);

}
