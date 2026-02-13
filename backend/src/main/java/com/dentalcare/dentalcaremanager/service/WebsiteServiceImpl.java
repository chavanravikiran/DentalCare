package com.dentalcare.dentalcaremanager.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.dentalcare.dentalcaremanager.dto.WebsiteDetailsDto;
import com.dentalcare.dentalcaremanager.repository.WebsiteDetailRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class WebsiteServiceImpl implements WebsiteService {
    private final WebsiteDetailRepository websiteDetailRepository;
	
//    public ResponseEntity<WebsiteDetailsDto> findByWebsiteName(String websiteName) {
//
//    	Optional<WebsiteDetails> optionalWebsite = websiteDetailRepository.findByWebsiteNameAndIsActive(websiteName, 'Y');
//
//        if (optionalWebsite.isPresent()) {
//            return ResponseEntity.ok(WebsiteDetailsDto.init(optionalWebsite.get(),"SUCCESS"));
//        }
//		return ResponseEntity.ok(WebsiteDetailsDto.init(optionalWebsite.get(),"SOMETHING WENT WRONG"));
//    }

    public ResponseEntity<WebsiteDetailsDto> findByWebsiteName(String websiteName) {
        return websiteDetailRepository.findByWebsiteNameAndIsActive(websiteName, 'Y')
                .map(entity -> ResponseEntity.ok(WebsiteDetailsDto.init(entity, "SUCCESS")))
                .orElse(ResponseEntity.ok(WebsiteDetailsDto.builder()
                                        .status("NOT_FOUND")
                                        .build()
                        )
                );
    }
	
}
