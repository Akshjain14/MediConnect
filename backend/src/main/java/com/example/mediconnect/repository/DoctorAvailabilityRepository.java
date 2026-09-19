package com.example.mediconnect.repository;

import com.example.mediconnect.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    List<DoctorAvailability> findByDoctorIdOrderByDateAscStartTimeAsc(Long doctorId);
    List<DoctorAvailability> findByDoctorIdAndDateOrderByStartTimeAsc(Long doctorId, LocalDate date);
    List<DoctorAvailability> findByDoctorIdAndDateGreaterThanEqualOrderByDateAscStartTimeAsc(Long doctorId, LocalDate date);
    boolean existsByDoctorIdAndDate(Long doctorId, LocalDate date);
}
