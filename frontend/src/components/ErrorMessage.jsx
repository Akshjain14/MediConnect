import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center shadow-sm" role="alert">
      <i className="bi bi-exclamation-triangle-fill fs-5 me-2 flex-shrink-0"></i>
      <div className="flex-grow-1">{message}</div>
      {onClose && (
        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
      )}
    </div>
  );
};

export default ErrorMessage;
