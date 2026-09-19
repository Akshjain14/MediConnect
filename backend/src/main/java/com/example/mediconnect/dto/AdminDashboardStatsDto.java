package com.example.mediconnect.dto;

public class AdminDashboardStatsDto {
    private long totalPatients;
    private long totalDoctors;
    private long totalAppointments;
    private long pendingAppointments;
    private long completedAppointments;

    public AdminDashboardStatsDto() {}

    public AdminDashboardStatsDto(long totalPatients, long totalDoctors, long totalAppointments,
                                 long pendingAppointments, long completedAppointments) {
        this.totalPatients = totalPatients;
        this.totalDoctors = totalDoctors;
        this.totalAppointments = totalAppointments;
        this.pendingAppointments = pendingAppointments;
        this.completedAppointments = completedAppointments;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public long getPendingAppointments() {
        return pendingAppointments;
    }

    public void setPendingAppointments(long pendingAppointments) {
        this.pendingAppointments = pendingAppointments;
    }

    public long getCompletedAppointments() {
        return completedAppointments;
    }

    public void setCompletedAppointments(long completedAppointments) {
        this.completedAppointments = completedAppointments;
    }
}
