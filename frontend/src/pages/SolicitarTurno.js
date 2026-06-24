import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import '../App.css';

const SolicitarTurno = () => {
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [formData, setFormData] = useState({
    mascota_id: '', veterinario_id: '', fecha: '', hora: ''
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mascotasRes, vetsRes, turnosRes] = await Promise.all([
        axios.get(`${API}/mascotas`),
        axios.get(`${API}/veterinarios`),
        axios.get(`${API}/turnos`)
      ]);
      setMascotas(mascotasRes.data);
      setVeterinarios(vetsRes.data);
      setTurnos(turnosRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/turnos`, formData);
      setSuccess('¡Turno solicitado con éxito!');
      setFormData({ mascota_id: '', veterinario_id: '', fecha: '', hora: '' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert('Error al solicitar turno');
    }
  };

  const handleCancelar = async (id) => {
    if (window.confirm('¿Seguro que deseas cancelar este turno?')) {
      try {
        await axios.put(`${API}/turnos/${id}`, { estado: 'cancelado' });
        fetchData();
      } catch (err) {
        alert('Error al cancelar turno');
      }
    }
  };

  const horariosDisponibles = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  return (
    <div className="page-container" data-testid="solicitar-turno-page">
      <div className="container">
        <h1>Solicitar Turno</h1>

        {success && <div className="alert alert-success" data-testid="turno-success">{success}</div>}

        <div className="card mb-20">
          <h2>Nuevo Turno</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Mascota</label>
                <select className="form-select" required value={formData.mascota_id}
                  onChange={(e) => setFormData({...formData, mascota_id: e.target.value})} data-testid="turno-mascota-select">
                  <option value="">Selecciona tu mascota</option>
                  {mascotas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Veterinario</label>
                <select className="form-select" required value={formData.veterinario_id}
                  onChange={(e) => setFormData({...formData, veterinario_id: e.target.value})} data-testid="turno-vet-select">
                  <option value="">Selecciona veterinario</option>
                  {veterinarios.map(v => <option key={v.id} value={v.id}>{v.nombre} {v.apellido} - {v.especialidad}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha</label>
                <input className="form-input" type="date" required value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})} data-testid="turno-fecha-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Hora</label>
                <select className="form-select" required value={formData.hora}
                  onChange={(e) => setFormData({...formData, hora: e.target.value})} data-testid="turno-hora-select">
                  <option value="">Selecciona horario</option>
                  {horariosDisponibles.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-20" data-testid="submit-turno-btn">Solicitar Turno</button>
          </form>
        </div>

        <h2>Mis Turnos</h2>
        {turnos.length === 0 ? (
          <div className="card text-center"><p>No tienes turnos programados</p></div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Mascota</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {turnos.map(turno => {
                  const mascota = mascotas.find(m => m.id === turno.mascota_id);
                  return (
                    <tr key={turno.id} data-testid={`turno-row-${turno.id}`}>
                      <td>{mascota?.nombre || 'N/A'}</td>
                      <td>{turno.fecha}</td>
                      <td>{turno.hora}</td>
                      <td><span className={turno.estado === 'activo' ? 'text-success' : 'text-danger'}>{turno.estado}</span></td>
                      <td>
                        {turno.estado === 'activo' && (
                          <button className="btn btn-danger" onClick={() => handleCancelar(turno.id)} data-testid={`cancel-${turno.id}`}>Cancelar</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolicitarTurno;