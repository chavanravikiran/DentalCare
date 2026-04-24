package com.dentalcare.dentalcaremanager.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dentalcare.dentalcaremanager.entity.AppointmentSlot;

@Repository
public interface AppointmentSlotRepository extends JpaRepository<AppointmentSlot, Long>{

	List<AppointmentSlot> findByDoctorIdAndSlotDateAndIsActive(Long doctorId, LocalDate date,Character isActive);
}
