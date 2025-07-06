// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminAppointments, deleteAppointment } from '../services/api'; // Importa a função delete
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
        setError('Falha ao buscar agendamentos.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Nova função para deletar o agendamento
  const handleDelete = async (appointmentId) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      try {
        await deleteAppointment(appointmentId);
        setAppointments(appointments.filter(app => app.id !== appointmentId));
      } catch (err) {
        setError('Falha ao cancelar o agendamento.');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Painel do Barbeiro</h2>
      {/* ... (código dos nav-cards) ... */}
      <div className="appointments-list-container">
        <h3>Próximos Agendamentos</h3>
        {loading && <p>Carregando...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <div className="appointments-list">
            {appointments.length > 0 ? (
              appointments.map(app => (
                <div key={app.id} className="appointment-card">
                  <h4>{app.service.name}</h4>
                  <p><strong>Cliente:</strong> {app.customerName}</p>
                  <p><strong>Horário:</strong> {format(new Date(app.date), 'dd/MM/yyyy \'às\' HH:mm')}</p>
                  <button onClick={() => handleDelete(app.id)} className="cancel-btn">
                    Cancelar
                  </button>
                </div>
              ))
            ) : <p>Nenhum agendamento encontrado.</p>}
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;