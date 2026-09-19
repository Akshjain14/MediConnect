package com.example.mediconnect.dto;

import com.example.mediconnect.entity.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateDto {
    @NotNull(message = "Status cannot be null")
    private AppointmentStatus status;

    public StatusUpdateDto() {}

    public StatusUpdateDto(AppointmentStatus status) {
        this.status = status;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }
}
