// frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Scheduler from './components/Scheduler/Scheduler';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // <-- Importe o Dashboard
import ProtectedRoute from './components/auth/ProtectedRoute'; // <-- Importe a rota protegida
import './App.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Barbearia Dinâmica</h1>
      </header>
      <main>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Scheduler />} />
          <Route path="/login" element={<Login />} />

          {/* Rota Protegida */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;