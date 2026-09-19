package com.example.mediconnect.controller;

import com.example.mediconnect.dto.DoctorProfileDto;
import com.example.mediconnect.dto.RegisterRequest;
import com.example.mediconnect.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<List<DoctorProfileDto>> getAllDoctors(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(doctorService.getAllActiveDoctors(specialization, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorProfileDto> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<DoctorProfileDto> getDoctorByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(doctorService.getDoctorByUserId(userId));
    }

    @PostMapping("/register")
    public ResponseEntity<DoctorProfileDto> registerDoctor(@Valid @RequestBody RegisterRequest request) {
        DoctorProfileDto created = doctorService.registerDoctor(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoctorProfileDto> updateDoctor(
            @PathVariable Long id,
            @RequestBody DoctorProfileDto dto) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, dto));
    }

    @GetMapping("/specializations")
    public ResponseEntity<List<String>> getSpecializations() {
        return ResponseEntity.ok(doctorService.getSpecializations());
    }
}
