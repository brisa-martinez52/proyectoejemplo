import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getItemsCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" data-testid="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu} data-testid="navbar-logo">
          <img 
            src="https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=150&h=130&fit=crop" 
            alt="Patitas Logo" 
            className="logo-img"
          />
        </Link>

        {/* Hamburger Menu Button */}
        <button 
          className={`hamburger ${menuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          data-testid="hamburger-menu"
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={closeMenu} data-testid="nav-home">Inicio</Link>
          <Link to="/productos" onClick={closeMenu} data-testid="nav-productos">
            Productos {getItemsCount() > 0 && <span className="cart-badge">{getItemsCount()}</span>}
          </Link>
          
          {user ? (
            <>
              <Link to="/mis-mascotas" onClick={closeMenu} data-testid="nav-mascotas">Mis Mascotas</Link>
              <Link to="/solicitar-turno" onClick={closeMenu} data-testid="nav-turnos">Turnos</Link>
              <Link to="/historial-medico" onClick={closeMenu} data-testid="nav-historial">Historial</Link>
              {user.es_admin && (
                <Link to="/admin" onClick={closeMenu} data-testid="nav-admin" className="admin-link">
                  Panel Admin
                </Link>
              )}
              <Link to="/faq" onClick={closeMenu} data-testid="nav-faq">FAQ</Link>
              <button onClick={handleLogout} className="nav-btn logout-btn" data-testid="nav-logout">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/faq" onClick={closeMenu} data-testid="nav-faq">FAQ</Link>
              <Link to="/login" onClick={closeMenu} data-testid="nav-login">
                <button className="nav-btn login-btn">Iniciar Sesión</button>
              </Link>
              <Link to="/register" onClick={closeMenu} data-testid="nav-register">
                <button className="nav-btn register-btn">Registrarse</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
