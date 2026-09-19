import React, { useState } from 'react';

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

const AppointmentTable = ({
  appointments,
  onUpdateStatus,
  onCancel,
  role = 'PATIENT', // 'PATIENT', 'DOCTOR', 'ADMIN'
}) => {
  const [filter, setFilter] = useState('ALL');

  const filteredAppointments = appointments.filter((app) => {
    if (filter === 'ALL') return true;
    if (filter === 'UPCOMING') return app.status === 'PENDING' || app.status === 'CONFIRMED';
    return app.status === filter;
  });

  return (
    <div className="card border-0 shadow-sm rounded-3">
      <div className="card-header bg-white py-3 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2">
        <h5 className="mb-0 fw-bold text-dark">
          <i className="bi bi-calendar-event me-2 text-primary"></i>Appointment Records
        </h5>

        {/* Filter Pills */}
        <div className="btn-group btn-group-sm" role="group">
          {['ALL', 'UPCOMING', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((f) => (
            <button
              key={f}
              type="button"
              className={`btn ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setFilter(f)}
            >
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="card-body p-0">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-calendar-x fs-1"></i>
            <p className="mt-2 mb-0">No appointments found matching this filter.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th scope="col" className="ps-4">ID</th>
                  {role !== 'DOCTOR' && <th scope="col">Doctor</th>}
                  {role !== 'PATIENT' && <th scope="col">Patient</th>}
                  <th scope="col">Date & Time</th>
                  <th scope="col">Reason</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((app) => (
                  <tr key={app.id}>
                    <td className="ps-4 fw-semibold text-muted">#{app.id}</td>

                    {/* Doctor column */}
                    {role !== 'DOCTOR' && (
                      <td>
                        <div className="fw-semibold text-dark">{app.doctorName}</div>
                        <small className="text-muted">{app.doctorSpecialization}</small>
                      </td>
                    )}

                    {/* Patient column */}
                    {role !== 'PATIENT' && (
                      <td>
                        <div className="fw-semibold text-dark">{app.patientName}</div>
                        <small className="text-muted">{app.patientPhone || app.patientEmail}</small>
                      </td>
                    )}

                    {/* Date & Time */}
                    <td>
                      <div>
                        <i className="bi bi-calendar3 text-primary me-1"></i>
                        {app.appointmentDate}
                      </div>
                      <small className="text-muted">
                        <i className="bi bi-clock text-secondary me-1"></i>
                        {app.appointmentTime}
                      </small>
                    </td>

                    {/* Reason */}
                    <td style={{ maxWidth: '220px' }}>
                      <span className="d-inline-block text-truncate w-100" title={app.reason}>
                        {app.reason || 'General Consultation'}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="text-end pe-4">
                      {/* Doctor actions */}
                      {role === 'DOCTOR' && (
                        <div className="btn-group btn-group-sm">
                          {app.status === 'PENDING' && (
                            <>
                              <button
                                className="btn btn-success btn-sm"
                                title="Accept & Confirm Appointment"
                                onClick={() => onUpdateStatus(app.id, 'CONFIRMED')}
                              >
                                <i className="bi bi-check-lg me-1"></i>Accept
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                title="Reject Appointment"
                                onClick={() => onUpdateStatus(app.id, 'REJECTED')}
                              >
                                <i className="bi bi-x-lg me-1"></i>Reject
                              </button>
                            </>
                          )}
                          {app.status === 'CONFIRMED' && (
                            <button
                              className="btn btn-primary btn-sm"
                              title="Mark Consultation as Completed"
                              onClick={() => onUpdateStatus(app.id, 'COMPLETED')}
                            >
                              <i className="bi bi-check2-all me-1"></i>Complete
                            </button>
                          )}
                          {(app.status === 'COMPLETED' || app.status === 'REJECTED' || app.status === 'CANCELLED') && (
                            <span className="text-muted small">No actions available</span>
                          )}
                        </div>
                      )}

                      {/* Patient actions */}
                      {role === 'PATIENT' && (
                        <div>
                          {(app.status === 'PENDING' || app.status === 'CONFIRMED') ? (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => onCancel(app.id)}
                            >
                              <i className="bi bi-x-circle me-1"></i>Cancel
                            </button>
                          ) : (
                            <span className="text-muted small">Completed</span>
                          )}
                        </div>
                      )}

                      {/* Admin actions */}
                      {role === 'ADMIN' && (
                        <div>
                          {(app.status === 'PENDING' || app.status === 'CONFIRMED') ? (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => onCancel(app.id)}
                            >
                              <i className="bi bi-x-circle me-1"></i>Cancel
                            </button>
                          ) : (
                            <span className="text-muted small">Closed</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentTable;
