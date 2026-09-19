import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DoctorCard = ({ doctor }) => {
  const { isPatient, user } = useAuth();

  return (
    <div className="card h-100 border-0 shadow-sm rounded-3 doctor-card transition-all">
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex align-items-start gap-3 mb-3">
          <div
            className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: '60px', height: '60px', fontSize: '1.75rem' }}
          >
            <i className="bi bi-person-badge"></i>
          </div>
          <div className="flex-grow-1">
            <h5 className="card-title fw-bold mb-1 text-dark">{doctor.name}</h5>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
              {doctor.specialization}
            </span>
          </div>
        </div>

        <p className="card-text text-muted small mb-3 flex-grow-1 line-clamp-2">
          {doctor.about || 'Dedicated healthcare specialist providing attentive, compassionate consultation.'}
        </p>

        <ul className="list-unstyled small mb-4">
          <li className="mb-2 text-secondary d-flex align-items-center gap-2">
            <i className="bi bi-mortarboard text-primary"></i>
            <span className="text-truncate">{doctor.qualification || 'MBBS, MD'}</span>
          </li>
          <li className="mb-2 text-secondary d-flex align-items-center gap-2">
            <i className="bi bi-award text-success"></i>
            <span>{doctor.experience ? `${doctor.experience} Years Experience` : 'Experienced'}</span>
          </li>
          <li className="mb-2 text-secondary d-flex align-items-center gap-2">
            <i className="bi bi-geo-alt text-danger"></i>
            <span className="text-truncate">{doctor.location || 'Main Hospital'}</span>
          </li>
          <li className="text-secondary d-flex align-items-center gap-2">
            <i className="bi bi-cash-stack text-warning"></i>
            <span className="fw-semibold text-dark">
              ${doctor.consultationFee ? doctor.consultationFee.toFixed(2) : '50.00'} Consultation Fee
            </span>
          </li>
        </ul>

        <div className="d-flex gap-2 pt-2 border-top">
          <Link to={`/doctors/${doctor.id}`} className="btn btn-outline-primary btn-sm flex-grow-1">
            <i className="bi bi-info-circle me-1"></i>View Details
          </Link>
          {isPatient ? (
            <Link to={`/patient/book?doctorId=${doctor.id}`} className="btn btn-primary btn-sm flex-grow-1">
              <i className="bi bi-calendar-plus me-1"></i>Book
            </Link>
          ) : !user ? (
            <Link to="/login" className="btn btn-primary btn-sm flex-grow-1">
              <i className="bi bi-calendar-plus me-1"></i>Book
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
