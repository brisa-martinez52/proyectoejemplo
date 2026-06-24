import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Productos from './pages/Productos';
import MisMascotas from './pages/MisMascotas';
import SolicitarTurno from './pages/SolicitarTurno';
import HistorialMedico from './pages/HistorialMedico';
import AdminPanel from './pages/AdminPanel';
import FAQ from './pages/FAQ';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.es_admin ? children : <Navigate to="/" />;
};

function AppContent() {
  return (
    <div className="App">
      <Navbar />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/faq" element={<FAQ />} />
          <Route
            path="/mis-mascotas"
            element={
              <ProtectedRoute>
                <MisMascotas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/solicitar-turno"
            element={
              <ProtectedRoute>
                <SolicitarTurno />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historial-medico"
            element={
              <ProtectedRoute>
                <HistorialMedico />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
