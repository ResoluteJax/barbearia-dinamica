// frontend/src/pages/admin/ManagePortfolio.jsx
import React, { useState, useEffect } from 'react';
import { getPortfolioImages, addPortfolioImage, deletePortfolioImage } from '../../services/api';
import './ManagePortfolio.scss';

const ManagePortfolio = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadImages = async () => {
    try {
      const response = await getPortfolioImages();
      setImages(response.data);
    } catch (err) {
      setError('Falha ao carregar imagens do portfólio.');
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setError('Por favor, preencha o título e selecione uma imagem.');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', file);

    try {
      const response = await addPortfolioImage(formData);
      setImages([response.data, ...images]); // Adiciona a nova imagem no início da lista
      setTitle('');
      setFile(null);
      document.getElementById('image-upload-input').value = null; // Limpa o input de arquivo
    } catch (err) {
      setError('Falha ao adicionar imagem.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (window.confirm('Tem certeza que deseja deletar esta imagem?')) {
      try {
        await deletePortfolioImage(imageId);
        setImages(images.filter(img => img.id !== imageId));
      } catch (err) {
        setError('Falha ao deletar imagem.');
      }
    }
  };

  return (
    <div className="manage-portfolio-container">
      <h2>Gerenciar Portfólio de Cortes</h2>

      <form onSubmit={handleSubmit} className="upload-form">
        <h3>Adicionar Nova Foto</h3>
        <div className="form-group">
          <label htmlFor="title">Título do Corte</label>
          <input 
            type="text" 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Degradê Navalhado com Risco"
          />
        </div>
        <div className="form-group">
          <label htmlFor="image-upload-input">Arquivo da Imagem</label>
          <input 
            type="file" 
            id="image-upload-input"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Adicionar ao Portfólio'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      <div className="portfolio-grid">
        {images.map(image => (
          <div key={image.id} className="portfolio-item">
            <img src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${image.imageUrl}`} alt={image.title} />
            <div className="overlay">
              <p>{image.title}</p>
              <button onClick={() => handleDelete(image.id)}>Deletar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePortfolio;