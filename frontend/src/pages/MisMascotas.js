import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import '../App.css';

const MisMascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', raza: '', sexo: 'Macho', edad: '', peso: ''
  });

  useEffect(() => {
    fetchMascotas();
  }, []);

  const fetchMascotas = async () => {
    try {
      const response = await axios.get(`${API}/mascotas`);
      setMascotas(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/mascotas/${editingId}`, formData);
      } else {
        await axios.post(`${API}/mascotas`, formData);
      }
      fetchMascotas();
      resetForm();
    } catch (err) {
      alert('Error al guardar mascota');
    }
  };

  const handleEdit = (mascota) => {
    setFormData({
      nombre: mascota.nombre,
      raza: mascota.raza,
      sexo: mascota.sexo,
      edad: mascota.edad,
      peso: mascota.peso
    });
    setEditingId(mascota.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta mascota?')) {
      try {
        await axios.delete(`${API}/mascotas/${id}`);
        fetchMascotas();
      } catch (err) {
        alert('Error al eliminar mascota');
      }
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', raza: '', sexo: 'Macho', edad: '', peso: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="page-container" data-testid="mis-mascotas-page">
      <div className="container">
        <div className="flex-between mb-20">
          <h1>Mis Mascotas</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} data-testid="add-mascota-btn">
            {showForm ? 'Cancelar' : '+ Agregar Mascota'}
          </button>
        </div>

        {showForm && (
          <div className="card mb-20">
            <h2>{editingId ? 'Editar Mascota' : 'Nueva Mascota'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input className="form-input" required value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})} data-testid="mascota-nombre-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Raza</label>
                  <input className="form-input" required value={formData.raza}
                    onChange={(e) => setFormData({...formData, raza: e.target.value})} data-testid="mascota-raza-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Sexo</label>
                  <select className="form-select" value={formData.sexo}
                    onChange={(e) => setFormData({...formData, sexo: e.target.value})} data-testid="mascota-sexo-select">
                    <option>Macho</option>
                    <option>Hembra</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Edad (años)</label>
                  <input className="form-input" type="number" required value={formData.edad}
                    onChange={(e) => setFormData({...formData, edad: e.target.value})} data-testid="mascota-edad-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Peso (kg)</label>
                  <input className="form-input" type="number" step="0.1" required value={formData.peso}
                    onChange={(e) => setFormData({...formData, peso: e.target.value})} data-testid="mascota-peso-input" />
                </div>
              </div>
              <div className="flex gap-10 mt-20">
                <button type="submit" className="btn btn-success" data-testid="save-mascota-btn">Guardar</button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {mascotas.length === 0 ? (
          <div className="card text-center">
            <p>No tienes mascotas registradas aún</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {mascotas.map(mascota => (
              <div key={mascota.id} className="card-celeste" data-testid={`mascota-card-${mascota.id}`}>
                <h3>{mascota.nombre}</h3>
                <p><strong>Raza:</strong> {mascota.raza}</p>
                <p><strong>Sexo:</strong> {mascota.sexo}</p>
                <p><strong>Edad:</strong> {mascota.edad} años</p>
                <p><strong>Peso:</strong> {mascota.peso} kg</p>
                <div className="flex gap-10 mt-20">
                  <button className="btn btn-secondary" onClick={() => handleEdit(mascota)} data-testid={`edit-${mascota.id}`}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(mascota.id)} data-testid={`delete-${mascota.id}`}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisMascotas;