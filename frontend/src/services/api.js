import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  register: (name, email, password) =>
    apiClient.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
};

// Medical Records Service
export const medicalRecordService = {
  createMedicalRecord: (data) =>
    apiClient.post('/medical-records', data),
  getMedicalRecords: () =>
    apiClient.get('/medical-records'),
  getMedicalRecord: (id) =>
    apiClient.get(`/medical-records/${id}`),
  updateMedicalRecord: (id, data) =>
    apiClient.put(`/medical-records/${id}`, data),
  deleteMedicalRecord: (id) =>
    apiClient.delete(`/medical-records/${id}`),
};

export default apiClient;
