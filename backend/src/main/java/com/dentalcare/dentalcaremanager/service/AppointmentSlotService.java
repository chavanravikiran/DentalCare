package com.dentalcare.dentalcaremanager.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import com.dentalcare.dentalcaremanager.entity.AppointmentSlot;
import com.dentalcare.dentalcaremanager.repository.AppointmentSlotRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentSlotService {

	private final AppointmentSlotRepository slotRepository;

	public List<AppointmentSlot> getAvailableSlots(Long doctorId, LocalDate date) {

		if (date.isBefore(LocalDate.now())) {
			throw new RuntimeException("Past dates not allowed");
		}

		return slotRepository.findByDoctorIdAndSlotDateAndIsActive(doctorId, date, 'Y').stream()
				.filter(slot -> !slot.isBooked()).toList();
	}

}