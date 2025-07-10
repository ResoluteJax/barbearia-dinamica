// frontend/src/pages/admin/ChangePassword.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiChangePassword } from '../../services/api'; // Criaremos essa função

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await apiChangePassword({ newPassword });
      setSuccess('Senha alterada com sucesso! Por favor, faça o login novamente com sua nova senha.');
      setTimeout(() => {
        logout(); // Desloga o usuário após 3 segundos para ele logar de novo
      }, 3000);
    } catch (err) {
      setError('Ocorreu um erro ao alterar a senha.');
    }
  };

  return (
    <div className="change-password-container">
      <h2>Defina sua Nova Senha</h2>
      <p>Por segurança, você precisa definir uma nova senha pessoal para continuar.</p>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="newPassword">Nova Senha</label>
          <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirme a Nova Senha</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit" className="submit-button" disabled={!!success}>Alterar Senha</button>
      </form>
    </div>
  );
};

export default ChangePassword;