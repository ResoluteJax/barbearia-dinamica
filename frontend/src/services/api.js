// frontend/src/services/api.js
import axios from 'axios';
import { format } from 'date-fns';

const apiClient = axios.create({
baseURL: import.meta.env.VITE_API_BASE_URL,
headers: {
    'Content-Type': 'application/json',
  },
});

export const getServices = () => {
  return apiClient.get('/services');
};

export const getAvailability = (date) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  return apiClient.get(`/availability?date=${formattedDate}`);
};