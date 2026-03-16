package com.dentalcare.dentalcaremanager.rdv;

import java.time.LocalDate;
import java.time.LocalTime;

import com.dentalcare.dentalcaremanager.entity.AppointmentSlot;
import com.dentalcare.dentalcaremanager.entity.Doctor;
import com.dentalcare.dentalcaremanager.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


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
    
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "slot_id")
    private AppointmentSlot slot;

}

