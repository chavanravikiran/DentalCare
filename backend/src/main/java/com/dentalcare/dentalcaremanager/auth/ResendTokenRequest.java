package com.dentalcare.dentalcaremanager.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResendTokenRequest {
    @NotBlank
    @Email
    private String email;
}
