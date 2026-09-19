package com.example.mediconnect.service;

import com.example.mediconnect.dto.AppointmentRequestDto;
import com.example.mediconnect.dto.AppointmentResponseDto;
import com.example.mediconnect.entity.Appointment;
import com.example.mediconnect.entity.AppointmentStatus;
import com.example.mediconnect.entity.Doctor;
import com.example.mediconnect.entity.DoctorAvailability;
import com.example.mediconnect.entity.Patient;
import com.example.mediconnect.exception.BadRequestException;
import com.example.mediconnect.exception.ConflictException;
import com.example.mediconnect.exception.ResourceNotFoundException;
import com.example.mediconnect.repository.AppointmentRepository;
import com.example.mediconnect.repository.DoctorAvailabilityRepository;
import com.example.mediconnect.repository.DoctorRepository;
import com.example.mediconnect.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorAvailabilityRepository availabilityRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              DoctorRepository doctorRepository,
                              PatientRepository patientRepository,
                              DoctorAvailabilityRepository availabilityRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.availabilityRepository = availabilityRepository;
    }

    @Transactional
    public AppointmentResponseDto bookAppointment(AppointmentRequestDto dto) {
        // 1. Check doctor exists and is active
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.getDoctorId()));

        if (!doctor.isActive()) {
            throw new BadRequestException("Doctor is currently inactive and not accepting appointments");
        }

        // 2. Check patient exists
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        LocalDate date = dto.getAppointmentDate();
        LocalTime time = dto.getAppointmentTime();

        if (date.isBefore(LocalDate.now())) {
            throw new BadRequestException("Appointment date cannot be in the past");
        }

        // 3. Check doctor availability for the given date and time
        List<DoctorAvailability> availabilities = availabilityRepository.findByDoctorIdAndDateOrderByStartTimeAsc(doctor.getId(), date);
        if (availabilities.isEmpty()) {
            throw new BadRequestException("Doctor has no available slots on " + date);
        }

        boolean withinSlot = availabilities.stream().anyMatch(slot ->
                (!time.isBefore(slot.getStartTime())) && time.isBefore(slot.getEndTime())
        );

        if (!withinSlot) {
            throw new BadRequestException("Requested time " + time + " is outside the doctor's scheduled availability on " + date);
        }

        // 4. Check whether the selected slot is already booked (double-booking prevention)
        boolean alreadyBooked = appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNotIn(
                doctor.getId(),
                date,
                time,
                List.of(AppointmentStatus.REJECTED, AppointmentStatus.CANCELLED)
        );

        if (alreadyBooked) {
            throw new ConflictException("Doctor already has an appointment booked on " + date + " at " + time + ". Please select another time.");
        }

        // 5. Create appointment
        Appointment appointment = new Appointment(
                patient,
                doctor,
                date,
                time,
                dto.getReason() != null ? dto.getReason().trim() : "General Consultation"
        );

        appointment = appointmentRepository.save(appointment);
        return AppointmentResponseDto.fromEntity(appointment);
    }

    public AppointmentResponseDto getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        return AppointmentResponseDto.fromEntity(appointment);
    }

    public List<AppointmentResponseDto> getAppointmentsByPatient(Long patientId) {
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient not found with id: " + patientId);
        }
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(patientId)
                .stream()
                .map(AppointmentResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponseDto> getAppointmentsByDoctor(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + doctorId);
        }
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(doctorId)
                .stream()
                .map(AppointmentResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponseDto updateStatus(Long id, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        AppointmentStatus current = appointment.getStatus();

        // Validate allowed transitions:
        // PENDING -> CONFIRMED, REJECTED, CANCELLED
        // CONFIRMED -> COMPLETED, CANCELLED
        if (current == AppointmentStatus.PENDING) {
            if (newStatus != AppointmentStatus.CONFIRMED &&
                newStatus != AppointmentStatus.REJECTED &&
                newStatus != AppointmentStatus.CANCELLED) {
                throw new BadRequestException("Cannot transition appointment from PENDING to " + newStatus);
            }
        } else if (current == AppointmentStatus.CONFIRMED) {
            if (newStatus != AppointmentStatus.COMPLETED &&
                newStatus != AppointmentStatus.CANCELLED) {
                throw new BadRequestException("Cannot transition appointment from CONFIRMED to " + newStatus);
            }
        } else if (current == AppointmentStatus.REJECTED ||
                   current == AppointmentStatus.COMPLETED ||
                   current == AppointmentStatus.CANCELLED) {
            throw new BadRequestException("Cannot change status of an appointment that is already " + current);
        }

        appointment.setStatus(newStatus);
        appointment = appointmentRepository.save(appointment);
        return AppointmentResponseDto.fromEntity(appointment);
    }

    @Transactional
    public void cancelAppointment(Long id) {
        updateStatus(id, AppointmentStatus.CANCELLED);
    }

    @Transactional
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
    }
}
