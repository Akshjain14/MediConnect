package com.example.mediconnect.controller;

import com.example.mediconnect.dto.PatientProfileDto;
import com.example.mediconnect.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientProfileDto> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<PatientProfileDto> getPatientByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(patientService.getPatientByUserId(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientProfileDto> updatePatient(@PathVariable Long id, @RequestBody PatientProfileDto dto) {
        return ResponseEntity.ok(patientService.updatePatient(id, dto));
    }
}
