package com.example.mediconnect.controller;

import com.example.mediconnect.dto.AdminDashboardStatsDto;
import com.example.mediconnect.dto.AppointmentResponseDto;
import com.example.mediconnect.dto.DoctorProfileDto;
import com.example.mediconnect.dto.PatientProfileDto;
import com.example.mediconnect.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/patients")
    public ResponseEntity<List<PatientProfileDto>> getAllPatients() {
        return ResponseEntity.ok(adminService.getAllPatients());
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorProfileDto>> getAllDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponseDto>> getAllAppointments() {
        return ResponseEntity.ok(adminService.getAllAppointments());
    }

    @PutMapping("/doctors/{id}/status")
    public ResponseEntity<DoctorProfileDto> updateDoctorStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> payload) {
        Boolean active = payload.getOrDefault("active", true);
        return ResponseEntity.ok(adminService.updateDoctorStatus(id, active));
    }
}
