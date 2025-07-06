// frontend/src/components/Footer/Footer.jsx
import React from 'react';
import Map from '../Map/Map'; // Importa nosso novo componente de mapa
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="address-section">
          <h3>Nossa Localização</h3>
          
          <p>R. Tamiarana, 218</p>
          <p>São Francisco de Assis, Belford Roxo - RJ</p>
          <p>CEP: 26125-720</p>
        </div>
        <div className="map-section">
          {/* Renderiza o componente de mapa aqui */}
          <Map />
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} D'Castro Barbearia. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;