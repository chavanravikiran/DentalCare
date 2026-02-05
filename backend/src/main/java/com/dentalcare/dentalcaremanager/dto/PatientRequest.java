package com.dentalcare.dentalcaremanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "The first name must not exceed 50 characters.")
    private String prenom;//firstName

    @NotBlank(message = "Name is required")
    @Size(max = 50, message = "The name must not exceed 50 characters.")
    private String nom; //name

    @NotBlank(message = "Email is required")
    @Email(message = "The email address is invalid.")
    private String email;

    private String cin;

    private LocalDate dateNaissance; // format ISO-8601, ex: "2000-05-12" //dateOfBirth

    private String adresse;

    private String genre; // Ex: "Man", "Woman", "Other" //gender

    private boolean enabled = true;

    // This field is useful if you want to associate an existing user.
    private Integer userId;
}
