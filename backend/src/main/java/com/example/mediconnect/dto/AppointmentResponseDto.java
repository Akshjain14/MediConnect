package com.example.mediconnect.dto;

import com.example.mediconnect.entity.Appointment;
import com.example.mediconnect.entity.AppointmentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class AppointmentResponseDto {
    private Long id;

    // Patient details
    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;

    // Doctor details
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String doctorLocation;
    private Double consultationFee;

    // Appointment details
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate appointmentDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime appointmentTime;

    private String reason;
    private AppointmentStatus status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    public AppointmentResponseDto() {}

    public static AppointmentResponseDto fromEntity(Appointment a) {
        AppointmentResponseDto dto = new AppointmentResponseDto();
        dto.setId(a.getId());

        if (a.getPatient() != null) {
            dto.setPatientId(a.getPatient().getId());
            if (a.getPatient().getUser() != null) {
                dto.setPatientName(a.getPatient().getUser().getName());
                dto.setPatientEmail(a.getPatient().getUser().getEmail());
            }
            dto.setPatientPhone(a.getPatient().getPhone());
        }

        if (a.getDoctor() != null) {
            dto.setDoctorId(a.getDoctor().getId());
            if (a.getDoctor().getUser() != null) {
                dto.setDoctorName(a.getDoctor().getUser().getName());
            }
            dto.setDoctorSpecialization(a.getDoctor().getSpecialization());
            dto.setDoctorLocation(a.getDoctor().getLocation());
            dto.setConsultationFee(a.getDoctor().getConsultationFee());
        }

        dto.setAppointmentDate(a.getAppointmentDate());
        dto.setAppointmentTime(a.getAppointmentTime());
        dto.setReason(a.getReason());
        dto.setStatus(a.getStatus());
        dto.setCreatedAt(a.getCreatedAt());

        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientEmail() {
        return patientEmail;
    }

    public void setPatientEmail(String patientEmail) {
        this.patientEmail = patientEmail;
    }

    public String getPatientPhone() {
        return patientPhone;
    }

    public void setPatientPhone(String patientPhone) {
        this.patientPhone = patientPhone;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDoctorSpecialization() {
        return doctorSpecialization;
    }

    public void setDoctorSpecialization(String doctorSpecialization) {
        this.doctorSpecialization = doctorSpecialization;
    }

    public String getDoctorLocation() {
        return doctorLocation;
    }

    public void setDoctorLocation(String doctorLocation) {
        this.doctorLocation = doctorLocation;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
