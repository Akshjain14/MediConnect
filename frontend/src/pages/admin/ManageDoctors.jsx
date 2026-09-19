import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDoctors = async () => {
    try {
      const data = await adminService.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      console.error('Failed to load doctors', err);
      setError('Could not retrieve doctors list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleToggleStatus = async (doctor) => {
    const action = doctor.active ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${doctor.name}?`)) return;

    setError('');
    setSuccess('');
    try {
      await adminService.updateDoctorStatus(doctor.id, !doctor.active);
      setSuccess(`${doctor.name} has been ${doctor.active ? 'deactivated' : 'activated'}.`);
      fetchDoctors();
    } catch (err) {
      console.error('Failed to update doctor status', err);
      setError('Failed to update doctor status.');
    }
  };

  const filteredDoctors = doctors.filter((d) => {
    const q = search.toLowerCase();
    return (
      (d.name && d.name.toLowerCase().includes(q)) ||
      (d.specialization && d.specialization.toLowerCase().includes(q)) ||
      (d.location && d.location.toLowerCase().includes(q)) ||
      (d.email && d.email.toLowerCase().includes(q))
    );
  });

  if (loading) return <Loading message="Loading doctors list..." />;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
          Administration
        </span>
        <h2 className="fw-bold mb-1">Medical Specialist Governance</h2>
        <p className="text-muted">Manage clinical status, verify credentials, and activate or deactivate practitioners.</p>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {success && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div className="flex-grow-1">{success}</div>
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {/* Search Bar */}
      <div className="card border-0 shadow-sm rounded-3 mb-4 p-3 bg-light">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Search doctors by name, specialization, or clinic location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="btn btn-outline-secondary border-start-0" onClick={() => setSearch('')}>
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </div>

      {/* Doctors Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-body p-0">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-hospital fs-1"></i>
              <p className="mt-2 mb-0">No doctors found matching your search.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th scope="col" className="ps-4">Doctor</th>
                    <th scope="col">Specialization</th>
                    <th scope="col">Qualifications</th>
                    <th scope="col">Fee & Exp</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doc) => (
                    <tr key={doc.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: '40px', height: '40px' }}
                          >
                            <i className="bi bi-person-fill"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{doc.name}</div>
                            <small className="text-muted">{doc.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                          {doc.specialization}
                        </span>
                        <div className="text-muted small mt-1">
                          <i className="bi bi-geo-alt me-1 text-danger"></i>
                          {doc.location}
                        </div>
                      </td>
                      <td>
                        <div className="text-dark small fw-medium">{doc.qualification}</div>
                      </td>
                      <td>
                        <div className="text-success fw-bold">${doc.consultationFee?.toFixed(2)}</div>
                        <small className="text-muted">{doc.experience || 0} yrs experience</small>
                      </td>
                      <td>
                        {doc.active ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                            <i className="bi bi-check-circle me-1"></i>Active
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                            <i className="bi bi-dash-circle me-1"></i>Inactive
                          </span>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className={`btn btn-sm ${
                            doc.active ? 'btn-outline-danger' : 'btn-outline-success'
                          } fw-semibold`}
                          onClick={() => handleToggleStatus(doc)}
                        >
                          {doc.active ? (
                            <>
                              <i className="bi bi-person-x me-1"></i>Deactivate
                            </>
                          ) : (
                            <>
                              <i className="bi bi-person-check me-1"></i>Activate
                            </>
                          )}
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
  );
};

export default ManageDoctors;
