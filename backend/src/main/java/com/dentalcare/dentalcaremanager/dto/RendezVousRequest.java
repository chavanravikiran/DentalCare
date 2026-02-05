package com.dentalcare.dentalcaremanager.dto;

import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.rdv.StatusRdv;
import com.dentalcare.dentalcaremanager.rdv.TypeRdv;
import com.dentalcare.dentalcaremanager.user.User;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * DTO used to create an appointment
 * toEntity is used asid in the create method of RendezvousServiceImpl to simplify the code there
 * Receives only the necessary information from the frontend
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVousRequest {

    @NotNull(message = "The date is obligatory")
    @FutureOrPresent(message = "The appointment date must be in the future or today.")
    private LocalDate date;

    @NotNull(message = "The start time is mandatory")
    private LocalTime heureDebut;//startTime

    @NotNull(message = "The end time is mandatory")
    private LocalTime heureFin;//timeEnd

    @Enumerated(EnumType.STRING)
    @NotNull(message = "The type of appointment is required")
    private TypeRdv type; // ex: "CONSULTATION" "SUIVI", etc.

    private String motif; //pattern       // ex: "Urgence", "Contrôle", etc.

    @Enumerated(EnumType.STRING)
    private StatusRdv status; // Optional, but used in modification


    public RendezVous toEntity(User patient) {
        return RendezVous.builder()
                .date(this.date)
                .heureDebut(this.heureDebut)//startTime
                .heureFin(this.heureFin)//timeEnd
                .status(this.status != null ? this.status : StatusRdv.EN_ATTENTE)
                .archive(false)
                .motif(this.motif)//pattern
                .type(this.type != null ? this.type : TypeRdv.CONSULTATION)
                .patient(patient)
                .build();
    }


}
