import React, { useState } from 'react';
import DoctorCard from './DoctorCard';

const DoctorList = ({ doctors, specializations, onSearch, onFilter, selectedSpecialization, searchQuery }) => {
  return (
    <div>
      {/* Filters & Search Toolbar */}
      <div className="card border-0 shadow-sm rounded-3 mb-4 p-3 bg-light">
        <div className="row g-3 align-items-center">
          <div className="col-md-7 col-lg-8">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by doctor name, specialization, or location..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn btn-outline-secondary border-start-0"
                  type="button"
                  onClick={() => onSearch('')}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          <div className="col-md-5 col-lg-4">
            <select
              className="form-select"
              value={selectedSpecialization}
              onChange={(e) => onFilter(e.target.value)}
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Grid */}
      {doctors.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-3">
          <i className="bi bi-person-x text-muted" style={{ fontSize: '3rem' }}></i>
          <h5 className="mt-3 text-muted">No doctors found</h5>
          <p className="text-secondary small">
            Try adjusting your search criteria or clear your specialization filter.
          </p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {doctors.map((doctor) => (
            <div className="col" key={doctor.id}>
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
