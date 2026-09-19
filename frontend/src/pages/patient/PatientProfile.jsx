import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/patientService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const PatientProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    address: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.patientId) {
        setLoading(false);
        return;
      }
      try {
        const data = await patientService.getPatientById(user.patientId);
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          age: data.age || '',
          gender: data.gender || 'Male',
          address: data.address || '',
        });
      } catch (err) {
        console.error('Failed to load patient profile', err);
        setError('Could not retrieve your profile information.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload = {
        ...profile,
        age: profile.age ? parseInt(profile.age, 10) : null,
      };
      const updated = await patientService.updatePatient(user.patientId, payload);
      setSuccess('Profile updated successfully!');
      updateUser({ name: updated.name });
    } catch (err) {
      console.error('Failed to update profile', err);
      setError('Could not update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading profile..." />;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div
                className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}
              >
                <i className="bi bi-person-fill"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-1 text-dark">Patient Profile</h3>
                <p className="text-muted small mb-0">View and update your personal details</p>
              </div>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {success && (
              <div className="alert alert-success alert-dismissible fade show d-flex align-items-center" role="alert">
                <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                <div className="flex-grow-1">{success}</div>
                <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={profile.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control bg-light"
                    value={profile.email}
                    disabled
                  />
                  <small className="text-muted">Email cannot be changed.</small>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="+1 (555) 000-0000"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Age</label>
                  <input
                    type="number"
                    name="age"
                    min="1"
                    max="120"
                    className="form-control"
                    value={profile.age}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={profile.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold small">Address</label>
                  <textarea
                    name="address"
                    rows="3"
                    className="form-control"
                    placeholder="Enter your home address"
                    value={profile.address}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button type="submit" className="btn btn-primary px-4 py-2 fw-semibold" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-2"></i>Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
