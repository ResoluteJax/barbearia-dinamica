import axios from 'axios';
import { format } from 'date-fns';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Funções de Agendamento e Serviços
export const getServices = () => apiClient.get('/services');
export const getAvailability = (date, duration) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  return apiClient.get(`/availability?date=${formattedDate}&serviceDuration=${duration}`);
};
export const createAppointment = (appointmentData) => apiClient.post('/appointments', appointmentData);

// Função de Autenticação
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);

// Funções de Admin
export const getAdminAppointments = () => apiClient.get('/admin/appointments');
export const deleteAppointment = (id) => apiClient.delete(`/admin/appointments/${id}`);

// Funções de Produtos
export const getProducts = () => apiClient.get('/products');
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);
export const createProduct = (formData) => {
  return apiClient.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Funções de Portfólio
export const getPortfolioImages = () => apiClient.get('/portfolio');
export const addPortfolioImage = (formData) => {
  return apiClient.post('/portfolio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deletePortfolioImage = (id) => apiClient.delete(`/portfolio/${id}`);

// Funções de Avaliação
export const getApprovedReviews = () => apiClient.get('/reviews');
export const createReview = (reviewData) => apiClient.post('/reviews', reviewData);
export const getAdminReviews = (status = '') => apiClient.get(`/admin/reviews?status=${status}`);
export const updateReviewStatus = (id, status) => apiClient.put(`/admin/reviews/${id}`, { status });
export const getPendingReviewCount = () => {
  return apiClient.get('/admin/reviews/pending-count');
};
export const apiChangePassword = (passwordData) => {
  return apiClient.put('/auth/change-password', passwordData);
};
export const requestPasswordReset = (data) => {
  return apiClient.post('/auth/request-password-reset', data);
};
export const resetPasswordWithToken = (data) => {
  return apiClient.post('/auth/reset-password-with-token', data);
}