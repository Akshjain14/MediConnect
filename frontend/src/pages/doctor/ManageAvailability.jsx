import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const ManageAvailability = () => {
  const { user } = useAuth();
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');

  const fetchAvailabilities = async () => {
    if (!user?.doctorId) {
      setLoading(false);
      return;
    }
    try {
      const data = await doctorService.getAllAvailability(user.doctorId);
      setAvailabilities(data);
    } catch (err) {
      console.error('Failed to load doctor availabilities', err);
      setError('Could not retrieve your availability slots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
    // Default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, [user]);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAdding(true);

    try {
      await doctorService.addAvailability(user.doctorId, {
        date,
        startTime,
        endTime,
      });
      setSuccess('Availability slot added successfully!');
      fetchAvailabilities();
    } catch (err) {
      console.error('Failed to add slot', err);
      const msg = err.response?.data?.message || 'Could not add availability slot.';
      setError(msg);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm('Delete this availability slot?')) return;
    setError('');
    setSuccess('');

    try {
      await doctorService.deleteAvailability(id);
      setSuccess('Availability slot removed.');
      fetchAvailabilities();
    } catch (err) {
      console.error('Failed to delete slot', err);
      setError('Could not delete availability slot.');
    }
  };

  if (loading) return <Loading message="Loading availability schedule..." />;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
          Doctor Schedule
        </span>
        <h2 className="fw-bold mb-1">Manage Clinical Availability</h2>
        <p className="text-muted">Define the dates and hours you are available for patient appointments.</p>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {success && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div className="flex-grow-1">{success}</div>
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Add New Slot Form */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-calendar-plus me-2 text-primary"></i>Add New Slot
            </h5>

            <form onSubmit={handleAddSlot}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Consultation Date *</label>
                <input
                  type="date"
                  className="form-control"
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label fw-semibold small">Start Time *</label>
                  <input
                    type="time"
                    className="form-control"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold small">End Time *</label>
                  <input
                    type="time"
                    className="form-control"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
                disabled={adding}
              >
                {adding ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Adding Slot...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle me-2"></i>Publish Slot
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Existing Availability Slots */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="bi bi-clock-history me-2 text-primary"></i>Current Published Slots
              </h5>
              <span className="badge bg-light text-primary border px-3 py-2">
                {availabilities.length} Slot(s)
              </span>
            </div>

            {availabilities.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-calendar2-x fs-1"></i>
                <p className="mt-2 mb-0">You have no availability slots configured.</p>
                <small className="text-secondary">Use the form to add consultation hours.</small>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light text-muted small text-uppercase">
                    <tr>
                      <th scope="col" className="ps-3">Date</th>
                      <th scope="col">Hours</th>
                      <th scope="col" className="text-end pe-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availabilities.map((slot) => (
                      <tr key={slot.id}>
                        <td className="ps-3">
                          <span className="fw-semibold text-dark">
                            <i className="bi bi-calendar3 me-2 text-primary"></i>
                            {slot.date}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
                            {slot.startTime} &mdash; {slot.endTime}
                          </span>
                        </td>
                        <td className="text-end pe-3">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            title="Delete Slot"
                            onClick={() => handleDeleteSlot(slot.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAvailability;
