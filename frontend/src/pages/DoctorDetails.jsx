import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const DoctorDetails = () => {
  const { id } = useParams();
  const { isPatient, user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorData = async () => {
      setLoading(true);
      setError('');
      try {
        const [doctorData, availData] = await Promise.all([
          doctorService.getDoctorById(id),
          doctorService.getAvailability(id),
        ]);
        setDoctor(doctorData);
        setAvailabilities(availData);
      } catch (err) {
        console.error('Error fetching doctor details', err);
        setError('Doctor details could not be retrieved.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]);

  if (loading) return <Loading message="Loading doctor profile..." />;
  if (error || !doctor) {
    return (
      <div className="container py-5">
        <ErrorMessage message={error || 'Doctor not found'} />
        <Link to="/doctors" className="btn btn-outline-primary mt-3">
          &larr; Back to Doctor Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/doctors" className="text-decoration-none">Doctors</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">{doctor.name}</li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Left Column: Doctor Profile Card */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex flex-wrap gap-4 align-items-center mb-4 pb-4 border-bottom">
              <div
                className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: '90px', height: '90px', fontSize: '2.5rem' }}
              >
                <i className="bi bi-person-badge"></i>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <h3 className="fw-bold mb-0 text-dark">{doctor.name}</h3>
                  <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                    <i className="bi bi-check-circle-fill me-1"></i>Verified Practitioner
                  </span>
                </div>
                <h6 className="text-primary fw-semibold mb-2">{doctor.specialization}</h6>
                <p className="text-muted small mb-0">
                  <i className="bi bi-geo-alt me-1 text-danger"></i>
                  {doctor.location || 'Central Hospital'}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="row g-3 mb-4 text-center">
              <div className="col-4">
                <div className="bg-light p-3 rounded-3">
                  <span className="text-muted small d-block">Experience</span>
                  <span className="fw-bold text-dark fs-5">{doctor.experience || 0} Years</span>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-light p-3 rounded-3">
                  <span className="text-muted small d-block">Consultation Fee</span>
                  <span className="fw-bold text-success fs-5">
                    ${doctor.consultationFee ? doctor.consultationFee.toFixed(2) : '50.00'}
                  </span>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-light p-3 rounded-3">
                  <span className="text-muted small d-block">Qualification</span>
                  <span className="fw-bold text-dark fs-6 text-truncate d-block">
                    {doctor.qualification || 'MBBS, MD'}
                  </span>
                </div>
              </div>
            </div>

            {/* About Doctor */}
            <div className="mb-4">
              <h5 className="fw-bold text-dark mb-3">About Doctor</h5>
              <p className="text-muted leading-relaxed">
                {doctor.about || 'Dr. ' + doctor.name + ' is a certified medical practitioner committed to providing high quality, patient-centered diagnosis, care, and continuous clinical attention.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Availability & Booking CTA */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-calendar-week me-2 text-primary"></i>Scheduled Availability
            </h5>

            {availabilities.length === 0 ? (
              <div className="alert alert-light text-muted small p-3 mb-3 border">
                <i className="bi bi-info-circle me-1"></i>No upcoming availability slots published yet.
              </div>
            ) : (
              <div className="mb-3" style={{ maxHeight: '260px', overflowY: 'auto' }}>
                <ul className="list-group list-group-flush small">
                  {availabilities.slice(0, 10).map((slot) => (
                    <li key={slot.id} className="list-group-item px-0 py-2 d-flex justify-content-between">
                      <span className="fw-medium text-dark">
                        <i className="bi bi-calendar3 me-1 text-primary"></i>{slot.date}
                      </span>
                      <span className="badge bg-light text-dark border">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-top">
              {isPatient ? (
                <Link
                  to={`/patient/book?doctorId=${doctor.id}`}
                  className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
                >
                  <i className="bi bi-calendar-plus me-2"></i>Book Appointment
                </Link>
              ) : !user ? (
                <Link
                  to={`/login?redirect=/patient/book?doctorId=${doctor.id}`}
                  className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
                >
                  <i className="bi bi-calendar-plus me-2"></i>Sign In to Book
                </Link>
              ) : (
                <div className="text-center text-muted small">
                  Logged in as <span className="fw-bold">{user.role}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
