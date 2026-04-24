package com.dentalcare.dentalcaremanager.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dentalcare.dentalcaremanager.dto.AppointmentSlotDTO;
import com.dentalcare.dentalcaremanager.entity.AppointmentSlot;
import com.dentalcare.dentalcaremanager.rdv.RendezVousRepository;
import com.dentalcare.dentalcaremanager.repository.AppointmentSlotRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentSlotService {

	private final AppointmentSlotRepository slotRepository;
	private final RendezVousRepository rendezVousRepository;

	public List<AppointmentSlotDTO> getAvailableSlots(Long doctorId, LocalDate date) {

	    List<AppointmentSlot> slots =
	            slotRepository.findByDoctorIdAndSlotDateAndIsActive(doctorId, date, 'Y');

	    return slots.stream()
	            .map(slot -> {

	                boolean isBooked = rendezVousRepository
	                        .existsConfirmedSlot(slot.getId());

	                return AppointmentSlotDTO.builder()
	                        .id(slot.getId())
	                        .slotDate(slot.getSlotDate())
	                        .startTime(slot.getStartTime())
	                        .endTime(slot.getEndTime())
	                        .booked(isBooked) // 🔥 IMPORTANT
	                        .build();
	            })
	            .toList();
	}

}