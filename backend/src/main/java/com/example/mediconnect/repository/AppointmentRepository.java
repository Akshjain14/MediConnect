package com.example.mediconnect.repository;

import com.example.mediconnect.entity.Appointment;
import com.example.mediconnect.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(Long patientId);
    List<Appointment> findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(Long doctorId);
    List<Appointment> findByDoctorIdAndAppointmentDateOrderByAppointmentTimeAsc(Long doctorId, LocalDate date);
    List<Appointment> findAllByOrderByAppointmentDateDescAppointmentTimeDesc();

    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNotIn(
            Long doctorId,
            LocalDate appointmentDate,
            LocalTime appointmentTime,
            Collection<AppointmentStatus> statuses
    );

    long countByStatus(AppointmentStatus status);
    long countByDoctorId(Long doctorId);
    long countByDoctorIdAndStatus(Long doctorId, AppointmentStatus status);
    long countByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);
    long countByPatientId(Long patientId);
}
