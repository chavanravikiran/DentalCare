package com.dentalcare.dentalcaremanager.notifications;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pour accéder aux notifications sauvegardées.
 */
@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Integer> {
}
