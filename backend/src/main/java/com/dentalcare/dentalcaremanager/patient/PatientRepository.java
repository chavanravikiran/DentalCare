package com.dentalcare.dentalcaremanager.patient;

import com.dentalcare.dentalcaremanager.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
//Direct access to the database via JPA + Interacts with PatientServiceImpl
public interface PatientRepository extends JpaRepository<Patient, Integer>, JpaSpecificationExecutor<Patient> {

    // 🔎 Search by user ID (if linked to an account)
    Optional<Patient> findByUser(User user);

    @Query("SELECT p FROM Patient p WHERE p.user.id = :userId")
    Optional<Patient> findByUserId(@Param("userId") Integer userId);

    // 🔎 Search by email
    Optional<Patient> findByEmail(String email);

    // 🔍 Quick search for autocomplete (name/surname/combination)
    List<Patient> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);

    // 📌 Patients created by the admin without a linked account
    List<Patient> findByUserIsNull();

    // 📌 Patients linked to a user account
    List<Patient> findByUserIsNotNull();

    // ✅ Patients activated / deactivated
    List<Patient> findByEnabled(boolean enabled);

    // 📅 Patients sorted by date of birth
    List<Patient> findAllByOrderByDateNaissanceAsc();

    // 🔒 Optional: duplicate ID card
    boolean existsByCin(String cin);

    // 🔍 Exact patient information based on first and last name (useful if no linked account)
    Optional<Patient> findByNomAndPrenom(String nom, String prenom);

    List<Patient> findByCreatedByAdminTrue();
    List<Patient> findByCreatedByAdminFalse(); // Patients linked to accounts created via /register

}
