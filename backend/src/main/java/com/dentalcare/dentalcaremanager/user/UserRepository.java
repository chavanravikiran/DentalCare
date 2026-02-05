package com.dentalcare.dentalcaremanager.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
    @Query("""
    SELECT COUNT(u)
    FROM User u
    JOIN u.roles r
    WHERE r.name = :roleName
""")
    long countByRoleName(@Param("roleName") String roleName);

    long countByCreatedByAdminTrue();

    boolean existsByEmail(String email);
    List<User> findAllByRoles_Name(String roleName);
    Optional<User> findByEmailAndEnabledTrue(String email);
}
