package com.dentalcare.dentalcaremanager.service;

import com.dentalcare.dentalcaremanager.admin.RendezVousAdminResponse;
import com.dentalcare.dentalcaremanager.dto.RendezVousRequest;
import com.dentalcare.dentalcaremanager.dto.RendezVousResponse;
import com.dentalcare.dentalcaremanager.entity.AppointmentSlot;
import com.dentalcare.dentalcaremanager.entity.Doctor;
import com.dentalcare.dentalcaremanager.events.AppointmentCreatedEvent;
import com.dentalcare.dentalcaremanager.exception.InvalidRendezVousRequestException;
import com.dentalcare.dentalcaremanager.exception.RendezVousNotFoundException;
import com.dentalcare.dentalcaremanager.exception.SlotConflictException;
import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.rdv.StatusRdv;
import com.dentalcare.dentalcaremanager.repository.AppointmentSlotRepository;
import com.dentalcare.dentalcaremanager.repository.DoctorRepository;
import com.dentalcare.dentalcaremanager.user.User;
import com.dentalcare.dentalcaremanager.rdv.RendezVousRepository;
import com.dentalcare.dentalcaremanager.user.UserRepository;
import com.dentalcare.dentalcaremanager.websocket.RendezVousSocketController;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.context.ApplicationEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
@Slf4j
@Service
@RequiredArgsConstructor
public class RendezVousServiceImpl implements RendezVousService {

