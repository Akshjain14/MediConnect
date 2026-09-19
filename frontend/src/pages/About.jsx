import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
          About Us
        </span>
        <h1 className="fw-bold display-5">Modern Healthcare Scheduling</h1>
        <p className="lead text-muted col-md-8 mx-auto">
          MediConnect is a full-stack healthcare web application demonstrating clean software architecture,
          REST APIs, and interactive patient-doctor scheduling.
        </p>
      </div>

      {/* Mission & Architecture */}
      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="rounded-circle bg-primary bg-opacity-10 text-primary p-3">
                <i className="bi bi-bullseye fs-3"></i>
              </div>
              <h4 className="fw-bold mb-0">Our Mission</h4>
            </div>
            <p className="text-muted leading-relaxed">
              To eliminate friction in clinical appointment booking by providing doctors and patients with
              an intuitive, real-time platform. By checking availability slots and preventing double bookings
              directly in the business layer, MediConnect ensures reliable scheduling for healthcare professionals
              and patients alike.
            </p>
            <div className="row g-3 mt-2">
              <div className="col-6">
                <div className="p-3 bg-light rounded-3">
                  <h6 className="fw-bold text-primary mb-1">Double Booking Proof</h6>
                  <small className="text-muted">Conflict-free slot reservation logic.</small>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded-3">
                  <h6 className="fw-bold text-success mb-1">Real-time Availabilities</h6>
                  <small className="text-muted">Dynamic schedules set by practitioners.</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="rounded-circle bg-success bg-opacity-10 text-success p-3">
                <i className="bi bi-layers-fill fs-3"></i>
              </div>
              <h4 className="fw-bold mb-0">Clean Layered Architecture</h4>
            </div>
            <p className="text-muted leading-relaxed">
              MediConnect follows a clear enterprise layered pattern:
            </p>
            <ul className="list-group list-group-flush small">
              <li className="list-group-item px-0 py-2 d-flex justify-content-between">
                <span className="fw-semibold text-dark">Frontend</span>
                <span className="text-muted">React.js, React Router, Axios, Bootstrap 5</span>
              </li>
              <li className="list-group-item px-0 py-2 d-flex justify-content-between">
                <span className="fw-semibold text-dark">Backend REST API</span>
                <span className="text-muted">Spring Boot 3, Spring Web (Java 17)</span>
              </li>
              <li className="list-group-item px-0 py-2 d-flex justify-content-between">
                <span className="fw-semibold text-dark">Persistence Layer</span>
                <span className="text-muted">Spring Data JPA & Hibernate</span>
              </li>
              <li className="list-group-item px-0 py-2 d-flex justify-content-between">
                <span className="fw-semibold text-dark">Relational Database</span>
                <span className="text-muted">PostgreSQL 18</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technology Highlights */}
      <div className="card border-0 bg-light rounded-4 p-4 p-md-5 mb-5 text-center">
        <h3 className="fw-bold mb-4">Core Technology Stack</h3>
        <div className="row g-4 justify-content-center">
          <div className="col-6 col-md-3">
            <div className="p-3 bg-white rounded-3 shadow-sm">
              <i className="bi bi-filetype-java text-danger fs-1 mb-2 d-block"></i>
              <h6 className="fw-bold mb-0">Java 17</h6>
              <small className="text-muted">LTS Runtime</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-white rounded-3 shadow-sm">
              <i className="bi bi-gear-wide-connected text-success fs-1 mb-2 d-block"></i>
              <h6 className="fw-bold mb-0">Spring Boot 3</h6>
              <small className="text-muted">REST APIs & JPA</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-white rounded-3 shadow-sm">
              <i className="bi bi-database text-primary fs-1 mb-2 d-block"></i>
              <h6 className="fw-bold mb-0">PostgreSQL</h6>
              <small className="text-muted">Relational Database</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-white rounded-3 shadow-sm">
              <i className="bi bi-code-slash text-info fs-1 mb-2 d-block"></i>
              <h6 className="fw-bold mb-0">React.js</h6>
              <small className="text-muted">Vite & Bootstrap 5</small>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to connect */}
      <div className="text-center">
        <Link to="/doctors" className="btn btn-primary btn-lg fw-semibold px-4 me-2">
          Explore Doctors
        </Link>
        <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default About;
