// frontend/src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import './ProductsPage.scss';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        setError('Não foi possível carregar os produtos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="products-page-container">
      <h2>Nossa Vitrine de Produtos</h2>
      <p>Confira os produtos que usamos e recomendamos.</p>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card-public">
            <img 
              src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${product.imageUrl}`} 
              alt={product.name} 
              className="product-image"
            />
            <div className="product-card-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">R$ {Number(product.price).toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;