package com.dentalcare.dentalcaremanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.dentalcare.dentalcaremanager.entity.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long>{

}
