import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { appointmentService } from '../../services/appointmentService';
import AppointmentTable from '../../components/AppointmentTable';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments', err);
      setError('Could not retrieve appointment logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setError('');
    setActionSuccess('');
    try {
      await appointmentService.cancelAppointment(id);
      setActionSuccess(`Appointment #${id} was successfully cancelled.`);
      fetchAppointments();
    } catch (err) {
      console.error('Failed to cancel appointment', err);
      setError('Could not cancel the appointment.');
    }
  };

  if (loading && appointments.length === 0) return <Loading message="Loading system appointments..." />;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
          Administration
        </span>
        <h2 className="fw-bold mb-1">Global Appointment Management</h2>
        <p className="text-muted">Oversee all patient-doctor consultations and clinical reservations.</p>
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
        role="ADMIN"
      />
    </div>
  );
};

export default ManageAppointments;
