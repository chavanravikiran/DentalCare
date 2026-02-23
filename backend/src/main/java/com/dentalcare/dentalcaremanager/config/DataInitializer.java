package com.dentalcare.dentalcaremanager.config;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.dentalcare.dentalcaremanager.patient.Patient;
import com.dentalcare.dentalcaremanager.patient.PatientRepository;
import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.rdv.RendezVousRepository;
import com.dentalcare.dentalcaremanager.rdv.StatusRdv;
import com.dentalcare.dentalcaremanager.rdv.TypeRdv;
import com.dentalcare.dentalcaremanager.role.Role;
import com.dentalcare.dentalcaremanager.role.RoleRepository;
import com.dentalcare.dentalcaremanager.user.User;
import com.dentalcare.dentalcaremanager.user.UserRepository;
import com.github.javafaker.Faker;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PatientRepository patientRepository;
    private final RendezVousRepository rendezVousRepository;


    private final Faker faker = new Faker(new Locale("fr"));
    private final Random random = new Random();

    @Override
    public void run(String... args) {
        // 🧹 Cleanup of invalid roles
        detachInvalidRoles();
        deleteInvalidRoles();// 💥

        // ✅ CCreate the standard roles if non-existent
        Role adminRole = createRoleIfNotFound("ROLE_ADMIN");
        Role userRole = createRoleIfNotFound("ROLE_USER");

        createAdminIfMissing(adminRole);
//
//        generateFakeUsersAndPatients(userRole);
//        generateFakeRendezVous();


    }
    private void createAdminIfMissing(Role adminRole) {
        userRepository.findByEmail("admin@dentalcare.com")
                .ifPresentOrElse(
                        u -> System.out.println("ℹ️ Admin user already exists."),
                        () -> {
                            User admin = User.builder()
                                    .firstname("Super")
                                    .lastname("Admin")
                                    .email("admin@dentalcare.com")
                                    .password(passwordEncoder.encode("AdminPass123"))
                                    .roles(Set.of(adminRole))
                                    .enabled(true)
                                    .accountLocked(false)
                                    .build();
                            userRepository.save(admin);
                            System.out.println("✅ Admin user created.");
                        });
    }
    private Role createRoleIfNotFound(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .name(roleName)
                            .build();
                    return roleRepository.save(newRole);
                });
    }

    // 💥 Removes old, invalid roles

    private void deleteInvalidRoles() {
        List.of("ADMIN", "USER").forEach(invalid ->
                roleRepository.findByName(invalid).ifPresent(role -> roleRepository.delete(role))
        );
    }

    private void detachInvalidRoles() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            Set<Role> filteredRoles = user.getRoles().stream()
                    .filter(role -> !List.of("ADMIN", "USER").contains(role.getName()))
                    .collect(Collectors.toSet());
            user.setRoles(filteredRoles);
        }
        userRepository.saveAll(users);
    }

    private void generateFakeUsersAndPatients(Role userRole) {
        if (userRepository.count() > 1) return;

        for (int i = 0; i < 5; i++) {
            String email = faker.internet().emailAddress();
            User user = User.builder()
                    .firstname(faker.name().firstName())
                    .lastname(faker.name().lastName())
                    .email(email)
                    .password(passwordEncoder.encode("password"))
                    .enabled(true)
                    .accountLocked(false)
                    .createdByAdmin(false)
                    .dateOfBirth(LocalDate.of(1985 + random.nextInt(20), 1 + random.nextInt(12), 1 + random.nextInt(28)))
                    .roles(Set.of(userRole))
                    .build();
            userRepository.save(user);

            Patient patient = Patient.builder()
                    .cin(faker.idNumber().valid())
                    .nom(user.getLastname())
                    .prenom(user.getFirstname())
                    .email(user.getEmail())
                    .dateNaissance(user.getDateOfBirth())
                    .adresse(faker.address().fullAddress())
                    .genre(random.nextBoolean() ? "Homme" : "Femme")
                    .enabled(true)
                    .createdByAdmin(false)
                    .user(user)
                    .build();
            patientRepository.save(patient);
        }

        for (int i = 0; i < 3; i++) {
            Patient patient = Patient.builder()
                    .cin(faker.idNumber().valid())
                    .nom(faker.name().lastName())
                    .prenom(faker.name().firstName())
                    .email(faker.internet().emailAddress())
                    .dateNaissance(LocalDate.of(1960 + random.nextInt(40), 1 + random.nextInt(12), 1 + random.nextInt(28)))
                    .adresse(faker.address().fullAddress())
                    .genre(random.nextBoolean() ? "Homme" : "Femme")
                    .enabled(true)
                    .createdByAdmin(true)
                    .build();
            patientRepository.save(patient);
        }

        System.out.println("✅ Patients + generated dummy users.");
    }

    private void generateFakeRendezVous() {
        List<Patient> patients = patientRepository.findAll();
        if (patients.isEmpty()) return;

        List<StatusRdv> statusChoices = List.of(StatusRdv.ON_HOLD, StatusRdv.CONFIRME, StatusRdv.CANCELED);

        for (int i = 0; i < 10; i++) {
            Patient patient = patients.get(random.nextInt(patients.size()));
            if (patient.getUser() == null) continue;

            LocalDate date = LocalDate.now().plusDays(random.nextInt(21) - 10);
            LocalTime heureDebut = LocalTime.of(8 + random.nextInt(9), 0);
            LocalTime heureFin = heureDebut.plusMinutes(30);
            StatusRdv status = statusChoices.get(random.nextInt(statusChoices.size()));

            RendezVous rdv = RendezVous.builder()
                    .date(date)
                    .heureDebut(heureDebut)
                    .heureFin(heureFin)
                    .patient(patient.getUser())
                    .status(status)
                    .type(TypeRdv.values()[random.nextInt(TypeRdv.values().length)])
                    .motif(faker.medical().diseaseName())
                    .praticien("Dr. Zahra")
                    .archive(false)
                    .build();

            rendezVousRepository.save(rdv);
        }

        System.out.println("📅 Dummy appointments generated.");
    }

}
