package com.dentalcare.dentalcaremanager.dto;

import java.util.List;

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

//    private Long key;
//    private String websiteName;
//    private String websiteNameMr;
//    private String websiteNameHi;
//    private String oldWebsiteLink;
//    private String websiteLogo;
//    private String status;
//    
//	public static WebsiteDetailsDto init(WebsiteDetails entity,String status) {
//        return WebsiteDetailsDto.builder()
//                .key(entity.getKey())
//                .websiteName(entity.getWebsiteName())
//                .websiteNameMr(entity.getWebsiteNameMr())
//                .websiteNameHi(entity.getWebsiteNameHi())
//                .oldWebsiteLink(entity.getOldWebsiteLink())
//                .websiteLogo(entity.getWebsiteLogo())
//                .status(status)
//                .build();
//    }
	
    private Long key;
    private String websiteName;
    private String websiteNameMr;
    private String websiteNameHi;
    private String oldWebsiteLink;
    private String websiteLogo;
    private String shortAddress;
    private String address;
    private String email;
    private String phone;
    private String openingHours;

    private List<WebsiteSocialLinkDto> socialLinks;
    private String status;
    
    public static WebsiteDetailsDto init(WebsiteDetails entity, String status) {
        return WebsiteDetailsDto.builder()
                .key(entity.getKey())
                .websiteName(entity.getWebsiteName())
                .websiteNameMr(entity.getWebsiteNameMr())
                .websiteNameHi(entity.getWebsiteNameHi())
                .oldWebsiteLink(entity.getOldWebsiteLink())
                .websiteLogo(entity.getWebsiteLogo())
                .address(entity.getAddress())
                .shortAddress(entity.getShortAddress())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .openingHours(entity.getOpeningHours())
                .socialLinks(
                    entity.getSocialLinks()
                        .stream()
                        .filter(s -> s.getIsActive() == 'Y')
                        .map(s -> WebsiteSocialLinkDto.builder()
                                .platform(s.getPlatform())
                                .url(s.getUrl())
                                .icon(s.getIcon())
                                .build())
                        .toList()
                )
                .status(status)
                .build();
    }
}