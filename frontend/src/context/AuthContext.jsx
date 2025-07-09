import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // O estado inicial verifica o localStorage para manter o login ao recarregar a página
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

  // Função de login que atualiza o estado E o localStorage
  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
  };

  // Função de logout que atualiza o estado E o localStorage
  const logout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto facilmente em outros componentes
export const useAuth = () => {
  return useContext(AuthContext);
};