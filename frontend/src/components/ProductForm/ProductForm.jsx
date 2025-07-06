// frontend/src/components/ProductForm/ProductForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../services/api';
import './ProductForm.scss';

const ProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }

    try {
      await createProduct(formData);
      navigate('/admin/products'); // Redireciona para a lista após o sucesso
    } catch (err) {
      setError('Falha ao criar o produto. Verifique os dados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label htmlFor="name">Nome do Produto</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="price">Preço</label>
        <input type="number" step="0.01" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="image">Imagem do Produto</label>
        <input type="file" id="image" onChange={handleImageChange} required />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Produto'}
      </button>
    </form>
  );
};

export default ProductForm;