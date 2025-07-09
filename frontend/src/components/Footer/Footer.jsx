// frontend/src/components/Footer/Footer.jsx
import React from 'react';
import Map from '../Map/Map';
import ReviewForm from '../ReviewForm/ReviewForm';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="address-section">
          <h3>Nossa Localização</h3>
          <p>Av. Floripes Rocha, 398</p>
          <p>Centro, Belford Roxo - RJ</p>
          <p>CEP: 26130-380</p>
        </div>
        <div className="map-section">
          <Map />
        </div>
        {/* Adiciona a nova seção de avaliação */}
        <div className="review-section">
          <ReviewForm />
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} D'Castro Barbearia. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;