    private final ApplicationEventPublisher eventPublisher;
    private final RendezVousRepository rendezVousRepository;
    private final UserRepository userRepository;
    private final RendezVousSocketController rendezVousSocketController;
    private final AppointmentSlotRepository slotRepository;
    private final DoctorRepository doctorRepository;

//    @Override
//    @Transactional
//    public RendezVousResponse create(RendezVousRequest request) {
//
//        // 🔐 Step 1: Secure Authentication
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication == null || !authentication.isAuthenticated()) {
//            throw new SecurityException("Unauthenticated user");
//        }
//
//        // Retrieve the logged-in user
//        String email = authentication.getName();
//        Integer userId = getUserIdByEmail(email);
//
//        // 🔍 Step 2: Validation
//        validateRdvRequest(request);
//
//        // ⚠️ Step 3: Conflict Checking
//        boolean conflict = rendezVousRepository.existsSlotConflict(
//                request.getDate(), request.getHeureDebut(), request.getHeureFin());
//
//        if (conflict) {
//            throw new SlotConflictException("This time slot is already reserved for this time period.");
//        }
//
//        // 👤 Step 4: Loading the patient
//        User patient = userRepository.findById(userId)
//                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));
//
//        // 🧠 Step 5: Building the RendezVous object
//        RendezVous rdv = request.toEntity(patient);
//
//        // 💾 Step 6: Backup
//        RendezVous saved = rendezVousRepository.save(rdv);
//        RendezVousResponse response = RendezVousResponse.fromEntity(saved);
//
//        // 📢 Step 7 : WebSocket
//        rendezVousSocketController.broadcastRdvCreated(response);
//
//        // 📣 Step 8 : Publish the Spring event to trigger the notification
//        eventPublisher.publishEvent(new AppointmentCreatedEvent(this, patient, saved, email));
//
//        log.info("📅 New appointment for the user {}", email);
//        return response;
//    }
//
    //Method used in the create method: centralize validation
    private void validateRdvRequest(RendezVousRequest request) {
        if (request.getDate() == null || request.getHeureDebut() == null || request.getHeureFin() == null) {
            throw new InvalidRendezVousRequestException("The date and time of the appointment are mandatory..");
        }
        // 🔐 3. Check that the start time is well before the end time
        if (!request.getHeureDebut().isBefore(request.getHeureFin())) {
            throw new InvalidRendezVousRequestException("The start time must precede the end time.");
        }
        if (request.getHeureDebut().isBefore(LocalTime.of(8, 0)) ||
                request.getHeureFin().isAfter(LocalTime.of(18, 0))) {
            throw new InvalidRendezVousRequestException("Appointments must be between 8:00 AM and 6:00 PM.");
        }
    }

    @Override
    @Transactional
    public RendezVousResponse create(RendezVousRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Integer userId = getUserIdByEmail(email);

        validateRdvRequest(request);

        // 🔥 STEP 1: Fetch slot
        AppointmentSlot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // 🔥 STEP 2: Check if slot already CONFIRMED
        boolean isAlreadyBooked = rendezVousRepository.existsConfirmedSlot(request.getSlotId());

        if (isAlreadyBooked) {
            throw new SlotConflictException("⛔ Slot already booked");
        }

        // 🔥 STEP 3: Fetch doctor
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 👤 Step: patient
        User patient = userRepository.findById(userId)
                .orElseThrow();

        // 🧠 Build entity
        RendezVous rdv = request.toEntity(patient);

        rdv.setDoctor(doctor);
        rdv.setSlot(slot);

        // 💾 Save
        RendezVous saved = rendezVousRepository.save(rdv);

        return RendezVousResponse.fromEntity(saved);
    }
    @Override
    public Integer getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"))
                .getId();
    }

    @Override
    public RendezVousResponse getById(Integer id) {
        return rendezVousRepository.findById(id)
                .map(RendezVousResponse::fromEntity)
                .orElseThrow(() -> new RendezVousNotFoundException(id));
    }


    @Override
    public List<RendezVousResponse> getAll() {
        return rendezVousRepository.findAll().stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<RendezVousResponse> getByDate(LocalDate date) {
        return rendezVousRepository.findByDate(date).stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }
    @Override
    public List<RendezVousResponse> getByMonth(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        return rendezVousRepository.findByDateBetween(start, end).stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }
//This method does exactly the same job as getByMonth(year, month) but in a more natural way, called via a single LocalDate

    public List<RendezVousResponse> findAllByMonth(LocalDate dateInMonth) {
        LocalDate start = dateInMonth.withDayOfMonth(1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        return rendezVousRepository.findAllByMonth(start, end).stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }


    @Override
    public List<RendezVousResponse> getByUserId(Integer userId) {
        log.info("🔍 Appointment request for userId = {}", userId); // Add this line
        return rendezVousRepository.findByPatientId(userId).stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Integer id) {
        rendezVousRepository.deleteById(id);
        log.info("🗑️ Appointment ID={} deleted", id);
    }

    // METHOD RELATED TO RendezVousRepository
    @Override
    public List<RendezVousResponse> findByStatus(StatusRdv status) {
        return rendezVousRepository.findByStatus(status).stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }
//Allow the admin to confirm an appointment (change its status from Pending → Confirmed).
@Override
@Transactional
public void confirmRendezVous(Integer id) {
    RendezVous rdv = rendezVousRepository.findById(id)
            .orElseThrow(() -> new RendezVousNotFoundException(id));

    if (rdv.getStatus() == StatusRdv.CANCELED) {
        throw new InvalidRendezVousRequestException("This appointment has been cancelled and cannot be confirmed.");
    }

    rdv.setStatus(StatusRdv.CONFIRME);
    RendezVous saved = rendezVousRepository.save(rdv);
    RendezVousResponse response = RendezVousResponse.fromEntity(saved);
    log.info("✅ Appointment ID={} confirmed", id);
    rendezVousSocketController.broadcastRdvConfirmed(response);
}
//Allow the admin to refuse an appointment, by passing it to StatusRdv.CANCELLED.
@Override
@Transactional
public void rejectRendezVous(Integer id) {
    RendezVous rdv = rendezVousRepository.findById(id)
            .orElseThrow(() -> new RendezVousNotFoundException(id));

    if (rdv.getStatus() == StatusRdv.CONFIRME) {
        throw new InvalidRendezVousRequestException("This appointment is already confirmed and cannot be cancelled.");
    }

    rdv.setStatus(StatusRdv.CANCELED);
    RendezVous saved = rendezVousRepository.save(rdv);
    RendezVousResponse response = RendezVousResponse.fromEntity(saved);
    log.info("❌ Appointment ID={} rejeté", id);
    rendezVousSocketController.broadcastRdvRejected(response);
}
    @Override
    public List<RendezVousResponse> getConfirmedByMonth(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        return rendezVousRepository.findConfirmedBetweenDates(StatusRdv.CONFIRME, start, end)
                .stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<RendezVousAdminResponse> getAllForAdminByMonth(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        return rendezVousRepository.findByDateBetween(start, end).stream()
                .map(RendezVousAdminResponse::fromEntity)
                .collect(Collectors.toList());
    }
    @Override
    @Transactional
    public RendezVousResponse update(Integer id, RendezVousRequest request) {

        // 🔍 1. Load existing appointment
        RendezVous rendezVous = rendezVousRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + id));

        // 🔐 2. (Optional) Access control → to be activated if needed
        // Check if the current user is authorized to modify this appointment (Admin or the patient themselves).

        // ⚠️ 3. Conflict check if confirmation is requested
        if (request.getStatus() == StatusRdv.CONFIRME) {
            boolean conflict = rendezVousRepository.existsConflictExcludingId(
                    id,
                    request.getDate(),
                    request.getHeureDebut(),
                    request.getHeureFin(),
                    StatusRdv.CONFIRME
            );

            if (conflict) {
                throw new SlotConflictException("⛔ This time slot is already occupied by another confirmed appointment..");
            }
        }

        // ✅ 4. Updating the fields
        rendezVous.setDate(request.getDate());
        rendezVous.setHeureDebut(request.getHeureDebut());
        rendezVous.setHeureFin(request.getHeureFin());
        rendezVous.setType(request.getType());
        rendezVous.setMotif(request.getMotif());
        rendezVous.setStatus(request.getStatus());

        // 💾 5. Backup with JPA persistence
        RendezVous updated = rendezVousRepository.save(rendezVous);

        // 🎯 6. Conversion to DTO
        return RendezVousResponse.fromEntity(updated);
    }
    public List<RendezVousResponse> getAppointmentsForDay(LocalDate date) {
        List<RendezVous> rdvs = rendezVousRepository.findByDateOrderByHeureDebutAsc(date);
        return rdvs.stream().map(RendezVousResponse::fromEntity).limit(5).toList();
    }

    @Override
    public List<RendezVous> searchByNomOrEmail(String query) {
        System.out.println("🔍 Backend search : " + query);
        return rendezVousRepository.searchByNomOrEmail(query);
    }
    @Override
    public List<RendezVous> searchByDate(LocalDate date) {
        System.out.println("🔍 Backend search : " + date);
        return rendezVousRepository.findByDate(date);
    }

    //cancel appointment by User
    @Override
    @Transactional
    public RendezVousResponse cancelAppointment(Integer id) {

        RendezVous rdv = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RendezVousNotFoundException(id));

        if (rdv.getStatus() == StatusRdv.CANCELED) {
            throw new InvalidRendezVousRequestException("This appointment is already cancelled.");
        }

        rdv.setStatus(StatusRdv.CANCELED);

        RendezVous saved = rendezVousRepository.save(rdv);

        RendezVousResponse response = RendezVousResponse.fromEntity(saved);

        log.info("❌ Appointment ID={} cancelled by user", id);

        rendezVousSocketController.broadcastRdvRejected(response);

        return response;   // IMPORTANT
    }
    
    //reschedule by User
    @Override
    @Transactional
    public RendezVousResponse rescheduleAppointment(Integer id, RendezVousRequest request) {

        RendezVous rdv = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RendezVousNotFoundException(id));

        // Validate request
        validateRdvRequest(request);

        // Check slot conflict
        boolean conflict = rendezVousRepository.existsConflictExcludingId(
                id,
                request.getDate(),
                request.getHeureDebut(),
                request.getHeureFin(),
                StatusRdv.CONFIRME
        );

        if (conflict) {
            throw new SlotConflictException("This time slot is already reserved.");
        }

        rdv.setDate(request.getDate());
        rdv.setHeureDebut(request.getHeureDebut());
        rdv.setHeureFin(request.getHeureFin());

        // When rescheduled → needs admin confirmation again
        rdv.setStatus(StatusRdv.ON_HOLD);

        RendezVous saved = rendezVousRepository.save(rdv);

        RendezVousResponse response = RendezVousResponse.fromEntity(saved);

        log.info("🔄 Appointment ID={} rescheduled by user", id);

        // WebSocket update
        rendezVousSocketController.broadcastRdvCreated(response);

        return response;
    }
}
