import api from './api';

export const patientService = {
  getPatientById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  getPatientByUserId: async (userId) => {
    const response = await api.get(`/patients/user/${userId}`);
    return response.data;
  },

  updatePatient: async (id, data) => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },
};
