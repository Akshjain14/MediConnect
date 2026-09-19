import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import DashboardCard from '../../components/DashboardCard';
import AppointmentCard from '../../components/AppointmentCard';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    if (!user?.patientId) {
      setLoading(false);
      return;
    }
    try {
      const data = await appointmentService.getAppointmentsByPatient(user.patientId);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments', err);
      setError('Unable to load your appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentService.cancelAppointment(id);
      fetchAppointments();
    } catch (err) {
      console.error('Failed to cancel appointment', err);
      setError('Could not cancel appointment.');
    }
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'CONFIRMED' || a.status === 'PENDING'
  );
  const nextAppointment = upcomingAppointments[0];
  const completedAppointments = appointments.filter((a) => a.status === 'COMPLETED');

  if (loading) return <Loading message="Loading patient dashboard..." />;

  return (
    <div className="container py-5">
      {/* Welcome Banner */}
      <div className="card border-0 bg-primary text-white rounded-4 shadow-sm p-4 mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-semibold mb-2">
              Patient Portal
            </span>
            <h2 className="fw-bold mb-1">Welcome back, {user?.name}!</h2>
            <p className="text-light opacity-90 mb-0">
              Manage your upcoming healthcare appointments and medical consultations.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/patient/book" className="btn btn-warning text-dark fw-bold px-3">
              <i className="bi bi-calendar-plus me-1"></i>Book Appointment
            </Link>
            <Link to="/doctors" className="btn btn-outline-light px-3">
              <i className="bi bi-search me-1"></i>Find Doctors
            </Link>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Metrics Row */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <DashboardCard
            title="Total Bookings"
            count={appointments.length}
            icon="bi-calendar-check"
            bgClass="bg-primary"
            subtitle="All time appointments"
          />
        </div>
        <div className="col-md-4">
          <DashboardCard
            title="Upcoming"
            count={upcomingAppointments.length}
            icon="bi-clock-history"
            bgClass="bg-warning text-dark"
            subtitle="Confirmed & Pending"
          />
        </div>
        <div className="col-md-4">
          <DashboardCard
            title="Completed"
            count={completedAppointments.length}
            icon="bi-check2-circle"
            bgClass="bg-success"
            subtitle="Past clinical visits"
          />
        </div>
      </div>

      {/* Next Upcoming Appointment Notification */}
      {nextAppointment && (
        <div className="alert alert-info border-0 shadow-sm rounded-4 p-4 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle bg-white p-3 text-primary d-flex align-items-center justify-content-center">
              <i className="bi bi-bell-fill fs-3"></i>
            </div>
            <div>
              <span className="badge bg-primary px-2 py-1 mb-1">Next Appointment</span>
              <h5 className="fw-bold mb-0 text-dark">
                {nextAppointment.doctorName} ({nextAppointment.doctorSpecialization})
              </h5>
              <small className="text-secondary">
                <i className="bi bi-calendar3 me-1"></i>
                {nextAppointment.appointmentDate} at {nextAppointment.appointmentTime} &bull;{' '}
                <span className="fw-semibold">{nextAppointment.status}</span>
              </small>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Link to="/patient/appointments" className="btn btn-outline-primary btn-sm">
              View All
            </Link>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => handleCancelAppointment(nextAppointment.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Recent Appointments & Quick Actions */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="bi bi-calendar-event me-2 text-primary"></i>Recent Appointments
              </h5>
              <Link to="/patient/appointments" className="text-primary text-decoration-none small fw-semibold">
                View All ({appointments.length}) &rarr;
              </Link>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-calendar-x fs-1"></i>
                <p className="mt-2 mb-3">You haven't scheduled any appointments yet.</p>
                <Link to="/patient/book" className="btn btn-primary btn-sm">
                  Book Your First Consultation
                </Link>
              </div>
            ) : (
              <div>
                {appointments.slice(0, 4).map((app) => (
                  <AppointmentCard
                    key={app.id}
                    appointment={app}
                    onCancel={handleCancelAppointment}
                    isDoctorView={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Links & Health Help */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold text-dark mb-3">Quick Navigation</h5>
            <div className="d-grid gap-2">
              <Link to="/patient/book" className="btn btn-outline-primary text-start p-3 rounded-3">
                <i className="bi bi-calendar-plus me-2 fs-5 text-primary align-middle"></i>
                <span className="fw-semibold">Schedule Appointment</span>
                <small className="text-muted d-block ms-4">Choose doctor and preferred time</small>
              </Link>
              <Link to="/patient/appointments" className="btn btn-outline-primary text-start p-3 rounded-3">
                <i className="bi bi-journal-medical me-2 fs-5 text-primary align-middle"></i>
                <span className="fw-semibold">Appointment History</span>
                <small className="text-muted d-block ms-4">Track past and current bookings</small>
              </Link>
              <Link to="/patient/profile" className="btn btn-outline-primary text-start p-3 rounded-3">
                <i className="bi bi-person-gear me-2 fs-5 text-primary align-middle"></i>
                <span className="fw-semibold">Update Medical Profile</span>
                <small className="text-muted d-block ms-4">Keep your phone and address up to date</small>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
