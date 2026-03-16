package com.dentalcare.dentalcaremanager.entity;

import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Entity
@Table(name = "doctor")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor extends AbstractEntity{

	private static final long serialVersionUID = -681299154481628400L;

	@Id
	@Column(name = "key", nullable = false)
	@SequenceGenerator(name = "doctor_seq", sequenceName = "doctor_seq", initialValue = 1, allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "doctor_seq")
    private Long id;

    private String name;

    private String specialization;

    private String email;

    private String phone;

//    private Boolean active = true;

//    private LocalDate createdAt;

    @OneToMany(mappedBy = "doctor")
    private List<AppointmentSlot> slots;

}