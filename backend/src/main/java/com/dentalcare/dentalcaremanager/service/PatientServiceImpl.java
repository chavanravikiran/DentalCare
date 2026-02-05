package com.dentalcare.dentalcaremanager.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.dentalcare.dentalcaremanager.patient.Patient;
import com.dentalcare.dentalcaremanager.patient.PatientRepository;
import com.dentalcare.dentalcaremanager.user.User;
import com.dentalcare.dentalcaremanager.user.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

//Implements business rules (logic, mapping) + Calls PatientRepository and maps to PatientResponse
@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PatientCreatorService patientCreatorService;


    @Override
    public Optional<Patient> findById(Integer id) {
        return patientRepository.findById(id);
    }
    @Override
    public Optional<Patient> findByUserId(Integer userId) {
        return patientRepository.findByUserId(userId);
    }
    @Override
    public void createPatientForUser(User user) {
        patientCreatorService.createPatientForUser(user); // ✅ clean proxy call
    }

    @Override
    public void createPatientForUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
           createPatientForUser(user);
    }
    @Override
    public List<Patient> findAll() {
        return patientRepository.findAll();
    }

    @Override
    public Patient save(Patient patient) {
        return patientRepository.save(patient);
    }
    @Override
    public void deleteById(Integer id) {
        if (!patientRepository.existsById(id)) {
            throw new EntityNotFoundException("Patient not found");
        }
        patientRepository.deleteById(id);
    }

    @Override
    public List<Patient> search(String keyword) {
        return patientRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(keyword, keyword);
    }

    @Override
    public Optional<User> findUserById(Integer id) {
        return userRepository.findById(id);
    }
    @Override
    public List<Patient> getPatientsWithUserAccount() {
        return patientRepository.findByCreatedByAdminFalse(); // patients linked to a User
    }

    @Override
    public int synchronizeAllPatientsFromUsers() {
        List<User> enabledUsers = userRepository.findAll()
                .stream()
                .filter(User::isEnabled)
                .toList();

        int createdCount = 0;

        for (User user : enabledUsers) {
            if (patientRepository.findByUser(user).isPresent()) {
                System.out.println("🔁 Already existing patient for : " + user.getEmail());
                continue;
            }

            patientCreatorService.createPatientForUser(user); // ✅ Appel externe = proxy actif
            createdCount++;
        }

        System.out.println("🩺 Synchronization complete. Patients created. : " + createdCount);
        return createdCount;
    }

    @PostConstruct
    public void synchronizePatientsOnStartup() {
        int created = synchronizeAllPatientsFromUsers();
        System.out.println("🚀 Automatic synchronization at startup complete. Patients created : " + created);
    }

    @Override
    public Page<Patient> getFilteredPatients(Pageable pageable, String nom, Boolean createdByAdmin, Boolean enabled) {
        Specification<Patient> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (nom != null && !nom.isBlank()) {
                Predicate nomPredicate = cb.or(
                        cb.like(cb.lower(root.get("nom")), "%" + nom.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("prenom")), "%" + nom.toLowerCase() + "%")
                );
                predicates.add(nomPredicate);
            }

            if (createdByAdmin != null) {
                predicates.add(cb.equal(root.get("createdByAdmin"), createdByAdmin));
            }

            if (enabled != null) {
                predicates.add(cb.equal(root.get("enabled"), enabled));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return patientRepository.findAll(spec, pageable);
    }
    @Override
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

}
