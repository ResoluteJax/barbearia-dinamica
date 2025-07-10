// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, requestPasswordReset, resetPasswordWithToken } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import './Login.scss';

const Login = () => {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [masterCode, setMasterCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await loginUser({ email, password });
      const { token } = response.data;
      login(token);
      const decodedToken = jwtDecode(token);
      if (decodedToken.mustChangePassword) {
        navigate('/admin/change-password');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await requestPasswordReset({ email, masterCode });
      setResetToken(response.data.resetToken);
      setView('resetPassword');
    } catch (err) {
      setError(err.response?.data?.message || 'Falha na verificação.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      setError('A nova senha precisa ter no mínimo 6 caracteres.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await resetPasswordWithToken({ resetToken, newPassword });
      setSuccess(response.data.message);
      setView('login');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Falha ao redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const renderLoginView = () => (
    <form onSubmit={handleLoginSubmit}>
      <h2>Login do Barbeiro</h2>
      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input type="email" id="login-email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="login-password">Senha</label>
        <input type="password" id="login-password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit" className="submit-button" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      <a onClick={() => { setView('requestCode'); clearMessages(); }} className="forgot-password-link">Esqueci minha senha</a>
    </form>
  );

  const renderRequestCodeView = () => (
    <form onSubmit={handleRequestCodeSubmit}>
      <h2>Resetar Senha</h2>
      <p>Insira seu e-mail e o código de reset fornecido.</p>
      <div className="form-group">
        <label htmlFor="reset-email">Email</label>
        <input type="email" id="reset-email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="master-code">Código Mestre</label>
        <input type="text" id="master-code" value={masterCode} onChange={e => setMasterCode(e.target.value)} required />
      </div>
      <button type="submit" className="submit-button" disabled={loading}>{loading ? 'Verificando...' : 'Verificar'}</button>
      <a onClick={() => { setView('login'); clearMessages(); }} className="forgot-password-link">Voltar para o Login</a>
    </form>
  );

  const renderResetPasswordView = () => (
    <form onSubmit={handleResetPasswordSubmit}>
      <h2>Definir Nova Senha</h2>
      <p>Crie uma nova senha segura para sua conta.</p>
      <div className="form-group">
        <label htmlFor="new-password">Nova Senha</label>
        <input type="password" id="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="confirm-password">Confirmar Nova Senha</label>
        <input type="password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
      </div>
      <button type="submit" className="submit-button" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Nova Senha'}</button>
    </form>
  );

  return (
    <div className="login-container">
      {view === 'login' && renderLoginView()}
      {view === 'requestCode' && renderRequestCodeView()}
      {view === 'resetPassword' && renderResetPasswordView()}

      {/* Container para as mensagens flutuantes */}
      <div className="feedback-container">
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default Login;