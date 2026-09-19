import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import AppointmentTable from '../../components/AppointmentTable';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchAppointments = async () => {
    if (!user?.doctorId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await appointmentService.getAppointmentsByDoctor(user.doctorId);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments', err);
      setError('Could not retrieve appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleUpdateStatus = async (id, newStatus) => {
    setError('');
    setActionSuccess('');
    try {
      await appointmentService.updateStatus(id, newStatus);
      setActionSuccess(`Appointment #${id} updated to ${newStatus}`);
      fetchAppointments();
    } catch (err) {
      console.error('Failed to update status', err);
      const msg = err.response?.data?.message || 'Status transition failed.';
      setError(msg);
    }
  };

  if (loading && appointments.length === 0) return <Loading message="Loading appointments..." />;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
          Doctor Schedule
        </span>
        <h2 className="fw-bold mb-1">Patient Appointments</h2>
        <p className="text-muted">Review, accept, reject, or complete consultation bookings.</p>
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
        onUpdateStatus={handleUpdateStatus}
        role="DOCTOR"
      />
    </div>
  );
};

export default DoctorAppointments;
