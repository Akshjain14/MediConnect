import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Doctors from './pages/Doctors';
import DoctorDetails from './pages/DoctorDetails';
import About from './pages/About';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientProfile from './pages/patient/PatientProfile';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';
import ManageAvailability from './pages/doctor/ManageAvailability';
import DoctorAppointments from './pages/doctor/DoctorAppointments';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePatients from './pages/admin/ManagePatients';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageAppointments from './pages/admin/ManageAppointments';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetails />} />
          <Route path="/about" element={<About />} />

          {/* Patient Protected Routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <PatientProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/book"
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          {/* Doctor Protected Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['DOCTOR']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/profile"
            element={
              <ProtectedRoute allowedRoles={['DOCTOR']}>
                <DoctorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/availability"
            element={
              <ProtectedRoute allowedRoles={['DOCTOR']}>
                <ManageAvailability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute allowedRoles={['DOCTOR']}>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManagePatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManageDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManageAppointments />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
