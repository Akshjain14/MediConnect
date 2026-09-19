import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import DashboardCard from '../../components/DashboardCard';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [statsData, appointmentsData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllAppointments(),
      ]);
      setStats(statsData);
      setRecentAppointments(appointmentsData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
      setError('Could not load administrative statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading message="Loading administrator dashboard..." />;

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="card border-0 bg-dark text-white rounded-4 shadow-sm p-4 mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-semibold mb-2">
              <i className="bi bi-shield-lock me-1"></i>Administration Console
            </span>
            <h2 className="fw-bold mb-1">System Overview & Analytics</h2>
            <p className="text-light opacity-75 small mb-0">
              Manage clinical practitioners, patient profiles, and system-wide appointment schedules.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/doctors" className="btn btn-warning text-dark fw-semibold px-3">
              <i className="bi bi-hospital me-1"></i>Manage Doctors
            </Link>
            <Link to="/admin/patients" className="btn btn-outline-light px-3">
              <i className="bi bi-people me-1"></i>Manage Patients
            </Link>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Statistics Cards Grid */}
      <div className="row g-4 mb-4">
        <div className="col-lg-4 col-md-6">
          <DashboardCard
            title="Total Registered Patients"
            count={stats?.totalPatients || 0}
            icon="bi-people-fill"
            bgClass="bg-primary"
            subtitle="Active patient accounts"
          />
        </div>

        <div className="col-lg-4 col-md-6">
          <DashboardCard
            title="Total Medical Specialists"
            count={stats?.totalDoctors || 0}
            icon="bi-hospital-fill"
            bgClass="bg-success"
            subtitle="Practicing doctors in directory"
          />
        </div>

        <div className="col-lg-4 col-md-6">
          <DashboardCard
            title="Total Appointments"
            count={stats?.totalAppointments || 0}
            icon="bi-calendar2-range-fill"
            bgClass="bg-info text-white"
            subtitle="Platform reservations"
          />
        </div>

        <div className="col-lg-6 col-md-6">
          <DashboardCard
            title="Pending Consultations"
            count={stats?.pendingAppointments || 0}
            icon="bi-hourglass-split"
            bgClass="bg-warning text-dark"
            subtitle="Awaiting doctor confirmation"
          />
        </div>

        <div className="col-lg-6 col-md-6">
          <DashboardCard
            title="Completed Consultations"
            count={stats?.completedAppointments || 0}
            icon="bi-check-all"
            bgClass="bg-success"
            subtitle="Finished clinical appointments"
          />
        </div>
      </div>

      {/* Quick Access & Recent Records */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="bi bi-clock-history me-2 text-primary"></i>Recent System Bookings
              </h5>
              <Link to="/admin/appointments" className="text-primary text-decoration-none small fw-semibold">
                View All &rarr;
              </Link>
            </div>

            {recentAppointments.length === 0 ? (
              <p className="text-muted text-center py-4">No appointments recorded yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <thead className="table-light text-muted">
                    <tr>
                      <th>ID</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map((a) => (
                      <tr key={a.id}>
                        <td className="fw-semibold">#{a.id}</td>
                        <td>{a.patientName}</td>
                        <td>{a.doctorName}</td>
                        <td>{a.appointmentDate} at {a.appointmentTime}</td>
                        <td>
                          <span className="badge bg-light text-dark border">{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold text-dark mb-3">Governance Shortcuts</h5>
            <div className="d-grid gap-2">
              <Link to="/admin/doctors" className="btn btn-outline-primary text-start p-3 rounded-3">
                <i className="bi bi-person-check me-2 fs-5 text-primary align-middle"></i>
                <span className="fw-semibold">Verify & Toggle Doctors</span>
                <small className="text-muted d-block ms-4">Activate or suspend practitioner listings</small>
              </Link>
              <Link to="/admin/patients" className="btn btn-outline-primary text-start p-3 rounded-3">
                <i className="bi bi-people me-2 fs-5 text-primary align-middle"></i>
                <span className="fw-semibold">Patient Directory</span>
                <small className="text-muted d-block ms-4">Inspect registered patient profiles</small>
              </Link>
              <Link to="/admin/appointments" className="btn btn-outline-primary text-start p-3 rounded-3">
                <i className="bi bi-calendar-range me-2 fs-5 text-primary align-middle"></i>
                <span className="fw-semibold">All Appointment Logs</span>
                <small className="text-muted d-block ms-4">System-wide scheduling audits</small>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
