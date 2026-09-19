import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAllPatients: async () => {
    const response = await api.get('/admin/patients');
    return response.data;
  },

  getAllDoctors: async () => {
    const response = await api.get('/admin/doctors');
    return response.data;
  },

  getAllAppointments: async () => {
    const response = await api.get('/admin/appointments');
    return response.data;
  },

  updateDoctorStatus: async (doctorId, active) => {
    const response = await api.put(`/admin/doctors/${doctorId}/status`, { active });
    return response.data;
  },
};
