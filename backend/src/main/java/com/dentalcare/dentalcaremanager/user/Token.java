package com.dentalcare.dentalcaremanager.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Entity
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id ;
    @Column(nullable = false)
    private String token ;
    @Column(nullable = false)
    private LocalDateTime expiresAt ;
    @Column(nullable = false)
    private LocalDateTime createdAt ;
    private LocalDateTime validatedAt ;
    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user ;
}
