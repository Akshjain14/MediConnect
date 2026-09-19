import React from 'react';

const DashboardCard = ({ title, count, icon, bgClass = 'bg-primary', subtitle }) => {
  return (
    <div className="card border-0 shadow-sm rounded-3 h-100 overflow-hidden">
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="text-muted text-uppercase fw-semibold small tracking-wide">{title}</span>
            <h2 className="display-6 fw-bold mb-0 mt-1 text-dark">{count}</h2>
            {subtitle && <small className="text-muted mt-1 d-block">{subtitle}</small>}
          </div>
          <div
            className={`d-flex align-items-center justify-content-center rounded-3 text-white ${bgClass}`}
            style={{ width: '56px', height: '56px', fontSize: '1.75rem' }}
          >
            <i className={`bi ${icon}`}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
