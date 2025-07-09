import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { getApprovedReviews } from '../../services/api';
import { FaStar } from 'react-icons/fa';
import './ApprovedReviews.scss';

// Importa os estilos CSS do carrossel
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ApprovedReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getApprovedReviews();
        setReviews(response.data);
      } catch (err) {
        console.error("Falha ao buscar avaliações aprovadas", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Configurações do Carrossel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  if (loading) {
    return <p>Carregando avaliações...</p>;
  }

  if (reviews.length === 0) {
    return null; // Não mostra nada se não houver avaliações
  }

  return (
    <div className="approved-reviews-container">
      <h2>O que nossos clientes dizem</h2>
      <Slider {...settings}>
        {reviews.map(review => (
          <div key={review.id} className="review-slide">
            <div className="approved-review-card">
              <div className="star-rating-display">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} color="#ffc107" />
                ))}
              </div>
              <p className="comment">"{review.comment}"</p>
              <p className="customer-name">- {review.customerName}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ApprovedReviews;