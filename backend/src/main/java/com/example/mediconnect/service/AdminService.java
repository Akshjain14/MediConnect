package com.example.mediconnect.service;

import com.example.mediconnect.dto.AdminDashboardStatsDto;
import com.example.mediconnect.dto.AppointmentResponseDto;
import com.example.mediconnect.dto.DoctorProfileDto;
import com.example.mediconnect.dto.PatientProfileDto;
import com.example.mediconnect.entity.AppointmentStatus;
import com.example.mediconnect.entity.Doctor;
import com.example.mediconnect.exception.ResourceNotFoundException;
import com.example.mediconnect.repository.AppointmentRepository;
import com.example.mediconnect.repository.DoctorRepository;
import com.example.mediconnect.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public AdminService(PatientRepository patientRepository,
                        DoctorRepository doctorRepository,
                        AppointmentRepository appointmentRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public AdminDashboardStatsDto getDashboardStats() {
        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalAppointments = appointmentRepository.count();
        long pendingAppointments = appointmentRepository.countByStatus(AppointmentStatus.PENDING);
        long completedAppointments = appointmentRepository.countByStatus(AppointmentStatus.COMPLETED);

        return new AdminDashboardStatsDto(
                totalPatients,
                totalDoctors,
                totalAppointments,
                pendingAppointments,
                completedAppointments
        );
    }

    public List<PatientProfileDto> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(PatientService::toDto)
                .collect(Collectors.toList());
    }

    public List<DoctorProfileDto> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(DoctorService::toDto)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponseDto> getAllAppointments() {
        return appointmentRepository.findAllByOrderByAppointmentDateDescAppointmentTimeDesc().stream()
                .map(AppointmentResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public DoctorProfileDto updateDoctorStatus(Long doctorId, boolean active) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + doctorId));

        doctor.setActive(active);
        doctor = doctorRepository.save(doctor);
        return DoctorService.toDto(doctor);
    }
}
