import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import ErrorMessage from '../components/ErrorMessage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeDemo, setActiveDemo] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      login(response);

      // Redirect based on role
      if (response.role === 'PATIENT') {
        navigate('/patient/dashboard');
      } else if (response.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else if (response.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPassword, roleType) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setActiveDemo(roleType);
    setError('');
  };

  return (
    <div className="container py-5 my-auto">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5 col-xl-4">
          <div className="card auth-card rounded-4 overflow-hidden border-0">
            {/* Header with Circle Plus Logo */}
            <div className="auth-header text-white">
              <div className="medical-plus-circle mb-3 mx-auto">
                <i className="bi bi-plus-lg"></i>
              </div>
              <h3 className="fw-bold mb-1 tracking-tight">Welcome Back</h3>
              <p className="text-light opacity-75 small mb-0">Sign in to your MediConnect account</p>
            </div>

            <div className="card-body p-4 p-sm-4">
              <ErrorMessage message={error} onClose={() => setError('')} />

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-dark mb-1">
                    Email Address
                  </label>
                  <div className="input-group auth-input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-0"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-semibold small text-dark mb-0">
                      Password
                    </label>
                    <span className="text-muted small">Demo protected</span>
                  </div>
                  <div className="input-group auth-input-group">
                    <span className="input-group-text">
                      <i className="bi bi-key"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0 ps-0"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-auth-submit w-100 py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Single Line Quick Demo Logins */}
              <div className="border-top pt-3 mt-2">
                <div className="text-center mb-2">
                  <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.725rem', letterSpacing: '0.08em' }}>
                    Quick Logins
                  </span>
                </div>

                {/* Patient, Doctor, Admin in a single line with icons, names removed */}
                <div className="row g-2">
                  <div className="col-4">
                    <button
                      type="button"
                      className={`demo-role-btn patient-btn w-100 ${activeDemo === 'patient' ? 'border-primary bg-light' : ''}`}
                      onClick={() => fillCredentials('john.doe@mediconnect.com', 'patient123', 'patient')}
                      title="Quick fill Patient credentials"
                    >
                      <i className="bi bi-person-fill text-primary d-block fs-5 mb-1"></i>
                      <span className="fw-semibold small d-block">Patient</span>
                    </button>
                  </div>

                  <div className="col-4">
                    <button
                      type="button"
                      className={`demo-role-btn doctor-btn w-100 ${activeDemo === 'doctor' ? 'border-success bg-light' : ''}`}
                      onClick={() => fillCredentials('dr.sarah@mediconnect.com', 'doctor123', 'doctor')}
                      title="Quick fill Doctor credentials"
                    >
                      <i className="bi bi-heart-pulse-fill text-success d-block fs-5 mb-1"></i>
                      <span className="fw-semibold small d-block">Doctor</span>
                    </button>
                  </div>

                  <div className="col-4">
                    <button
                      type="button"
                      className={`demo-role-btn admin-btn w-100 ${activeDemo === 'admin' ? 'border-dark bg-light' : ''}`}
                      onClick={() => fillCredentials('admin@mediconnect.com', 'admin123', 'admin')}
                      title="Quick fill Admin credentials"
                    >
                      <i className="bi bi-shield-lock-fill text-dark d-block fs-5 mb-1"></i>
                      <span className="fw-semibold small d-block">Admin</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center mt-4 pt-2 border-top">
                <p className="text-muted small mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                    Register here
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

export default Login;
