import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isPatient, isDoctor, isAdmin } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsNavOpen(false);
    logout();
    navigate('/login');
  };

  const closeNav = () => setIsNavOpen(false);
  const toggleNav = () => setIsNavOpen((prev) => !prev);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top shadow-sm py-2">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-white" to="/" onClick={closeNav}>
          <div className="brand-icon-box">
            <i className="bi bi-plus-lg"></i>
          </div>
          <span className="tracking-tight">
            Medi<span className="text-info">Connect</span>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={toggleNav}
          aria-controls="navbarContent"
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={closeNav}>
                <i className="bi bi-house me-1"></i>Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/doctors" onClick={closeNav}>
                <i className="bi bi-people me-1"></i>Find Doctors
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={closeNav}>
                <i className="bi bi-info-circle me-1"></i>About
              </NavLink>
            </li>

            {/* Role: Patient */}
            {isPatient && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/patient/dashboard" onClick={closeNav}>
                    <i className="bi bi-speedometer2 me-1"></i>Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/patient/appointments" onClick={closeNav}>
                    <i className="bi bi-calendar-check me-1"></i>My Appointments
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/patient/book" onClick={closeNav}>
                    <i className="bi bi-plus-circle me-1"></i>Book Appointment
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/patient/profile" onClick={closeNav}>
                    <i className="bi bi-person me-1"></i>Profile
                  </NavLink>
                </li>
              </>
            )}

            {/* Role: Doctor */}
            {isDoctor && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/doctor/dashboard" onClick={closeNav}>
                    <i className="bi bi-speedometer2 me-1"></i>Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/doctor/appointments" onClick={closeNav}>
                    <i className="bi bi-calendar3 me-1"></i>Appointments
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/doctor/availability" onClick={closeNav}>
                    <i className="bi bi-clock-history me-1"></i>Availability
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/doctor/profile" onClick={closeNav}>
                    <i className="bi bi-person me-1"></i>Profile
                  </NavLink>
                </li>
              </>
            )}

            {/* Role: Admin */}
            {isAdmin && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/dashboard" onClick={closeNav}>
                    <i className="bi bi-speedometer2 me-1"></i>Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/patients" onClick={closeNav}>
                    <i className="bi bi-person-lines-fill me-1"></i>Patients
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/doctors" onClick={closeNav}>
                    <i className="bi bi-hospital me-1"></i>Doctors
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/appointments" onClick={closeNav}>
                    <i className="bi bi-calendar2-range me-1"></i>Appointments
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5 text-info"></i>
                  <span className="fw-semibold">{user.name}</span>
                  <span className="badge bg-info text-dark ms-1">{user.role}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2" aria-labelledby="userDropdown">
                  <li>
                    <div className="dropdown-header">
                      <div className="fw-bold text-dark">{user.name}</div>
                      <small className="text-muted text-truncate d-block">{user.email}</small>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to={
                        isPatient
                          ? '/patient/profile'
                          : isDoctor
                          ? '/doctor/profile'
                          : '/admin/dashboard'
                      }
                      onClick={closeNav}
                    >
                      <i className="bi bi-person me-2 text-primary"></i>My Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3 py-2 rounded-3 fw-medium" onClick={closeNav}>
                  <i className="bi bi-box-arrow-in-right me-1"></i>Sign In
                </Link>
                <Link to="/register" className="btn btn-info btn-sm px-3 py-2 rounded-3 fw-semibold text-dark shadow-sm" onClick={closeNav}>
                  <i className="bi bi-person-plus me-1"></i>Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
