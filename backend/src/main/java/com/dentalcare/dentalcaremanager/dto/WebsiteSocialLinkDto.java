package com.dentalcare.dentalcaremanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebsiteSocialLinkDto {
    private String platform;
    private String url;
    private String icon;
}

