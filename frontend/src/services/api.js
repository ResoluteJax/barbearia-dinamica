// frontend/src/services/api.js
import axios from 'axios';
import { format } from 'date-fns';

const apiClient = axios.create({
baseURL: import.meta.env.VITE_API_BASE_URL,
headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('authToken');
    // Se o token existir, adiciona-o ao header de Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const getServices = () => {
  return apiClient.get('/services');
};
export const getAvailability = (date) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  return apiClient.get(`/availability?date=${formattedDate}`);
};
export const loginUser = (credentials) => {
  return apiClient.post('/auth/login', credentials);
};
export const getAdminAppointments = () => {
  return apiClient.get('/admin/appointments');
};