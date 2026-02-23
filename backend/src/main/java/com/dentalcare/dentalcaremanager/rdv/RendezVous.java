package com.dentalcare.dentalcaremanager.rdv;

import com.dentalcare.dentalcaremanager.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;


@Entity
@Table(name = "rendezvous")//appointment
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVous {//appointment

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDate date;

    private LocalTime heureDebut;

    private LocalTime heureFin;

    @Enumerated(EnumType.STRING)
    private StatusRdv status; // ON_HOLD, CONFIRME, CANCELED

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User patient;


    @Column(length = 512)
    private String motif;

    private boolean archive;

    // ✅ Type de rendez-vous : Consultation, Détartrage, etc.
    @Enumerated(EnumType.STRING)
    private TypeRdv type;

    // ✅ Facultatif : pour futur gestion multidocteurs
    private String praticien; // ex: "Dr. Zahra"

    @Version
    private Long version;

    @Column(updatable = false)
    private LocalDate createdAt;

    private LocalDate updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDate.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDate.now();
    }

}

