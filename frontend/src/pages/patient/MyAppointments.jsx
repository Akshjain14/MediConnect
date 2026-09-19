import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import AppointmentTable from '../../components/AppointmentTable';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchAppointments = async () => {
    if (!user?.patientId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await appointmentService.getAppointmentsByPatient(user.patientId);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load patient appointments', err);
      setError('Unable to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setError('');
    setActionSuccess('');
    try {
      await appointmentService.cancelAppointment(id);
      setActionSuccess('Appointment successfully cancelled.');
      fetchAppointments();
    } catch (err) {
      console.error('Cancellation failed', err);
      setError('Could not cancel the appointment.');
    }
  };

  if (loading && appointments.length === 0) return <Loading message="Loading your appointments..." />;

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
            Patient Portal
          </span>
          <h2 className="fw-bold mb-1">My Medical Appointments</h2>
          <p className="text-muted mb-0">Track upcoming visits, cancellations, and past consultation history.</p>
        </div>
        <Link to="/patient/book" className="btn btn-primary fw-semibold px-4 shadow-sm">
          <i className="bi bi-plus-circle me-2"></i>Book New Appointment
        </Link>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {actionSuccess && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div className="flex-grow-1">{actionSuccess}</div>
          <button type="button" className="btn-close" onClick={() => setActionSuccess('')}></button>
        </div>
      )}

      <AppointmentTable
        appointments={appointments}
        onCancel={handleCancelAppointment}
        role="PATIENT"
      />
    </div>
  );
};

export default MyAppointments;
