// frontend/src/components/Navbar/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes, FaCalendarCheck, FaShoppingBag, FaImages, FaTachometerAlt, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import './Navbar.scss';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="nav-brand" onClick={closeMenu}>
          <img src="/logo.jpeg" alt="Logo D'Castro Barbearia" className="brand-logo" />
          <span>
            D'Castro <br /> Barbearia
          </span>
        </NavLink>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={menuOpen ? 'nav-links active' : 'nav-links'}>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
              <FaCalendarCheck /> <span>Agendamento</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
              <FaShoppingBag /> <span>Produtos</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/portfolio" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
              <FaImages /> <span>Portfólio</span>
            </NavLink>
          </li>
          {isLoggedIn ? (
            <>
              {/* A classe 'nav-item-mobile' foi REMOVIDA daqui */}
              <li>
                <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
                  <FaTachometerAlt /> <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-button">
                  <FaSignOutAlt /> <span>Sair</span>
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
                <FaSignInAlt /> <span>Login</span>
              </NavLink>
            </li>
          )}
          <li className="theme-switcher-li">
            <ThemeSwitcher />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;