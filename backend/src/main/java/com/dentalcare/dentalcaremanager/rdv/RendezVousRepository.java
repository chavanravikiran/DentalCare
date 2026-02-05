package com.dentalcare.dentalcaremanager.rdv;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
// Gérer  requête directe sur la base de données.
@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Integer> {
    List<RendezVous> findByDate(LocalDate date);
    List<RendezVous> findByPatientId(Integer patientId);
    List<RendezVous> findByDateBetween(LocalDate start, LocalDate end);
    List<RendezVous> findByStatus(StatusRdv status);  //voir impl dans RendezVousServiceImpl.java
    List<RendezVous> findByDateAndStatus(LocalDate date, StatusRdv status);

    @Query("""
    SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END
    FROM RendezVous r
    WHERE r.patient.id = :patientId
      AND r.date = :date
      AND r.heureDebut < :heureFin
      AND r.heureFin > :heureDebut
""")
    boolean existsConflict(
            @Param("patientId") Integer patientId,
            @Param("date") LocalDate date,
            @Param("heureDebut") LocalTime heureDebut,
            @Param("heureFin") LocalTime heureFin
    );
//implémentation d’une version optimisée JPQL de findAllByMonth(LocalDate) complément de getByMonth(year, month) selon les performances observées en production.
    @Query("""
    SELECT r FROM RendezVous r
    WHERE r.date BETWEEN :start AND :end
""")
    List<RendezVous> findAllByMonth(@Param("start") LocalDate start, @Param("end") LocalDate end);


    @Query("""
SELECT r FROM RendezVous r
WHERE r.status = :status
  AND r.date BETWEEN :start AND :end
""")
    List<RendezVous> findConfirmedBetweenDates(
            @Param("status") StatusRdv status,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );


    @Query("""
    SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END
    FROM RendezVous r
    WHERE r.date = :date
      AND r.status <> com.dentalcare.dentalcaremanager.rdv.StatusRdv.ANNULE
      AND r.heureDebut < :heureFin
      AND r.heureFin > :heureDebut
""")
    boolean existsSlotConflict(
            @Param("date") LocalDate date,
            @Param("heureDebut") LocalTime heureDebut,
            @Param("heureFin") LocalTime heureFin
    );


    @Query("""
    SELECT r FROM RendezVous r
    WHERE LOWER(r.patient.firstname) LIKE LOWER(CONCAT('%', :query, '%'))
       OR LOWER(r.patient.lastname) LIKE LOWER(CONCAT('%', :query, '%'))
       OR LOWER(r.patient.email) LIKE LOWER(CONCAT('%', :query, '%'))
""")
    List<RendezVous> searchByNomOrEmail(@Param("query") String query);


    @Query("""
    SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END
    FROM RendezVous r
    WHERE r.id <> :id
      AND r.date = :date
      AND r.heureDebut < :heureFin
      AND r.heureFin > :heureDebut
      AND r.status = :status
""")
    boolean existsConflictExcludingId(
            @Param("id") Integer id,
            @Param("date") LocalDate date,
            @Param("heureDebut") LocalTime heureDebut,
            @Param("heureFin") LocalTime heureFin,
            @Param("status") StatusRdv status
    );
    List<RendezVous> findByDateOrderByHeureDebutAsc(LocalDate date);
    @Query("SELECT COUNT(r) FROM RendezVous r WHERE r.date = :date")
    long countByDate(@Param("date") LocalDate date);

}
