import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import DashboardCard from '../../components/DashboardCard';
import AppointmentCard from '../../components/AppointmentCard';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchDoctorData = async () => {
    if (!user?.doctorId) {
      setLoading(false);
      return;
    }
    try {
      const [profileData, appointmentsData] = await Promise.all([
        doctorService.getDoctorById(user.doctorId),
        appointmentService.getAppointmentsByDoctor(user.doctorId),
      ]);
      setDoctorProfile(profileData);
      setAppointments(appointmentsData);
    } catch (err) {
      console.error('Failed to load doctor dashboard data', err);
      setError('Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [user]);

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    setError('');
    setActionSuccess('');
    try {
      await appointmentService.updateStatus(appointmentId, newStatus);
      setActionSuccess(`Appointment status changed to ${newStatus}`);
      fetchDoctorData();
    } catch (err) {
      console.error('Failed to update status', err);
      const msg = err.response?.data?.message || 'Could not update appointment status.';
      setError(msg);
    }
  };

  const pendingAppointments = appointments.filter((a) => a.status === 'PENDING');
  const confirmedAppointments = appointments.filter((a) => a.status === 'CONFIRMED');
  const completedAppointments = appointments.filter((a) => a.status === 'COMPLETED');

  // Today's appointments
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.appointmentDate === todayStr);

  if (loading) return <Loading message="Loading doctor dashboard..." />;

  return (
    <div className="container py-5">
      {/* Welcome Header */}
      <div className="card border-0 bg-primary text-white rounded-4 shadow-sm p-4 mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-white text-primary p-3 d-flex align-items-center justify-content-center"
              style={{ width: '64px', height: '64px', fontSize: '2rem' }}
            >
              <i className="bi bi-person-badge"></i>
            </div>
            <div>
              <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-semibold mb-1">
                Doctor Practice Portal
              </span>
              <h2 className="fw-bold mb-0">{user?.name}</h2>
              <p className="text-light opacity-90 small mb-0">
                {doctorProfile?.specialization || 'Specialist'} &bull; {doctorProfile?.qualification} &bull;{' '}
                {doctorProfile?.location}
              </p>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Link to="/doctor/availability" className="btn btn-warning text-dark fw-bold px-3">
              <i className="bi bi-clock-history me-1"></i>Manage Slots
            </Link>
            <Link to="/doctor/profile" className="btn btn-outline-light px-3">
              <i className="bi bi-person-gear me-1"></i>Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {actionSuccess && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div className="flex-grow-1">{actionSuccess}</div>
          <button type="button" className="btn-close" onClick={() => setActionSuccess('')}></button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="row g-4 mb-4">
        <div className="col-md-3 col-6">
          <DashboardCard
            title="Total Visits"
            count={appointments.length}
            icon="bi-journal-medical"
            bgClass="bg-primary"
            subtitle="All bookings"
          />
        </div>
        <div className="col-md-3 col-6">
          <DashboardCard
            title="Pending Requests"
            count={pendingAppointments.length}
            icon="bi-hourglass-split"
            bgClass="bg-warning text-dark"
            subtitle="Needs confirmation"
          />
        </div>
        <div className="col-md-3 col-6">
          <DashboardCard
            title="Confirmed"
            count={confirmedAppointments.length}
            icon="bi-calendar-check"
            bgClass="bg-info text-white"
            subtitle="Upcoming appointments"
          />
        </div>
        <div className="col-md-3 col-6">
          <DashboardCard
            title="Completed"
            count={completedAppointments.length}
            icon="bi-check2-all"
            bgClass="bg-success"
            subtitle="Finished consultations"
          />
        </div>
      </div>

      {/* Pending Consultation Requests Alert Banner */}
      {pendingAppointments.length > 0 && (
        <div className="alert alert-warning border-0 shadow-sm rounded-4 p-3 mb-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-circle-fill fs-4 text-warning"></i>
            <div>
              <strong className="text-dark">
                You have {pendingAppointments.length} pending appointment request(s).
              </strong>
              <span className="text-muted small ms-2 d-none d-md-inline">
                Please review and accept or reject them.
              </span>
            </div>
          </div>
          <Link to="/doctor/appointments" className="btn btn-warning btn-sm text-dark fw-bold">
            Review Requests
          </Link>
        </div>
      )}

      {/* Main Content Row */}
      <div className="row g-4">
        {/* Left Column: Recent/Upcoming Appointments */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="bi bi-calendar3 me-2 text-primary"></i>Upcoming & Active Appointments
              </h5>
              <Link to="/doctor/appointments" className="text-primary text-decoration-none small fw-semibold">
                View All ({appointments.length}) &rarr;
              </Link>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-calendar-x fs-1"></i>
                <p className="mt-2 mb-0">No patient appointments booked yet.</p>
              </div>
            ) : (
              <div>
                {appointments
                  .filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED')
                  .slice(0, 5)
                  .map((app) => (
                    <AppointmentCard
                      key={app.id}
                      appointment={app}
                      onUpdateStatus={handleUpdateStatus}
                      isDoctorView={true}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Practice Quick Actions */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold text-dark mb-3">Practice Controls</h5>
            <div className="d-grid gap-2">
              <Link to="/doctor/availability" className="btn btn-outline-primary text-start p-3 rounded-3">
                <i className="bi bi-clock-history me-2 fs-5 text-primary align-middle"></i>
                <span className="fw-semibold">Availability Schedule</span>
                <small className="text-muted d-block ms-4">Publish or remove patient visit slots</small>
              </Link>
              <Link to="/doctor/appointments" className="btn btn-outline-primary text-start p-3 rounded-3">
                <i className="bi bi-calendar-check me-2 fs-5 text-primary align-middle"></i>
                <span className="fw-semibold">Manage Appointments</span>
                <small className="text-muted d-block ms-4">Confirm, reject, or complete visits</small>
              </Link>
              <Link to="/doctor/profile" className="btn btn-outline-primary text-start p-3 rounded-3">
                <i className="bi bi-person-gear me-2 fs-5 text-primary align-middle"></i>
                <span className="fw-semibold">Doctor Profile & Fees</span>
                <small className="text-muted d-block ms-4">Update specialization, bio, and rates</small>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
