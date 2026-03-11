package com.dentalcare.dentalcaremanager.patient;

import com.dentalcare.dentalcaremanager.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String cin;

    private String nom;

    private String prenom;

    private String email;


    private LocalDate dateNaissance;

    private String adresse;

    private String genre;

    private boolean enabled = true;

    /** 🔗 Link to a user account, if one exists. */
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    private User user;

    /** ℹ️ If true = this patient was added manually by the admin */
    private boolean createdByAdmin = false;

    /** 📅 Optional: allows you to temporarily disable a patient without deleting them */
    private LocalDate dateDesactivation;



}
