import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import ErrorMessage from '../components/ErrorMessage';

const Register = () => {
  const [role, setRole] = useState('PATIENT');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    // Patient fields
    phone: '',
    age: '',
    gender: 'Male',
    address: '',
    // Doctor fields
    specialization: 'General Physician',
    qualification: '',
    experience: '',
    consultationFee: '',
    location: '',
    about: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        ...(role === 'PATIENT'
          ? {
              phone: formData.phone,
              age: formData.age ? parseInt(formData.age, 10) : null,
              gender: formData.gender,
              address: formData.address,
            }
          : {
              specialization: formData.specialization,
              qualification: formData.qualification,
              experience: formData.experience ? parseInt(formData.experience, 10) : null,
              consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : 50.0,
              location: formData.location,
              about: formData.about,
            }),
      };

      const response = await authService.register(payload);
      login(response);

      if (response.role === 'PATIENT') {
        navigate('/patient/dashboard');
      } else if (response.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card auth-card rounded-4 overflow-hidden border-0">
            {/* Header with Circle Plus Logo */}
            <div className="auth-header text-white">
              <div className="medical-plus-circle mb-3 mx-auto">
                <i className="bi bi-plus-lg"></i>
              </div>
              <h3 className="fw-bold mb-1 tracking-tight">Create an Account</h3>
              <p className="text-light opacity-75 small mb-0">Join the MediConnect Healthcare Platform</p>
            </div>

            <div className="card-body p-4 p-md-5">
              <ErrorMessage message={error} onClose={() => setError('')} />

              {/* Role Toggle Tabs */}
              <div className="d-flex justify-content-center mb-4">
                <div className="btn-group p-1 bg-light rounded-pill border" role="group">
                  <button
                    type="button"
                    className={`btn rounded-pill px-4 fw-semibold ${
                      role === 'PATIENT' ? 'btn-primary' : 'btn-light text-muted'
                    }`}
                    onClick={() => setRole('PATIENT')}
                  >
                    <i className="bi bi-person me-2"></i>Patient Account
                  </button>
                  <button
                    type="button"
                    className={`btn rounded-pill px-4 fw-semibold ${
                      role === 'DOCTOR' ? 'btn-primary' : 'btn-light text-muted'
                    }`}
                    onClick={() => setRole('DOCTOR')}
                  >
                    <i className="bi bi-heart-pulse me-2"></i>Doctor Practice
                  </button>
                </div>
              </div>

              <form onSubmit={handleRegister}>
                <h6 className="fw-bold text-primary text-uppercase small mb-3 border-bottom pb-2">
                  Account Credentials
                </h6>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium small text-dark">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder={role === 'DOCTOR' ? 'Dr. Jane Smith' : 'John Doe'}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium small text-dark">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label fw-medium small text-dark">Password *</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Patient Specific Fields */}
                {role === 'PATIENT' && (
                  <>
                    <h6 className="fw-bold text-primary text-uppercase small mb-3 border-bottom pb-2 mt-4">
                      Patient Details
                    </h6>
                    <div className="row g-3 mb-3">
                      <div className="col-md-4">
                        <label className="form-label fw-medium small text-dark">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          className="form-control"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-medium small text-dark">Age</label>
                        <input
                          type="number"
                          name="age"
                          min="1"
                          max="120"
                          className="form-control"
                          placeholder="e.g. 28"
                          value={formData.age}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-medium small text-dark">Gender</label>
                        <select
                          name="gender"
                          className="form-select"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-medium small text-dark">Address</label>
                        <textarea
                          name="address"
                          className="form-control"
                          rows="2"
                          placeholder="Home address or city, state"
                          value={formData.address}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                  </>
                )}

                {/* Doctor Specific Fields */}
                {role === 'DOCTOR' && (
                  <>
                    <h6 className="fw-bold text-primary text-uppercase small mb-3 border-bottom pb-2 mt-4">
                      Professional Medical Details
                    </h6>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium small text-dark">Specialization *</label>
                        <input
                          type="text"
                          name="specialization"
                          className="form-control"
                          placeholder="e.g. Cardiology, Pediatrics"
                          value={formData.specialization}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium small text-dark">Qualification *</label>
                        <input
                          type="text"
                          name="qualification"
                          className="form-control"
                          placeholder="e.g. MBBS, MD, FACC"
                          value={formData.qualification}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-medium small text-dark">Experience (Years)</label>
                        <input
                          type="number"
                          name="experience"
                          min="0"
                          max="70"
                          className="form-control"
                          placeholder="e.g. 8"
                          value={formData.experience}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-medium small text-dark">Consultation Fee ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          name="consultationFee"
                          min="0"
                          className="form-control"
                          placeholder="e.g. 75.00"
                          value={formData.consultationFee}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-medium small text-dark">Clinic / Hospital Location</label>
                        <input
                          type="text"
                          name="location"
                          className="form-control"
                          placeholder="City, State / Hospital Name"
                          value={formData.location}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-medium small text-dark">About / Bio</label>
                        <textarea
                          name="about"
                          className="form-control"
                          rows="3"
                          placeholder="Brief summary of your clinical experience and patient care philosophy"
                          value={formData.about}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="btn btn-auth-submit w-100 py-2 mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-2"></i>Complete Registration
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-2 border-top">
                <p className="text-muted small mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
