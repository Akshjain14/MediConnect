import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const DoctorProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    location: '',
    about: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.doctorId) {
        setLoading(false);
        return;
      }
      try {
        const data = await doctorService.getDoctorById(user.doctorId);
        setProfile({
          name: data.name || '',
          email: data.email || '',
          specialization: data.specialization || '',
          qualification: data.qualification || '',
          experience: data.experience || '',
          consultationFee: data.consultationFee || '',
          location: data.location || '',
          about: data.about || '',
        });
      } catch (err) {
        console.error('Failed to load doctor profile', err);
        setError('Could not retrieve doctor profile.');
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
        experience: profile.experience ? parseInt(profile.experience, 10) : 0,
        consultationFee: profile.consultationFee ? parseFloat(profile.consultationFee) : 0.0,
      };

      const updated = await doctorService.updateDoctor(user.doctorId, payload);
      setSuccess('Doctor profile updated successfully!');
      updateUser({ name: updated.name });
    } catch (err) {
      console.error('Failed to update doctor profile', err);
      setError('Could not update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading doctor profile..." />;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div
                className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}
              >
                <i className="bi bi-person-badge-fill"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-1 text-dark">Professional Doctor Profile</h3>
                <p className="text-muted small mb-0">Update your clinical qualifications, practice location, and fee</p>
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
                  <small className="text-muted">Registered login email</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    className="form-control"
                    placeholder="e.g. Cardiology, Pediatrics"
                    value={profile.specialization}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    className="form-control"
                    placeholder="e.g. MBBS, MD, FACC"
                    value={profile.qualification}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    min="0"
                    max="70"
                    className="form-control"
                    value={profile.experience}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Consultation Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="consultationFee"
                    min="0"
                    className="form-control"
                    value={profile.consultationFee}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Clinic / Hospital Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="Hospital, Suite, City"
                    value={profile.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold small">About / Professional Bio</label>
                  <textarea
                    name="about"
                    rows="4"
                    className="form-control"
                    placeholder="Describe your medical background, treatment philosophies, and clinical achievements"
                    value={profile.about}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button type="submit" className="btn btn-primary px-4 py-2 fw-semibold" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-2"></i>Update Doctor Profile
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

export default DoctorProfile;
