package com.example.mediconnect.controller;

import com.example.mediconnect.dto.AppointmentRequestDto;
import com.example.mediconnect.dto.AppointmentResponseDto;
import com.example.mediconnect.dto.StatusUpdateDto;
import com.example.mediconnect.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<AppointmentResponseDto> bookAppointment(@Valid @RequestBody AppointmentRequestDto dto) {
        AppointmentResponseDto response = appointmentService.bookAppointment(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponseDto> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponseDto>> getAppointmentsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponseDto>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AppointmentResponseDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDto dto) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, dto.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelOrDeleteAppointment(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
