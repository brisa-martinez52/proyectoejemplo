import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(dni, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page" data-testid="login-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Iniciar Sesión</h1>
          <p className="auth-subtitle">Ingresa a tu cuenta de Patitas</p>

          {error && (
            <div className="alert alert-error" data-testid="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="dni">DNI</label>
              <input
                type="text"
                id="dni"
                data-testid="login-dni-input"
                className="form-input"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
                placeholder="Ingresa tu DNI"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                data-testid="login-password-input"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              data-testid="login-submit-btn"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="auth-footer">
            <p>¿No tienes cuenta? <Link to="/register" data-testid="login-register-link">Regístrate aquí</Link></p>
            <p className="admin-note">🔑 Admin: DNI=&quot;admin&quot; | Contraseña=&quot;admin123&quot;</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
