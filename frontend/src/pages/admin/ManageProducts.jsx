import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/api';
import './ManageProducts.scss';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Falha ao carregar produtos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await deleteProduct(productId);
        // Atualiza a lista de produtos na tela removendo o que foi deletado
        setProducts(products.filter(p => p.id !== productId));
      } catch (err) {
        setError('Falha ao deletar o produto. Tente novamente.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="manage-products-container"><p>Carregando produtos...</p></div>;
  }

  return (
    <div className="manage-products-container">
  <div className="header">
    <div className="header-info">
    <h2>Gerenciar Produtos</h2>
    <p>Aqui você pode ver e remover os produtos da sua loja.</p>
    </div>
    <Link to="/admin/products/new" className="add-btn">
      Adicionar Produto
    </Link>
  </div>

  {error && <p className="error-message">{error}</p>}
      
      <div className="product-list">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-item">
              <img 
                src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${product.imageUrl}`} 
                alt={product.name} 
              />
              <div className="product-info">
                <h4>{product.name}</h4>
                <p>R$ {Number(product.price).toFixed(2).replace('.', ',')}</p>
              </div>
              <div className="product-actions">
                <button onClick={() => handleDelete(product.id)} className="delete-btn">
                  Deletar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum produto cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;