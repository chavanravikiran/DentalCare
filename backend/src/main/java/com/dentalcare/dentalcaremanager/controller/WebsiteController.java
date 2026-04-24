package com.dentalcare.dentalcaremanager.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dentalcare.dentalcaremanager.dto.AppointmentSlotDTO;
import com.dentalcare.dentalcaremanager.dto.WebsiteDetailsDto;
import com.dentalcare.dentalcaremanager.entity.AppointmentSlot;
import com.dentalcare.dentalcaremanager.service.AppointmentSlotService;
import com.dentalcare.dentalcaremanager.service.WebsiteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/website")
@RequiredArgsConstructor
public class WebsiteController {
    private final WebsiteService websiteService;
	
    @GetMapping("/getWebsite")
	public ResponseEntity<WebsiteDetailsDto> getWebsiteDetails(@RequestParam String websiteName){
		return websiteService.findByWebsiteName(websiteName);
	}
	
    private final AppointmentSlotService slotService;

    @GetMapping("/slots/available")
    public List<AppointmentSlotDTO> getAvailableSlots(
            @RequestParam Long doctorId,
            @RequestParam String date) {

        LocalDate slotDate = LocalDate.parse(date);
        return slotService.getAvailableSlots(doctorId, slotDate);
    }
}
