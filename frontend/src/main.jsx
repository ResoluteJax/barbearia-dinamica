// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; 
import { AuthProvider } from './context/AuthContext';

import './styles/main.scss';
import 'leaflet/dist/leaflet.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider> 
        <AuthProvider>
        <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);