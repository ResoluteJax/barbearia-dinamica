// frontend/src/pages/admin/ManageReviews.jsx
import React, { useState, useEffect } from 'react';
import { getAdminReviews, updateReviewStatus } from '../../services/api';
import { FaStar } from 'react-icons/fa';
import './ManageReviews.scss';

const ManageReviews = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        const response = await getAdminReviews('PENDING');
        setPendingReviews(response.data);
      } catch (err) {
        setError('Falha ao carregar avaliações pendentes.');
      } finally {
        setLoading(false);
      }
    };
    fetchPendingReviews();
  }, []);

  const handleStatusUpdate = async (reviewId, newStatus) => {
    try {
      await updateReviewStatus(reviewId, newStatus);
      // Remove a avaliação da lista da tela para dar feedback visual imediato
      setPendingReviews(pendingReviews.filter(r => r.id !== reviewId));
    } catch (err) {
      setError(`Falha ao ${newStatus === 'APPROVED' ? 'aprovar' : 'rejeitar'} a avaliação.`);
    }
  };

  if (loading) return <p>Carregando avaliações...</p>;

  return (
    <div className="manage-reviews-container">
      <h2>Moderar Avaliações</h2>
      <p>Aqui você pode aprovar ou rejeitar as novas avaliações enviadas pelos clientes.</p>
      {error && <p className="error-message">{error}</p>}

      <div className="reviews-list">
        {pendingReviews.length > 0 ? (
          pendingReviews.map(review => (
            <div key={review.id} className="review-card">
              <h4>{review.customerName}</h4>
              <div className="star-rating-display">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < review.rating ? '#ffc107' : '#e4e5e9'} />
                ))}
              </div>
              <p className="comment">"{review.comment || 'Nenhum comentário.'}"</p>
              <div className="actions">
                <button onClick={() => handleStatusUpdate(review.id, 'APPROVED')} className="approve-btn">Aprovar</button>
                <button onClick={() => handleStatusUpdate(review.id, 'REJECTED')} className="reject-btn">Rejeitar</button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhuma avaliação pendente no momento.</p>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;