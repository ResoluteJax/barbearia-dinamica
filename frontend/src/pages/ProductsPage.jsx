// frontend/src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import { FaTag } from 'react-icons/fa'; // Importa o ícone de etiqueta
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

  if (loading) return <div className="products-page-container"><p>Carregando produtos...</p></div>;
  if (error) return <p className="products-page-container error-message">{error}</p>;

  return (
    <div className="products-page-container">
      <h2>Vitrine de Produtos</h2>
      <p>Confira os produtos que usamos e recomendamos em nossos serviços.</p>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card-public">
            <div className="product-image-wrapper">
              <img 
                src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${product.imageUrl}`} 
                alt={product.name} 
                className="product-image"
              />
            </div>
            <div className="product-card-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-price">
                <FaTag /> {/* Adiciona o ícone aqui */}
                <span>R$ {Number(product.price).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;