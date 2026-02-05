package com.dentalcare.dentalcaremanager.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountStatusResponse {
    private String email;
    private boolean enabled;
}
