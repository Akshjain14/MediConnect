import React, { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';
import DoctorList from '../components/DoctorList';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSpecializations = async () => {
    try {
      const data = await doctorService.getSpecializations();
      setSpecializations(data);
    } catch (err) {
      console.error('Failed to load specializations', err);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchQuery.trim()) params.query = searchQuery.trim();
      if (selectedSpecialization) params.specialization = selectedSpecialization;

      const data = await doctorService.getAllDoctors(params);
      setDoctors(data);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
      setError('Could not retrieve doctor directory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDoctors();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedSpecialization]);

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-4">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
          Directory
        </span>
        <h2 className="fw-bold mb-1">Find Certified Medical Specialists</h2>
        <p className="text-muted">
          Connect with experienced doctors, view availability, and schedule your appointment seamlessly.
        </p>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {loading && doctors.length === 0 ? (
        <Loading message="Loading doctors..." />
      ) : (
        <DoctorList
          doctors={doctors}
          specializations={specializations}
          searchQuery={searchQuery}
          selectedSpecialization={selectedSpecialization}
          onSearch={setSearchQuery}
          onFilter={setSelectedSpecialization}
        />
      )}
    </div>
  );
};

export default Doctors;
