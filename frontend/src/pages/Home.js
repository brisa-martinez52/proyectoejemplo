import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page" data-testid="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400&h=400&fit=crop" 
              alt="Patitas Veterinaria"
              className="patitas-logo"
            />
          </div>
          <div className="hero-text">
            <div className="hero-title-box">
              <h1 className="hero-title">
                Cuidamos a tus mascotas con amor, confianza y atención personalizada.
              </h1>
              <p className="hero-subtitle">
                Encontrá productos, servicios veterinarios y el historial completo de tus compañeros en un solo lugar.
              </p>
            </div>

            {!user ? (
              <div className="hero-actions">
                <Link to="/login" data-testid="home-login-btn">
                  <button className="hero-btn login">Iniciar Sesión</button>
                </Link>
                <Link to="/register" data-testid="home-register-btn">
                  <button className="hero-btn register">Registrarse</button>
                </Link>
                <Link to="/login" data-testid="home-admin-btn">
                  <button className="hero-btn admin">Ingreso Administrador</button>
                </Link>
              </div>
            ) : (
              <div className="hero-actions">
                <Link to="/productos" data-testid="home-productos-btn">
                  <button className="hero-btn primary">Ver Productos</button>
                </Link>
                <Link to="/solicitar-turno" data-testid="home-turno-btn">
                  <button className="hero-btn secondary">Solicitar Turno</button>
                </Link>
                <Link to="/mis-mascotas" data-testid="home-mascotas-btn">
                  <button className="hero-btn secondary">Mis Mascotas</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="contact-info">
          <p className="contact-text">
            <strong>📞 +54 299 123456</strong> | 📍 Neuquén, Argentina
          </p>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Nuestros Servicios</h2>
          <div className="features-grid">
            <div className="feature-card" data-testid="feature-productos">
              <div className="feature-icon">🛍️</div>
              <h3>Tienda Online</h3>
              <p>Alimentos, accesorios y productos de calidad para tu mascota</p>
            </div>
            <div className="feature-card" data-testid="feature-turnos">
              <div className="feature-icon">📅</div>
              <h3>Turnos Veterinarios</h3>
              <p>Agenda citas con nuestros profesionales especializados</p>
            </div>
            <div className="feature-card" data-testid="feature-historial">
              <div className="feature-icon">📝</div>
              <h3>Historial Médico</h3>
              <p>Accede al historial completo de salud de tus mascotas</p>
            </div>
            <div className="feature-card" data-testid="feature-atencion">
              <div className="feature-icon">❤️</div>
              <h3>Atención Personalizada</h3>
              <p>Cuidado profesional y amoroso para cada paciente</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
