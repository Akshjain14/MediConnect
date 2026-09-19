import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const preSelectedDoctorId = searchParams.get('doctorId');

  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(preSelectedDoctorId || '');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);

  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');

  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Fetch active doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const docs = await doctorService.getAllDoctors();
        setDoctors(docs);
        if (preSelectedDoctorId) {
          const matched = docs.find((d) => d.id === parseInt(preSelectedDoctorId, 10));
          if (matched) setSelectedDoctor(matched);
        }
      } catch (err) {
        console.error('Error fetching doctors', err);
        setError('Could not load doctors.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [preSelectedDoctorId]);

  // 2. Fetch selected doctor's availability when doctor changes
  useEffect(() => {
    if (!selectedDoctorId) {
      setSelectedDoctor(null);
      setAvailabilities([]);
      setAppointmentDate('');
      setAppointmentTime('');
      return;
    }

    const doc = doctors.find((d) => d.id === parseInt(selectedDoctorId, 10));
    setSelectedDoctor(doc || null);

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const slots = await doctorService.getAvailability(selectedDoctorId);
        setAvailabilities(slots);

        // If currently selected date is not in the new doctor's slots, reset date & time
        if (slots.length > 0) {
          setAppointmentDate(slots[0].date);
        } else {
          setAppointmentDate('');
        }
        setAppointmentTime('');
      } catch (err) {
        console.error('Error loading availability', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDoctorId, doctors]);

  // Unique dates available for this doctor
  const availableDates = Array.from(new Set(availabilities.map((a) => a.date)));

  // Filter slots for the selected date
  const slotsForDate = availabilities.filter((a) => a.date === appointmentDate);

  // Generate 30-minute intervals within the slots
  const generateTimeSlots = () => {
    const times = [];
    slotsForDate.forEach((slot) => {
      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      const [endHour, endMin] = slot.endTime.split(':').map(Number);

      let curH = startHour;
      let curM = startMin;

      while (curH < endHour || (curH === endHour && curM < endMin)) {
        const timeStr = `${String(curH).padStart(2, '0')}:${String(curM).padStart(2, '0')}`;
        times.push(timeStr);

        curM += 30;
        if (curM >= 60) {
          curH += 1;
          curM = 0;
        }
      }
    });
    return times;
  };

  const availableTimeSlots = generateTimeSlots();

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user?.patientId) {
      setError('Please log in with a valid patient account to book an appointment.');
      return;
    }

    if (!selectedDoctorId || !appointmentDate || !appointmentTime) {
      setError('Please choose a doctor, date, and time slot.');
      return;
    }

    setBooking(true);
    try {
      const payload = {
        patientId: user.patientId,
        doctorId: parseInt(selectedDoctorId, 10),
        appointmentDate,
        appointmentTime,
        reason: reason.trim() || 'General Consultation',
      };

      await appointmentService.bookAppointment(payload);
      setSuccess('Appointment successfully scheduled!');
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 1500);
    } catch (err) {
      console.error('Booking failed', err);
      const msg =
        err.response?.data?.message ||
        'Could not book the appointment. The slot may have already been reserved.';
      setError(msg);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Loading message="Loading booking portal..." />;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="bg-primary text-white p-4">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle bg-white bg-opacity-20 d-flex align-items-center justify-content-center"
                  style={{ width: '56px', height: '56px', fontSize: '1.75rem' }}
                >
                  <i className="bi bi-calendar-plus"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">Book Clinical Appointment</h3>
                  <p className="text-light opacity-90 small mb-0">
                    Select a specialist, choose an available time slot, and confirm your visit.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
              <ErrorMessage message={error} onClose={() => setError('')} />

              {success && (
                <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                  <i className="bi bi-check-circle-fill fs-4 me-3"></i>
                  <div>
                    <h6 className="fw-bold mb-0">{success}</h6>
                    <small>Redirecting to your appointments...</small>
                  </div>
                </div>
              )}

              <form onSubmit={handleBooking}>
                {/* Step 1: Select Doctor */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-dark">1. Select Medical Specialist *</label>
                  <select
                    className="form-select form-select-lg"
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose a certified doctor --</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} &bull; {doc.specialization} &bull; ${doc.consultationFee} fee
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Doctor Summary Card */}
                {selectedDoctor && (
                  <div className="card border-0 bg-light rounded-3 p-3 mb-4">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                      <div>
                        <h5 className="fw-bold mb-1 text-dark">{selectedDoctor.name}</h5>
                        <span className="badge bg-primary me-2">{selectedDoctor.specialization}</span>
                        <span className="text-muted small">
                          <i className="bi bi-geo-alt text-danger me-1"></i>
                          {selectedDoctor.location}
                        </span>
                      </div>
                      <div className="text-md-end">
                        <div className="fw-bold text-success fs-5">
                          ${selectedDoctor.consultationFee?.toFixed(2)}
                        </div>
                        <small className="text-muted">Consultation Fee</small>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Select Date */}
                {selectedDoctor && (
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark">
                      2. Select Appointment Date *
                    </label>

                    {loadingSlots ? (
                      <div className="text-muted small py-2">Checking doctor's calendar...</div>
                    ) : availableDates.length === 0 ? (
                      <div className="alert alert-warning small mb-0">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        This doctor currently has no available appointment slots scheduled.
                      </div>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        {availableDates.map((d) => (
                          <button
                            type="button"
                            key={d}
                            className={`btn ${
                              appointmentDate === d ? 'btn-primary' : 'btn-outline-secondary'
                            } px-3 py-2 text-center rounded-3`}
                            onClick={() => {
                              setAppointmentDate(d);
                              setAppointmentTime('');
                            }}
                          >
                            <span className="d-block fw-semibold">{d}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Select Time Slot */}
                {appointmentDate && (
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark">
                      3. Select Available Time Slot *
                    </label>

                    {availableTimeSlots.length === 0 ? (
                      <div className="text-muted small">No slots found on this date.</div>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        {availableTimeSlots.map((time) => (
                          <button
                            type="button"
                            key={time}
                            className={`btn ${
                              appointmentTime === time ? 'btn-success' : 'btn-outline-dark'
                            } px-3 py-2 rounded-3`}
                            onClick={() => setAppointmentTime(time)}
                          >
                            <i className="bi bi-clock me-1"></i>
                            {time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Reason for Appointment */}
                {appointmentTime && (
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark">
                      4. Reason for Consultation
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Briefly describe your symptoms or reason for visit (e.g. Routine checkup, chronic headaches, follow-up)"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    ></textarea>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                  <Link to="/doctors" className="btn btn-outline-secondary">
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2 fw-semibold shadow-sm"
                    disabled={booking || !selectedDoctorId || !appointmentDate || !appointmentTime}
                  >
                    {booking ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Confirming Booking...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-2"></i>Confirm Appointment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
