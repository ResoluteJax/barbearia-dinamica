// frontend/src/components/ThemeSwitcher/ThemeSwitcher.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeSwitcher.scss';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="theme-switch" htmlFor="theme-switch-checkbox">
      <input 
        id="theme-switch-checkbox"
        type="checkbox" 
        onChange={toggleTheme} 
        // O switch está "marcado" quando o tema é escuro
        checked={theme === 'dark'} 
      />
      <span className="slider">
        <FaSun className="icon sun" />
        <FaMoon className="icon moon" />
      </span>
    </label>
  );
};

export default ThemeSwitcher;