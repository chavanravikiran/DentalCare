package com.dentalcare.dentalcaremanager.dto;

import org.springframework.http.HttpStatus;

import com.dentalcare.dentalcaremanager.entity.WebsiteDetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebsiteDetailsDto {

    private Long key;
    private String websiteName;
    private String websiteNameMr;
    private String websiteNameHi;
    private String oldWebsiteLink;
    private String websiteLogo;
    private String status;
    
    
    public static WebsiteDetailsDto init(WebsiteDetails entity,String status) {
        return WebsiteDetailsDto.builder()
                .key(entity.getKey())
                .websiteName(entity.getWebsiteName())
                .websiteNameMr(entity.getWebsiteNameMr())
                .websiteNameHi(entity.getWebsiteNameHi())
                .oldWebsiteLink(entity.getOldWebsiteLink())
                .websiteLogo(entity.getWebsiteLogo())
                .status(status)
                .build();
    }
}