package com.dentalcare.dentalcaremanager.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.dentalcare.dentalcaremanager.entity.WebsiteDetails;

@Repository
public interface WebsiteDetailRepository extends JpaRepository<WebsiteDetails, Long>{

	Optional<WebsiteDetails> findByWebsiteNameAndIsActive(String websiteName, Character isActive);
}
