package com.example.mediconnect.service;

import com.example.mediconnect.dto.DoctorProfileDto;
import com.example.mediconnect.dto.RegisterRequest;
import com.example.mediconnect.entity.Doctor;
import com.example.mediconnect.entity.Role;
import com.example.mediconnect.entity.User;
import com.example.mediconnect.exception.ConflictException;
import com.example.mediconnect.exception.ResourceNotFoundException;
import com.example.mediconnect.repository.DoctorRepository;
import com.example.mediconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public DoctorService(DoctorRepository doctorRepository, UserRepository userRepository) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
    }

    public List<DoctorProfileDto> getAllActiveDoctors(String specialization, String query) {
        List<Doctor> doctors;

        if (query != null && !query.trim().isEmpty()) {
            doctors = doctorRepository.searchDoctors(query.trim());
        } else if (specialization != null && !specialization.trim().isEmpty()) {
            doctors = doctorRepository.findBySpecializationIgnoreCaseAndActiveTrue(specialization.trim());
        } else {
            doctors = doctorRepository.findByActiveTrue();
        }

        return doctors.stream().map(DoctorService::toDto).collect(Collectors.toList());
    }

    public DoctorProfileDto getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return toDto(doctor);
    }

    public DoctorProfileDto getDoctorByUserId(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user id: " + userId));
        return toDto(doctor);
    }

    @Transactional
    public DoctorProfileDto registerDoctor(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already registered: " + request.getEmail());
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                Role.DOCTOR
        );
        user = userRepository.save(user);

        Doctor doctor = new Doctor(
                user,
                request.getSpecialization(),
                request.getQualification(),
                request.getExperience(),
                request.getConsultationFee(),
                request.getLocation(),
                request.getAbout()
        );
        doctor = doctorRepository.save(doctor);
        return toDto(doctor);
    }

    @Transactional
    public DoctorProfileDto updateDoctor(Long id, DoctorProfileDto dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            User user = doctor.getUser();
            user.setName(dto.getName());
            userRepository.save(user);
        }

        if (dto.getSpecialization() != null) doctor.setSpecialization(dto.getSpecialization());
        if (dto.getQualification() != null) doctor.setQualification(dto.getQualification());
        if (dto.getExperience() != null) doctor.setExperience(dto.getExperience());
        if (dto.getConsultationFee() != null) doctor.setConsultationFee(dto.getConsultationFee());
        if (dto.getLocation() != null) doctor.setLocation(dto.getLocation());
        if (dto.getAbout() != null) doctor.setAbout(dto.getAbout());

        doctor = doctorRepository.save(doctor);
        return toDto(doctor);
    }

    public List<String> getSpecializations() {
        return doctorRepository.findDistinctSpecializations();
    }

    public static DoctorProfileDto toDto(Doctor d) {
        return new DoctorProfileDto(
                d.getId(),
                d.getUser() != null ? d.getUser().getId() : null,
                d.getUser() != null ? d.getUser().getName() : null,
                d.getUser() != null ? d.getUser().getEmail() : null,
                d.getSpecialization(),
                d.getQualification(),
                d.getExperience(),
                d.getConsultationFee(),
                d.getLocation(),
                d.getAbout(),
                d.isActive()
        );
    }
}
