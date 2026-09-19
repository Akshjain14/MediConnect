import api from './api';

export const doctorService = {
  getAllDoctors: async (params = {}) => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  getDoctorById: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  getDoctorByUserId: async (userId) => {
    const response = await api.get(`/doctors/user/${userId}`);
    return response.data;
  },

  updateDoctor: async (id, data) => {
    const response = await api.put(`/doctors/${id}`, data);
    return response.data;
  },

  getSpecializations: async () => {
    const response = await api.get('/doctors/specializations');
    return response.data;
  },

  getAvailability: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}/availability`);
    return response.data;
  },

  getAllAvailability: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}/availability/all`);
    return response.data;
  },

  addAvailability: async (doctorId, slotData) => {
    const response = await api.post(`/doctors/${doctorId}/availability`, slotData);
    return response.data;
  },

  deleteAvailability: async (availabilityId) => {
    const response = await api.delete(`/availability/${availabilityId}`);
    return response.data;
  },
};
