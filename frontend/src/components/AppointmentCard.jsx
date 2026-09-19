import React from 'react';

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-primary text-white';
    case 'PENDING':
      return 'bg-warning text-dark';
    case 'COMPLETED':
      return 'bg-success text-white';
    case 'REJECTED':
      return 'bg-danger text-white';
    case 'CANCELLED':
      return 'bg-secondary text-white';
    default:
      return 'bg-secondary text-white';
  }
};

const AppointmentCard = ({ appointment, onUpdateStatus, onCancel, isDoctorView = false }) => {
  const isUpcoming = appointment.status === 'CONFIRMED' || appointment.status === 'PENDING';

  return (
    <div className="card border-0 shadow-sm rounded-3 mb-3">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="fw-bold mb-1 text-dark">
              {isDoctorView ? appointment.patientName : appointment.doctorName}
            </h6>
            <span className="text-muted small">
              {isDoctorView ? (
                <>
                  <i className="bi bi-telephone me-1"></i>
                  {appointment.patientPhone || 'No phone'}
                </>
              ) : (
                appointment.doctorSpecialization
              )}
            </span>
          </div>
          <span className={`badge rounded-pill px-3 py-2 ${getStatusBadgeClass(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>

        <div className="bg-light p-2 rounded-2 mb-2 small">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-secondary">
              <i className="bi bi-calendar3 me-1 text-primary"></i>Date:
            </span>
            <span className="fw-medium text-dark">{appointment.appointmentDate}</span>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <span className="text-secondary">
              <i className="bi bi-clock me-1 text-primary"></i>Time:
            </span>
            <span className="fw-medium text-dark">{appointment.appointmentTime}</span>
          </div>
          {appointment.reason && (
            <div className="d-flex justify-content-between">
              <span className="text-secondary">
                <i className="bi bi-chat-text me-1 text-primary"></i>Reason:
              </span>
              <span className="text-truncate text-dark" style={{ maxWidth: '60%' }}>
                {appointment.reason}
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="d-flex gap-2 justify-content-end">
          {/* Doctor Actions */}
          {isDoctorView && appointment.status === 'PENDING' && (
            <>
              <button
                className="btn btn-sm btn-success"
                onClick={() => onUpdateStatus(appointment.id, 'CONFIRMED')}
              >
                <i className="bi bi-check-circle me-1"></i>Confirm
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onUpdateStatus(appointment.id, 'REJECTED')}
              >
                <i className="bi bi-x-circle me-1"></i>Reject
              </button>
            </>
          )}

          {isDoctorView && appointment.status === 'CONFIRMED' && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onUpdateStatus(appointment.id, 'COMPLETED')}
            >
              <i className="bi bi-check2-all me-1"></i>Mark Completed
            </button>
          )}

          {/* Patient Actions */}
          {!isDoctorView && isUpcoming && onCancel && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onCancel(appointment.id)}
            >
              <i className="bi bi-x-circle me-1"></i>Cancel Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
