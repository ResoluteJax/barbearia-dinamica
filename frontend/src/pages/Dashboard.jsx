import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminAppointments, deleteAppointment, getPendingReviewCount } from '../services/api';
import { format } from 'date-fns';
import { FaBell, FaShoppingBag, FaImages, FaStar, FaUser, FaClock, FaCut } from 'react-icons/fa';
import './Dashboard.scss';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [appointmentsRes, reviewsCountRes] = await Promise.all([
          getAdminAppointments(),
          getPendingReviewCount()
        ]);
        setAppointments(appointmentsRes.data);
        setPendingReviewCount(reviewsCountRes.data.count);
      } catch (err) {
        setError('Falha ao carregar dados do painel. Tente atualizar a página.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

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

      {pendingReviewCount > 0 && (
        <Link to="/admin/reviews" className="pending-notification">
          <FaBell />
          <span>Você tem <strong>{pendingReviewCount}</strong> nova(s) avaliação(ões) para moderar.</span>
        </Link>
      )}

      <div className="dashboard-nav">
        <Link to="/admin/products" className="nav-card products">
          <FaShoppingBag className="card-icon" />
          <div className="card-text">
            <h3>Gerenciar Produtos</h3>
            <p>Adicione ou remova produtos da sua vitrine.</p>
          </div>
        </Link>
        <Link to="/admin/portfolio" className="nav-card portfolio">
          <FaImages className="card-icon" />
          <div className="card-text">
            <h3>Gerenciar Portfólio</h3>
            <p>Faça upload das fotos dos seus melhores cortes.</p>
          </div>
        </Link>
        <Link to="/admin/reviews" className="nav-card reviews">
          <FaStar className="card-icon" />
          <div className="card-text">
            <h3>Moderar Avaliações</h3>
            <p>Aprove ou rejeite as avaliações de seus clientes.</p>
          </div>
        </Link>
      </div>
      
      <div className="appointments-list-container">
        <h3>Próximos Agendamentos</h3>
        {loading && <p>Carregando agendamentos...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
            <div className="appointments-list">
              {appointments.length > 0 ? (
                appointments.map(app => (
                  <div key={app.id} className="appointment-card">
                    <p className="card-info-line">
                      <FaUser className="info-icon" /> 
                      <strong>Cliente:</strong> {app.customerName}
                    </p>
                    <p className="card-info-line">
                      <FaCut className="info-icon" />
                      <strong>Serviço:</strong> {app.service.name}
                    </p>
                    <p className="card-info-line">
                      <FaClock className="info-icon" />
                      <strong>Horário:</strong> {format(new Date(app.date), "dd/MM/yyyy 'às' HH:mm")}
                    </p>
                    <button onClick={() => handleDelete(app.id)} className="cancel-btn">
                      Cancelar
                    </button>
                  </div>
                ))
              ) : (
                <p>Nenhum agendamento futuro encontrado.</p>
              )}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Dashboard;