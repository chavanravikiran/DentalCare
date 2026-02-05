package com.dentalcare.dentalcaremanager.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {
    Optional<Token> findByToken(String token);
    void deleteByExpiresAtBefore(LocalDateTime time);
    Optional<Token> findByTokenAndValidatedAtIsNullAndExpiresAtAfter(String token, LocalDateTime now);



}
