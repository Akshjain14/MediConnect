package com.example.mediconnect.service;

import com.example.mediconnect.dto.PatientProfileDto;
import com.example.mediconnect.entity.Patient;
import com.example.mediconnect.entity.User;
import com.example.mediconnect.exception.ResourceNotFoundException;
import com.example.mediconnect.repository.PatientRepository;
import com.example.mediconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientService(PatientRepository patientRepository, UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    public PatientProfileDto getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        return toDto(patient);
    }

    public PatientProfileDto getPatientByUserId(Long userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user id: " + userId));

        return toDto(patient);
    }

    @Transactional
    public PatientProfileDto updatePatient(Long id, PatientProfileDto dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            User user = patient.getUser();
            user.setName(dto.getName());
            userRepository.save(user);
        }

        patient.setPhone(dto.getPhone());
        patient.setAge(dto.getAge());
        patient.setGender(dto.getGender());
        patient.setAddress(dto.getAddress());

        patient = patientRepository.save(patient);
        return toDto(patient);
    }

    public static PatientProfileDto toDto(Patient p) {
        return new PatientProfileDto(
                p.getId(),
                p.getUser() != null ? p.getUser().getId() : null,
                p.getUser() != null ? p.getUser().getName() : null,
                p.getUser() != null ? p.getUser().getEmail() : null,
                p.getPhone(),
                p.getAge(),
                p.getGender(),
                p.getAddress()
        );
    }
}
