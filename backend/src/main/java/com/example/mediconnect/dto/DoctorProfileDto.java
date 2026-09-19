package com.example.mediconnect.dto;

public class DoctorProfileDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String specialization;
    private String qualification;
    private Integer experience;
    private Double consultationFee;
    private String location;
    private String about;
    private boolean active;

    public DoctorProfileDto() {}

    public DoctorProfileDto(Long id, Long userId, String name, String email, String specialization,
                            String qualification, Integer experience, Double consultationFee,
                            String location, String about, boolean active) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.specialization = specialization;
        this.qualification = qualification;
        this.experience = experience;
        this.consultationFee = consultationFee;
        this.location = location;
        this.about = about;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
