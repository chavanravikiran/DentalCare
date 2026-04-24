package com.dentalcare.dentalcaremanager.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AppointmentSlotDTO {

    private Long id;
    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean booked;
}