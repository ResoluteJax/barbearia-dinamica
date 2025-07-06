// frontend/src/pages/PortfolioPage.jsx
import React, { useState, useEffect } from 'react';
import { getPortfolioImages } from '../services/api';
import './PortfolioPage.scss';

const PortfolioPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await getPortfolioImages();
        setImages(response.data);
      } catch (err) {
        setError('Não foi possível carregar as imagens do portfólio.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (loading) return <p>Carregando galeria...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="portfolio-page-container">
      <h2>Galeria de Cortes</h2>
      <p>Inspire-se com alguns dos nossos melhores trabalhos.</p>
      <div className="portfolio-gallery-grid">
        {images.map(image => (
          <div key={image.id} className="gallery-item">
            <img 
              src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${image.imageUrl}`} 
              alt={image.title} 
            />
            <div className="gallery-item-title">{image.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;