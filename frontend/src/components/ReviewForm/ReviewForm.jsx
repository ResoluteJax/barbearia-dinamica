// frontend/src/components/ReviewForm/ReviewForm.jsx
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { createReview } from '../../services/api';
import './ReviewForm.scss';

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ message: '', type: '' });

    if (rating === 0 || name.trim() === '') {
      setFeedback({ message: 'Por favor, preencha seu nome e dê uma nota.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      await createReview({ customerName: name, rating, comment });
      setFeedback({ message: 'Obrigado! Sua avaliação foi enviada com sucesso.', type: 'success' });
      setName('');
      setComment('');
      setRating(0);
      setHover(0);
    } catch (err) {
      setFeedback({ message: 'Erro ao enviar avaliação. Tente novamente mais tarde.', type: 'error' });
      console.error("Erro no envio da avaliação:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3>Deixe sua Avaliação</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Sua Nota</label>
          <div className="star-rating">
            {[...Array(5)].map((star, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index}>
                  <input 
                    type="radio" 
                    name="rating" 
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                  />
                  <FaStar 
                    className="star"
                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="review-name">Seu Nome</label>
          <input type="text" id="review-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="review-comment">Seu Comentário (opcional)</label>
          <textarea id="review-comment" value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        {/* Adicionando a classe correta ao botão */}
        <button type="submit" className="submit-button" disabled={loading}>{loading ? 'Enviando...' : 'Enviar Avaliação'}</button>
        {feedback.message && <p className={`feedback-message ${feedback.type}`}>{feedback.message}</p>}
      </form>
    </div>
  );
};

export default ReviewForm;