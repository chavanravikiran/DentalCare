package com.dentalcare.dentalcaremanager.patient;

import com.dentalcare.dentalcaremanager.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
//Accès direct à la base de données via JPA + Interagit avec PatientServiceImpl
public interface PatientRepository extends JpaRepository<Patient, Integer>, JpaSpecificationExecutor<Patient> {

    // 🔎 Recherche par identifiant utilisateur (si lié à un compte)
    Optional<Patient> findByUser(User user);

    @Query("SELECT p FROM Patient p WHERE p.user.id = :userId")
    Optional<Patient> findByUserId(@Param("userId") Integer userId);

    // 🔎 Recherche par email
    Optional<Patient> findByEmail(String email);

    // 🔍 Recherche rapide pour autocomplétion (nom/prénom/combinaison)
    List<Patient> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);

    // 📌 Patients créés par l’admin sans compte lié
    List<Patient> findByUserIsNull();

    // 📌 Patients liés à un compte utilisateur
    List<Patient> findByUserIsNotNull();

    // ✅ Patients activés / désactivés
    List<Patient> findByEnabled(boolean enabled);

    // 📅 Patients triés par date de naissance
    List<Patient> findAllByOrderByDateNaissanceAsc();

    // 🔒 Optionnel : doublon CIN
    boolean existsByCin(String cin);

    // 🔍 Patient exact selon nom + prénom (utile si pas de compte lié)
    Optional<Patient> findByNomAndPrenom(String nom, String prenom);

    List<Patient> findByCreatedByAdminTrue();
    List<Patient> findByCreatedByAdminFalse(); // Patients liés à des comptes créés via /register

}
