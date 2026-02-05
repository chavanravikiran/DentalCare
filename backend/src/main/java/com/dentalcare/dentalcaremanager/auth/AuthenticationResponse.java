package com.dentalcare.dentalcaremanager.auth;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenticationResponse {

    private String token;

    // 🔁 For future implementation of refresh tokens (auth persistence)
    private String refreshToken;

    // 👤 Useful user information for frontend display
    private String email;
    private String fullName;

    // 🔐 To dynamically display or restrict permissions (Angular)
    private List<String> roles;
}
