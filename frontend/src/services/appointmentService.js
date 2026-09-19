import api from './api';

export const appointmentService = {
  bookAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  getAppointmentsByPatient: async (patientId) => {
    const response = await api.get(`/appointments/patient/${patientId}`);
    return response.data;
  },

  getAppointmentsByDoctor: async (doctorId) => {
    const response = await api.get(`/appointments/doctor/${doctorId}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/appointments/${id}/status`, { status });
    return response.data;
  },

  cancelAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};
