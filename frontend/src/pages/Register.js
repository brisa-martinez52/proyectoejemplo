import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page" data-testid="register-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Registrarse</h1>
          <p className="auth-subtitle">Crea tu cuenta en Patitas</p>

          {error && (
            <div className="alert alert-error" data-testid="register-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="dni">DNI</label>
              <input
                type="text"
                id="dni"
                name="dni"
                data-testid="register-dni-input"
                className="form-input"
                value={formData.dni}
                onChange={handleChange}
                required
                placeholder="Ingresa tu DNI"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  data-testid="register-nombre-input"
                  className="form-input"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  data-testid="register-apellido-input"
                  className="form-input"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                data-testid="register-email-input"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                data-testid="register-telefono-input"
                className="form-input"
                value={formData.telefono}
                onChange={handleChange}
                required
                placeholder="2991234567"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                data-testid="register-password-input"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                data-testid="register-confirm-password-input"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Repite tu contraseña"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              data-testid="register-submit-btn"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="auth-footer">
            <p>¿Ya tienes cuenta? <Link to="/login" data-testid="register-login-link">Inicia sesión aquí</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
