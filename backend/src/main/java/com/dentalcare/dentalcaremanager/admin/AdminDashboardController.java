package com.dentalcare.dentalcaremanager.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    @GetMapping("/dashboard")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity<String> dashboardHome() {
        return ResponseEntity.ok("Welcome to Admin Dashboard!");
    }
   /* @GetMapping("/stats/rdv")
    public ResponseEntity<?> getRdvStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRdv", rendezVousService.getAll().size());
        stats.put("rdvEnAttente", rendezVousService.findByStatus(StatusRdv.EN_ATTENTE).size());
        stats.put("rdvConfirme", rendezVousService.findByStatus(StatusRdv.CONFIRME).size());
        // Ajoute plus de stats ici
        return ResponseEntity.ok(stats);
    }*/

    // Exemple de futurs endpoints
    @GetMapping("/users")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity<?> listUsers() {
        // TODO: Implement user recovery
        return ResponseEntity.ok("User List");
    }

    @GetMapping("/stats")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity<?> dashboardStats() {
        // TODO: Implement statistics
        return ResponseEntity.ok("App statistics");
    }
}

