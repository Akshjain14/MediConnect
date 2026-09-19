-- ==========================================================
-- MediConnect - PostgreSQL Database Schema
-- Database: mediconnect
-- Engine: PostgreSQL 18
-- ==========================================================

-- 1. Users Table (Base Authentication & Roles)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL -- 'PATIENT', 'DOCTOR', 'ADMIN'
);

-- 2. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    address TEXT,
    medical_history TEXT
);

-- 3. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(255),
    experience INT,
    consultation_fee DOUBLE PRECISION,
    location VARCHAR(255),
    about TEXT,
    active BOOLEAN DEFAULT TRUE
);

-- 4. Doctor Availabilities Table (Schedule Slots)
CREATE TABLE IF NOT EXISTS doctor_availabilities (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    available_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    CONSTRAINT unique_doctor_slot UNIQUE (doctor_id, available_date, start_time)
);

-- 5. Appointments Table (Patient-Doctor Bookings)
CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id BIGINT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED', 'CANCELLED'
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_doctor_appointment UNIQUE (doctor_id, appointment_date, appointment_time)
);
