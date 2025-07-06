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

// Cria um novo agendamento (rota pública)
export const createAppointment = (appointmentData) => {
  return apiClient.post('/appointments', appointmentData);
};
// Busca todos os produtos (rota pública)
export const getProducts = () => {
  return apiClient.get('/products');
};
// Deleta um produto pelo ID (rota protegida, o interceptor adiciona o token)
export const deleteProduct = (id) => {
  return apiClient.delete(`/products/${id}`);
};
// Cria um novo produto enviando dados de formulário (incluindo imagem)
export const createProduct = (formData) => {
  return apiClient.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// --- Funções de Portfólio ---
export const getPortfolioImages = () => {
  return apiClient.get('/portfolio');
};
export const addPortfolioImage = (formData) => {
  return apiClient.post('/portfolio', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const deletePortfolioImage = (id) => {
  return apiClient.delete(`/portfolio/${id}`);
};
export const deleteAppointment = (id) => {
  return apiClient.delete(`/admin/appointments/${id}`);
};