import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await adminService.getAllPatients();
        setPatients(data);
      } catch (err) {
        console.error('Failed to load patients', err);
        setError('Could not retrieve patients list.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.phone && p.phone.toLowerCase().includes(q)) ||
      (p.address && p.address.toLowerCase().includes(q))
    );
  });

  if (loading) return <Loading message="Loading patient list..." />;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
          Administration
        </span>
        <h2 className="fw-bold mb-1">Registered Patients Directory</h2>
        <p className="text-muted">Total {patients.length} registered patient account(s) on the platform.</p>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Search Input */}
      <div className="card border-0 shadow-sm rounded-3 mb-4 p-3 bg-light">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Search patients by name, email, phone, or address..."
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

      {/* Patients Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-body p-0">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-people fs-1"></i>
              <p className="mt-2 mb-0">No patients found matching your search.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th scope="col" className="ps-4">ID</th>
                    <th scope="col">Name & Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Age / Gender</th>
                    <th scope="col" className="pe-4">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((p) => (
                    <tr key={p.id}>
                      <td className="ps-4 fw-semibold text-muted">#{p.id}</td>
                      <td>
                        <div className="fw-bold text-dark">{p.name}</div>
                        <small className="text-muted">{p.email}</small>
                      </td>
                      <td>
                        <i className="bi bi-telephone me-1 text-primary"></i>
                        {p.phone || <span className="text-muted">N/A</span>}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {p.age ? `${p.age} yrs` : 'N/A'} &bull; {p.gender || 'N/A'}
                        </span>
                      </td>
                      <td className="pe-4 text-muted small" style={{ maxWidth: '280px' }}>
                        {p.address || <span className="text-muted">No address provided</span>}
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

export default ManagePatients;
