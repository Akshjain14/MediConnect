import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import DoctorCard from '../components/DoctorCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isPatient, isDoctor, isAdmin } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAllDoctors();
        setFeaturedDoctors(data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div>
      {/* Classy Hero Section */}
      <section className="hero-section text-white py-5 position-relative overflow-hidden">
        <div className="container py-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-50 px-3 py-2 rounded-pill fw-semibold mb-3 d-inline-flex align-items-center gap-1">
                <i className="bi bi-shield-check"></i>
                <span>Certified & Verified Healthcare</span>
              </span>
              <h1 className="display-4 fw-bold mb-3 tracking-tight">
                Your Health, Connected To Trusted Specialists.
              </h1>
              <p className="lead mb-4 text-light opacity-80" style={{ maxWidth: '600px' }}>
                MediConnect makes healthcare simple, accessible, and seamless. Search certified specialists,
                check real-time availability, and book appointments in seconds.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/doctors" className="btn btn-info btn-lg fw-bold text-dark px-4 shadow rounded-3">
                  <i className="bi bi-search me-2"></i>Find a Doctor
                </Link>
                {user ? (
                  <Link
                    to={isPatient ? '/patient/dashboard' : isDoctor ? '/doctor/dashboard' : '/admin/dashboard'}
                    className="btn btn-outline-light btn-lg px-4 rounded-3"
                  >
                    <i className="bi bi-speedometer2 me-2"></i>Go to Dashboard
                  </Link>
                ) : (
                  <Link to="/register" className="btn btn-outline-light btn-lg px-4 rounded-3">
                    <i className="bi bi-person-plus me-2"></i>Join MediConnect
                  </Link>
                )}
              </div>

              {/* Quick Stat Badges */}
              <div className="row mt-5 pt-3 border-top border-white border-opacity-10 g-3">
                <div className="col-4">
                  <h4 className="fw-bold mb-0 text-white">500+</h4>
                  <small className="text-light opacity-60">Verified Doctors</small>
                </div>
                <div className="col-4">
                  <h4 className="fw-bold mb-0 text-white">10,000+</h4>
                  <small className="text-light opacity-60">Happy Patients</small>
                </div>
                <div className="col-4">
                  <h4 className="fw-bold mb-0 text-white">24/7</h4>
                  <small className="text-light opacity-60">Online Scheduling</small>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white text-dark p-4">
                <div className="card-body p-2">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="rounded-circle bg-primary bg-opacity-10 text-primary p-3 d-flex align-items-center justify-content-center">
                      <i className="bi bi-plus-circle-fill fs-2 text-primary"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0">Easy 3-Step Care</h5>
                      <small className="text-muted">Instant healthcare access</small>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 mb-3 p-3 bg-light rounded-3">
                    <span className="badge bg-primary rounded-circle p-2 px-3 fw-bold">1</span>
                    <div>
                      <h6 className="fw-bold mb-1">Search Specialist</h6>
                      <small className="text-muted">Browse by cardiology, neurology, pediatrics, and more.</small>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 mb-3 p-3 bg-light rounded-3">
                    <span className="badge bg-primary rounded-circle p-2 px-3 fw-bold">2</span>
                    <div>
                      <h6 className="fw-bold mb-1">Select Time Slot</h6>
                      <small className="text-muted">Pick convenient morning or evening slots in real time.</small>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3">
                    <span className="badge bg-primary rounded-circle p-2 px-3 fw-bold">3</span>
                    <div>
                      <h6 className="fw-bold mb-1">Instant Confirmation</h6>
                      <small className="text-muted">Receive prompt appointment confirmation and doctor care.</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2 rounded-pill fw-semibold mb-2">
              Platform Features
            </span>
            <h2 className="fw-bold text-dark">Designed For Modern Healthcare</h2>
            <p className="text-muted col-md-7 mx-auto">
              Empowering patients with effortless scheduling, doctors with streamlined practice tools,
              and healthcare administrators with full visibility.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                <div
                  className="rounded-circle bg-primary bg-opacity-10 text-primary mx-auto d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}
                >
                  <i className="bi bi-person-check-fill"></i>
                </div>
                <h5 className="fw-bold mb-2 text-dark">For Patients</h5>
                <p className="text-muted small">
                  Find certified specialists, view consultation fees, schedule appointments without double booking,
                  and monitor your complete medical appointment history.
                </p>
                <Link to="/doctors" className="btn btn-outline-primary btn-sm mt-auto rounded-3">
                  Find Doctors
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                <div
                  className="rounded-circle bg-success bg-opacity-10 text-success mx-auto d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}
                >
                  <i className="bi bi-heart-pulse-fill"></i>
                </div>
                <h5 className="fw-bold mb-2 text-dark">For Doctors</h5>
                <p className="text-muted small">
                  Publish customized availability time slots, review patient consultation requests,
                  confirm or complete appointments, and manage your practice.
                </p>
                <Link to="/register" className="btn btn-outline-success btn-sm mt-auto rounded-3">
                  Doctor Registration
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                <div
                  className="rounded-circle bg-dark bg-opacity-10 text-dark mx-auto d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}
                >
                  <i className="bi bi-shield-lock-fill"></i>
                </div>
                <h5 className="fw-bold mb-2 text-dark">For Administrators</h5>
                <p className="text-muted small">
                  Live dashboard analytics, patient and doctor management, doctor verification & status toggles,
                  and centralized appointment governance.
                </p>
                <Link to="/login" className="btn btn-outline-dark btn-sm mt-auto rounded-3">
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
            <div>
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill fw-semibold mb-2">
                Top Specialists
              </span>
              <h2 className="fw-bold mb-0 text-dark">Featured Medical Specialists</h2>
            </div>
            <Link to="/doctors" className="btn btn-outline-primary fw-semibold rounded-3">
              View All Doctors <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {featuredDoctors.map((doc) => (
                <div className="col" key={doc.id}>
                  <DoctorCard doctor={doc} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
