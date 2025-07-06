// frontend/src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Cria o Contexto
const ThemeContext = createContext();

// 2. Cria o Provedor do Contexto
export const ThemeProvider = ({ children }) => {
  // Estado para guardar o tema, começando com 'dark' como padrão
  const [theme, setTheme] = useState('dark');

  // Efeito que roda quando o tema muda
  useEffect(() => {
    const body = window.document.body;
    // Remove o tema antigo e adiciona o novo como uma classe no body
    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(`${theme}-theme`);
  }, [theme]);

  // Função para alternar o tema
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Cria um hook customizado para facilitar o uso do contexto
export const useTheme = () => {
  return useContext(ThemeContext);
};