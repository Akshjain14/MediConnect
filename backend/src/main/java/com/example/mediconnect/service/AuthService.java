package com.example.mediconnect.service;

import com.example.mediconnect.dto.LoginRequest;
import com.example.mediconnect.dto.LoginResponse;
import com.example.mediconnect.dto.RegisterRequest;
import com.example.mediconnect.entity.Doctor;
import com.example.mediconnect.entity.Patient;
import com.example.mediconnect.entity.Role;
import com.example.mediconnect.entity.User;
import com.example.mediconnect.exception.BadRequestException;
import com.example.mediconnect.exception.ConflictException;
import com.example.mediconnect.exception.ResourceNotFoundException;
import com.example.mediconnect.repository.DoctorRepository;
import com.example.mediconnect.repository.PatientRepository;
import com.example.mediconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AuthService(UserRepository userRepository, PatientRepository patientRepository, DoctorRepository doctorRepository) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        Long patientId = null;
        Long doctorId = null;

        if (user.getRole() == Role.PATIENT) {
            patientId = patientRepository.findByUserId(user.getId())
                    .map(Patient::getId)
                    .orElse(null);
        } else if (user.getRole() == Role.DOCTOR) {
            doctorId = doctorRepository.findByUserId(user.getId())
                    .map(Doctor::getId)
                    .orElse(null);
        }

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                patientId,
                doctorId
        );
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already registered: " + request.getEmail());
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );
        user = userRepository.save(user);

        Long patientId = null;
        Long doctorId = null;

        if (user.getRole() == Role.PATIENT) {
            Patient patient = new Patient(
                    user,
                    request.getPhone(),
                    request.getAge(),
                    request.getGender(),
                    request.getAddress()
            );
            patient = patientRepository.save(patient);
            patientId = patient.getId();
        } else if (user.getRole() == Role.DOCTOR) {
            Doctor doctor = new Doctor(
                    user,
                    request.getSpecialization() != null ? request.getSpecialization() : "General Physician",
                    request.getQualification() != null ? request.getQualification() : "MBBS",
                    request.getExperience() != null ? request.getExperience() : 1,
                    request.getConsultationFee() != null ? request.getConsultationFee() : 50.0,
                    request.getLocation() != null ? request.getLocation() : "Main Hospital",
                    request.getAbout() != null ? request.getAbout() : "Healthcare specialist"
            );
            doctor = doctorRepository.save(doctor);
            doctorId = doctor.getId();
        }

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                patientId,
                doctorId
        );
    }
}
