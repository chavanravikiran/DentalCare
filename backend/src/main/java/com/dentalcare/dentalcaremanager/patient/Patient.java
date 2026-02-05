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

    /** 🔗 Lien vers un compte utilisateur s'il existe */
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    private User user;

    /** ℹ️ Si true = ce patient a été ajouté manuellement par l'admin */
    private boolean createdByAdmin = false;

    /** 📅 Optionnel : permet de désactiver temporairement un patient sans supprimer */
    private LocalDate dateDesactivation;



}
