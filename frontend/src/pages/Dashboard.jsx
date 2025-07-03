// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getAdminAppointments } from '../services/api'; // Criaremos esta função
import { format } from 'date-fns';
import './Dashboard.scss';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAdminAppointments();
        setAppointments(response.data);
      } catch (err) {
        setError('Falha ao buscar agendamentos. Sua sessão pode ter expirado.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <p>Carregando agendamentos...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Painel do Barbeiro - Agendamentos</h2>
      <div className="appointments-list">
        {appointments.length > 0 ? (
          appointments.map(app => (
            <div key={app.id} className="appointment-card">
              <h3>{app.service.name}</h3>
              <p><strong>Cliente:</strong> {app.customerName}</p>
              <p><strong>Horário:</strong> {format(new Date(app.date), 'dd/MM/yyyy \'às\' HH:mm')}</p>
            </div>
          ))
        ) : (
          <p>Nenhum agendamento encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;