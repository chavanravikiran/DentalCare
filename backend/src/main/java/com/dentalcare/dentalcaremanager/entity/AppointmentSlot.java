package com.dentalcare.dentalcaremanager.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "appointment_slot")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentSlot extends AbstractEntity{

	private static final long serialVersionUID = 7544397430377119848L;

	@Id
	@Column(name = "key", nullable = false)
	@SequenceGenerator(name = "appointment_slot_seq", sequenceName = "appointment_slot_seq", initialValue = 1, allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "appointment_slot_seq")
    private Long id;


    private LocalDate slotDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private boolean booked = false;

//    private boolean active = true;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

}