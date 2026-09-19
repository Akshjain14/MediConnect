package com.example.mediconnect.dto;

import com.example.mediconnect.entity.Role;

public class LoginResponse {
    private Long userId;
    private String name;
    private String email;
    private Role role;
    private Long patientId;
    private Long doctorId;

    public LoginResponse() {}

    public LoginResponse(Long userId, String name, String email, Role role, Long patientId, Long doctorId) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.patientId = patientId;
        this.doctorId = doctorId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }
}
