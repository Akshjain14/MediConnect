package com.example.mediconnect.controller;

import com.example.mediconnect.dto.AvailabilityDto;
import com.example.mediconnect.service.AvailabilityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @GetMapping("/api/doctors/{id}/availability")
    public ResponseEntity<List<AvailabilityDto>> getDoctorAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(availabilityService.getDoctorAvailability(id));
    }

    @GetMapping("/api/doctors/{id}/availability/all")
    public ResponseEntity<List<AvailabilityDto>> getAllDoctorAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(availabilityService.getAllDoctorAvailabilities(id));
    }

    @PostMapping("/api/doctors/{id}/availability")
    public ResponseEntity<AvailabilityDto> addAvailability(
            @PathVariable Long id,
            @Valid @RequestBody AvailabilityDto dto) {
        AvailabilityDto created = availabilityService.addAvailability(id, dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/api/availability/{id}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.noContent().build();
    }
}
