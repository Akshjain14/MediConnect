package com.example.mediconnect.repository;

import com.example.mediconnect.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserId(Long userId);
    List<Doctor> findByActiveTrue();
    List<Doctor> findBySpecializationIgnoreCaseAndActiveTrue(String specialization);

    @Query("SELECT d FROM Doctor d WHERE d.active = true AND (" +
           "LOWER(d.user.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.location) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Doctor> searchDoctors(@Param("query") String query);

    @Query("SELECT DISTINCT d.specialization FROM Doctor d WHERE d.specialization IS NOT NULL AND d.active = true")
    List<String> findDistinctSpecializations();

    long countByActiveTrue();
}
