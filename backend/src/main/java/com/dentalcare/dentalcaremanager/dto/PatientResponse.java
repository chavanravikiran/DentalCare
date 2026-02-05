package com.dentalcare.dentalcaremanager.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

//Used to return data to the frontend (GET) + interacts with PatientServiceImpl, PatientController
@Data
@Builder
public class PatientResponse {

    private Integer id;

    private String nom;//name

    private String prenom;//firstName

    private String email;

    private String cin;

    private LocalDate dateNaissance; //dateOfBirth

    private String adresse;//address

    private String genre;//gender

    private Boolean enabled;

    private Boolean createdByAdmin;

    private LocalDate dateDesactivation;

    private Integer userId; // null if unrelated
}