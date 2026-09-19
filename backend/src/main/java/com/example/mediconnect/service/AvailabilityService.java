package com.example.mediconnect.service;

import com.example.mediconnect.dto.AvailabilityDto;
import com.example.mediconnect.entity.Doctor;
import com.example.mediconnect.entity.DoctorAvailability;
import com.example.mediconnect.exception.BadRequestException;
import com.example.mediconnect.exception.ResourceNotFoundException;
import com.example.mediconnect.repository.DoctorAvailabilityRepository;
import com.example.mediconnect.repository.DoctorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final DoctorRepository doctorRepository;

    public AvailabilityService(DoctorAvailabilityRepository availabilityRepository, DoctorRepository doctorRepository) {
        this.availabilityRepository = availabilityRepository;
        this.doctorRepository = doctorRepository;
    }

    public List<AvailabilityDto> getDoctorAvailability(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + doctorId);
        }

        // Return future/current availability slots ordered by date & start time
        return availabilityRepository
                .findByDoctorIdAndDateGreaterThanEqualOrderByDateAscStartTimeAsc(doctorId, LocalDate.now())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<AvailabilityDto> getAllDoctorAvailabilities(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + doctorId);
        }

        return availabilityRepository
                .findByDoctorIdOrderByDateAscStartTimeAsc(doctorId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AvailabilityDto addAvailability(Long doctorId, AvailabilityDto dto) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + doctorId));

        if (dto.getStartTime().isAfter(dto.getEndTime()) || dto.getStartTime().equals(dto.getEndTime())) {
            throw new BadRequestException("Start time must be before end time");
        }

        DoctorAvailability availability = new DoctorAvailability(
                doctor,
                dto.getDate(),
                dto.getStartTime(),
                dto.getEndTime()
        );

        availability = availabilityRepository.save(availability);
        return toDto(availability);
    }

    @Transactional
    public void deleteAvailability(Long availabilityId) {
        if (!availabilityRepository.existsById(availabilityId)) {
            throw new ResourceNotFoundException("Availability slot not found with id: " + availabilityId);
        }
        availabilityRepository.deleteById(availabilityId);
    }

    private AvailabilityDto toDto(DoctorAvailability a) {
        return new AvailabilityDto(
                a.getId(),
                a.getDoctor().getId(),
                a.getDate(),
                a.getStartTime(),
                a.getEndTime()
        );
    }
}
