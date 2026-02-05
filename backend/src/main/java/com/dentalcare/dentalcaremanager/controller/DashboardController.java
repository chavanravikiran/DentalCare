package com.dentalcare.dentalcaremanager.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.rdv.RendezVousRepository;
import com.dentalcare.dentalcaremanager.user.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final RendezVousRepository rendezVousRepository;
    private final UserRepository userRepository;

    /**
     * 📊 Overall statistics displayed in the admin dashboard.
     */
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        long totalPatients = userRepository.countByRoleName("ROLE_USER");
        long rdvToday = rendezVousRepository.countByDate(LocalDate.now());
        double revenue = rdvToday * 250.0; // 💰 Simulation: 250 MAD per appointment

        return Map.of(
                "totalPatients", totalPatients,
                "appointmentsToday", rdvToday,
                "totalRevenue", revenue
        );
    }

    /**
     * 📅 List of appointments for today.
     */
    @GetMapping("/today")
    public List<RendezVous> getTodayAppointments() {
        return rendezVousRepository.findByDate(LocalDate.now());
    }
}
