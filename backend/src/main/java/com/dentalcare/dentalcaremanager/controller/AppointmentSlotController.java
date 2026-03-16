package com.dentalcare.dentalcaremanager.controller;

import java.time.LocalDate;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.dentalcare.dentalcaremanager.entity.AppointmentSlot;
import com.dentalcare.dentalcaremanager.service.AppointmentSlotService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class AppointmentSlotController {

	private final AppointmentSlotService slotService;

	@GetMapping("/available")
	public List<AppointmentSlot> getAvailableSlots(@RequestParam Long doctorId, @RequestParam String date) {

		LocalDate slotDate = LocalDate.parse(date);

		return slotService.getAvailableSlots(doctorId, slotDate);
	}
}