package com.dentalcare.dentalcaremanager.service;

import org.springframework.http.ResponseEntity;

import com.dentalcare.dentalcaremanager.dto.MessageResponse;
import com.dentalcare.dentalcaremanager.dto.WebsiteDetailsDto;

public interface WebsiteService {

	ResponseEntity<WebsiteDetailsDto> findByWebsiteName(String websiteName);
	
}
