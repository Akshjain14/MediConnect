import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="text-light py-5 mt-auto" style={{ backgroundColor: '#090d16', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="container">
        {/* Emergency Hotline Alert Banner */}
        <div
          className="p-3 mb-5 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm"
          style={{
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderLeft: '4px solid #ef4444'
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
              style={{ width: '42px', height: '42px', backgroundColor: '#ef4444' }}
            >
              <i className="bi bi-telephone-plus-fill fs-5"></i>
            </div>
            <div>
              <span className="badge bg-danger text-uppercase px-2 py-1 mb-1 fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                Emergency Medical Services (24/7)
              </span>
              <div className="fw-bold text-white fs-6">
                In case of immediate life-threatening emergency, call <span className="text-danger fw-extrabold">911</span> or our Emergency Hotline: <a href="tel:18009994357" className="text-warning text-decoration-none fw-bold ms-1">+1 (800) 999-HELP (4357)</a>
              </div>
            </div>
          </div>
          <div className="text-light opacity-75 small fst-italic d-none d-lg-block">
            <i className="bi bi-quote me-1 text-danger"></i>
            Wherever the art of medicine is loved, there is also a love of humanity. — Hippocrates
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="row g-4 mb-4">
          {/* Column 1: Brand & Philosophy */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="brand-icon-box">
                <i className="bi bi-plus-lg"></i>
              </div>
              <h4 className="fw-bold mb-0 text-white tracking-tight">
                Medi<span className="text-info">Connect</span>
              </h4>
            </div>
            <p className="text-light opacity-75 small leading-relaxed mb-3">
              A comprehensive and seamless healthcare management platform connecting patients, doctors,
              and healthcare administrators with ease, security, and real-time scheduling precision.
            </p>
            <div className="d-flex gap-3 text-light opacity-75 fs-5">
              <span className="p-2 rounded-circle bg-white bg-opacity-10 d-inline-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-facebook fs-6 text-info"></i>
              </span>
              <span className="p-2 rounded-circle bg-white bg-opacity-10 d-inline-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-twitter-x fs-6 text-info"></i>
              </span>
              <span className="p-2 rounded-circle bg-white bg-opacity-10 d-inline-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-linkedin fs-6 text-info"></i>
              </span>
              <span className="p-2 rounded-circle bg-white bg-opacity-10 d-inline-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-instagram fs-6 text-info"></i>
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-uppercase text-info mb-3 small tracking-wider">Quick Links</h6>
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2"><Link to="/" className="text-decoration-none text-light opacity-75 hover-opacity-100">Home</Link></li>
              <li className="mb-2"><Link to="/doctors" className="text-decoration-none text-light opacity-75 hover-opacity-100">Find Doctors</Link></li>
              <li className="mb-2"><Link to="/about" className="text-decoration-none text-light opacity-75 hover-opacity-100">About Us</Link></li>
              <li className="mb-2"><Link to="/login" className="text-decoration-none text-light opacity-75 hover-opacity-100">Sign In</Link></li>
              <li className="mb-0"><Link to="/register" className="text-decoration-none text-light opacity-75 hover-opacity-100">Register</Link></li>
            </ul>
          </div>

          {/* Column 3: Medical Specialties */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-uppercase text-info mb-3 small tracking-wider">Medical Specialties</h6>
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2 text-light opacity-85 d-flex align-items-center gap-2">
                <i className="bi bi-check2 text-info"></i>Cardiology & Heart Care
              </li>
              <li className="mb-2 text-light opacity-85 d-flex align-items-center gap-2">
                <i className="bi bi-check2 text-info"></i>Dermatology & Skin Health
              </li>
              <li className="mb-2 text-light opacity-85 d-flex align-items-center gap-2">
                <i className="bi bi-check2 text-info"></i>Neurology & Diagnostics
              </li>
              <li className="mb-2 text-light opacity-85 d-flex align-items-center gap-2">
                <i className="bi bi-check2 text-info"></i>Pediatrics & Child Wellness
              </li>
              <li className="mb-0 text-light opacity-85 d-flex align-items-center gap-2">
                <i className="bi bi-check2 text-info"></i>Orthopedics & Sports Medicine
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Support & Hours */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-uppercase text-info mb-3 small tracking-wider">Contact Support</h6>
            <ul className="list-unstyled mb-0 small">
              <li className="mb-3 d-flex align-items-start gap-2">
                <i className="bi bi-geo-alt-fill text-warning fs-5 flex-shrink-0 mt-n1"></i>
                <div className="text-light opacity-90">
                  <strong className="d-block text-white">Saraffan Street</strong>
                  Khatauli
                </div>
              </li>
              <li className="mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-telephone-fill text-warning fs-5 flex-shrink-0"></i>
                <div className="text-light opacity-90">
                  <a href="tel:18005556334" className="text-white text-decoration-none fw-semibold">
                    +1 (800) 555-MEDI (6334)
                  </a>
                  <span className="d-block text-light opacity-75" style={{ fontSize: '0.75rem' }}>Toll-Free Patient Desk</span>
                </div>
              </li>
              <li className="mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-envelope-fill text-warning fs-5 flex-shrink-0"></i>
                <div className="text-light opacity-90">
                  <a href="mailto:support@mediconnect.com" className="text-white text-decoration-none fw-semibold">
                    support@mediconnect.com
                  </a>
                  <span className="d-block text-light opacity-75" style={{ fontSize: '0.75rem' }}>Response within 24 hours</span>
                </div>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-clock-fill text-info fs-5 flex-shrink-0"></i>
                <div className="text-light opacity-90">
                  <span className="text-white fw-semibold">Mon - Sat: 8:00 AM - 8:00 PM</span>
                  <span className="d-block text-light opacity-75" style={{ fontSize: '0.75rem' }}>Sun: Emergency Services Only</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        {/* Bottom Bar */}
        <div className="d-flex flex-wrap justify-content-between align-items-center text-light opacity-75 small">
          <p className="mb-0">&copy; {new Date().getFullYear()} MediConnect Healthcare Platform. All rights reserved.</p>
          <div className="d-flex gap-3 align-items-center">
            <span>React.js</span>
            <span>&bull;</span>
            <span>Spring Boot 3</span>
            <span>&bull;</span>
            <span>PostgreSQL 18</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
