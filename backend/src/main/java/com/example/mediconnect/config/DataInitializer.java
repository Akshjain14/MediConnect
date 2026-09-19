package com.example.mediconnect.config;

import com.example.mediconnect.entity.*;
import com.example.mediconnect.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final AppointmentRepository appointmentRepository;

    public DataInitializer(UserRepository userRepository,
                           PatientRepository patientRepository,
                           DoctorRepository doctorRepository,
                           DoctorAvailabilityRepository availabilityRepository,
                           AppointmentRepository appointmentRepository) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.availabilityRepository = availabilityRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        System.out.println("Initializing MediConnect sample database...");

        // 1. Admin User
        User adminUser = new User("System Administrator", "admin@mediconnect.com", "admin123", Role.ADMIN);
        userRepository.save(adminUser);

        // 2. Demo Doctors
        // Doctor 1: Cardiology
        User docUser1 = new User("Dr. Sarah Jenkins", "dr.sarah@mediconnect.com", "doctor123", Role.DOCTOR);
        userRepository.save(docUser1);
        Doctor doc1 = new Doctor(
                docUser1,
                "Cardiology",
                "MD, FACC - Harvard Medical School",
                12,
                120.0,
                "St. Jude Heart Center, Boston, MA",
                "Specialist in cardiovascular health, heart disease prevention, and non-invasive diagnostic cardiology."
        );
        doc1 = doctorRepository.save(doc1);

        // Doctor 2: Dermatology
        User docUser2 = new User("Dr. Robert Chen", "dr.chen@mediconnect.com", "doctor123", Role.DOCTOR);
        userRepository.save(docUser2);
        Doctor doc2 = new Doctor(
                docUser2,
                "Dermatology",
                "MD, FAAD - Johns Hopkins University",
                8,
                95.0,
                "Metro Dermatology Clinic, New York, NY",
                "Expert in medical and cosmetic dermatology, skin cancer screening, acne management, and eczema treatment."
        );
        doc2 = doctorRepository.save(doc2);

        // Doctor 3: Pediatrics
        User docUser3 = new User("Dr. Emily Rodriguez", "dr.emily@mediconnect.com", "doctor123", Role.DOCTOR);
        userRepository.save(docUser3);
        Doctor doc3 = new Doctor(
                docUser3,
                "Pediatrics",
                "MD, FAAP - Stanford University",
                10,
                85.0,
                "Children's Wellness Center, San Francisco, CA",
                "Compassionate pediatric specialist dedicated to child development, vaccinations, and comprehensive adolescent healthcare."
        );
        doc3 = doctorRepository.save(doc3);

        // Doctor 4: Neurology
        User docUser4 = new User("Dr. Michael Patel", "dr.patel@mediconnect.com", "doctor123", Role.DOCTOR);
        userRepository.save(docUser4);
        Doctor doc4 = new Doctor(
                docUser4,
                "Neurology",
                "MD, PhD - Columbia University",
                15,
                150.0,
                "NeuroCare Institute, Chicago, IL",
                "Board-certified neurologist focusing on migraine management, stroke rehabilitation, and neuro-diagnostic evaluations."
        );
        doc4 = doctorRepository.save(doc4);

        // Doctor 5: Orthopedics
        User docUser5 = new User("Dr. Amanda Scott", "dr.amanda@mediconnect.com", "doctor123", Role.DOCTOR);
        userRepository.save(docUser5);
        Doctor doc5 = new Doctor(
                docUser5,
                "Orthopedics",
                "MD, FAAOS - Mayo Clinic College of Medicine",
                11,
                130.0,
                "Apex Orthopedic & Sports Medicine, Austin, TX",
                "Specializing in joint replacement, sports injury rehabilitation, and arthroscopic procedures."
        );
        doc5 = doctorRepository.save(doc5);

        // 3. Add Availabilities for Doctors for the next 14 days
        LocalDate today = LocalDate.now();
        Doctor[] doctors = {doc1, doc2, doc3, doc4, doc5};
        for (Doctor doc : doctors) {
            for (int i = 0; i < 14; i++) {
                LocalDate slotDate = today.plusDays(i);
                // Morning slot
                availabilityRepository.save(new DoctorAvailability(doc, slotDate, LocalTime.of(9, 0), LocalTime.of(13, 0)));
                // Afternoon slot
                availabilityRepository.save(new DoctorAvailability(doc, slotDate, LocalTime.of(14, 0), LocalTime.of(17, 0)));
            }
        }

        // 4. Demo Patient
        User patUser1 = new User("John Doe", "john.doe@mediconnect.com", "patient123", Role.PATIENT);
        userRepository.save(patUser1);
        Patient patient1 = new Patient(
                patUser1,
                "+1 (555) 234-5678",
                32,
                "Male",
                "742 Evergreen Terrace, Springfield, IL"
        );
        patient1 = patientRepository.save(patient1);

        User patUser2 = new User("Jane Smith", "jane.smith@mediconnect.com", "patient123", Role.PATIENT);
        userRepository.save(patUser2);
        Patient patient2 = new Patient(
                patUser2,
                "+1 (555) 987-6543",
                28,
                "Female",
                "123 Maple Street, Seattle, WA"
        );
        patient2 = patientRepository.save(patient2);

        // 5. Demo Appointments
        // Upcoming Confirmed Appointment for John Doe with Dr. Sarah Jenkins tomorrow at 10:00
        Appointment appt1 = new Appointment(
                patient1,
                doc1,
                today.plusDays(1),
                LocalTime.of(10, 0),
                "Routine cardiovascular checkup and blood pressure monitoring"
        );
        appt1.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(appt1);

        // Pending Appointment for John Doe with Dr. Emily Rodriguez in 3 days at 11:00
        Appointment appt2 = new Appointment(
                patient1,
                doc3,
                today.plusDays(3),
                LocalTime.of(11, 0),
                "Consultation regarding seasonal allergy symptoms"
        );
        appt2.setStatus(AppointmentStatus.PENDING);
        appointmentRepository.save(appt2);

        // Past Completed Appointment for John Doe with Dr. Robert Chen
        Appointment appt3 = new Appointment(
                patient1,
                doc2,
                today.minusDays(5),
                LocalTime.of(14, 0),
                "Skin rash examination and topical prescription"
        );
        appt3.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appt3);

        // Upcoming Confirmed Appointment for Jane Smith with Dr. Michael Patel tomorrow at 15:00
        Appointment appt4 = new Appointment(
                patient2,
                doc4,
                today.plusDays(2),
                LocalTime.of(15, 0),
                "Chronic tension headaches consultation"
        );
        appt4.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(appt4);

        System.out.println("MediConnect sample data initialized successfully!");
    }
}
