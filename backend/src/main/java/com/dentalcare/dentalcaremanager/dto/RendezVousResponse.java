package com.dentalcare.dentalcaremanager.dto;

import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.rdv.StatusRdv;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
/**
 * DTO exposed on the frontend to display appointments
 * without exposing sensitive patient information.
 */

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
    public class RendezVousResponse {


    private Integer id;
    private LocalDate date;
    private LocalTime heureDebut;//startTime
    private LocalTime heureFin;//timeEnd
    private String status;
    private String motif;//pattern
    private String nomPatient;//namePatient
    // ✅ We only extract the full name
    private String type;
    private String praticien;//practitioner
    private boolean isConfirmed;
    private boolean canBeCancelled;


    public static RendezVousResponse fromEntity(RendezVous rdv) {
        boolean isConfirmed = rdv.getStatus() == StatusRdv.CONFIRME;
        boolean canBeCancelled = rdv.getStatus() == StatusRdv.ON_HOLD;

        return RendezVousResponse.builder()
                .id(rdv.getId())
                .date(rdv.getDate())
                .heureDebut(rdv.getHeureDebut())
                .heureFin(rdv.getHeureFin())
                .status(rdv.getStatus().name())
                .motif(rdv.getMotif())
                .type(rdv.getType() != null ? rdv.getType().name() : null)
                .praticien(rdv.getPraticien())
                .nomPatient(rdv.getPatient() != null ? rdv.getPatient().getFullName() : "Unknown")
                .isConfirmed(isConfirmed)
                .canBeCancelled(canBeCancelled)
                .build();
    }

}
