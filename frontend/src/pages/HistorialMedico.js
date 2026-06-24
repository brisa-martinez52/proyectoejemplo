import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import '../App.css';

const HistorialMedico = () => {
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascota, setSelectedMascota] = useState('');
  const [historial, setHistorial] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMascotas();
    fetchVeterinarios();
  }, []);

  const fetchMascotas = async () => {
    try {
      const response = await axios.get(`${API}/mascotas`);
      setMascotas(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVeterinarios = async () => {
    try {
      const response = await axios.get(`${API}/veterinarios`);
      setVeterinarios(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistorial = async (mascotaId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/historial-medico/mascota/${mascotaId}`);
      setHistorial(response.data);
    } catch (err) {
      console.error(err);
      setHistorial([]);
    }
    setLoading(false);
  };

  const handleMascotaChange = (mascotaId) => {
    setSelectedMascota(mascotaId);
    if (mascotaId) {
      fetchHistorial(mascotaId);
    } else {
      setHistorial([]);
    }
  };

  const getVeterinarioNombre = (vetId) => {
    const vet = veterinarios.find(v => v.id === vetId);
    return vet ? `${vet.nombre} ${vet.apellido}` : 'N/A';
  };

  const mascotaSeleccionada = mascotas.find(m => m.id === selectedMascota);

  return (
    <div className="page-container" data-testid="historial-medico-page">
      <div className="container">
        <h1>Historial Médico</h1>

        <div className="card mb-20">
          <div className="form-group">
            <label className="form-label">Selecciona una mascota</label>
            <select 
              className="form-select" 
              value={selectedMascota}
              onChange={(e) => handleMascotaChange(e.target.value)}
              data-testid="select-mascota"
            >
              <option value="">-- Selecciona una mascota --</option>
              {mascotas.map(m => (
                <option key={m.id} value={m.id}>{m.nombre} - {m.raza}</option>
              ))}
            </select>
          </div>
        </div>

        {mascotaSeleccionada && (
          <div className="card-celeste mb-20">
            <h2>{mascotaSeleccionada.nombre}</h2>
            <div className="grid grid-4">
              <p><strong>Raza:</strong> {mascotaSeleccionada.raza}</p>
              <p><strong>Sexo:</strong> {mascotaSeleccionada.sexo}</p>
              <p><strong>Edad:</strong> {mascotaSeleccionada.edad} años</p>
              <p><strong>Peso:</strong> {mascotaSeleccionada.peso} kg</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando historial...</p>
          </div>
        )}

        {!loading && selectedMascota && historial.length === 0 && (
          <div className="card text-center">
            <p>No hay registros médicos para esta mascota</p>
          </div>
        )}

        {!loading && historial.length > 0 && (
          <div>
            <h2>Registros Médicos</h2>
            {historial.map(registro => (
              <div key={registro.id} className="card mb-20" data-testid={`historial-${registro.id}`}>
                <div className="flex-between mb-20">
                  <h3>📅 {new Date(registro.fecha).toLocaleDateString('es-AR')}</h3>
                  <p><strong>Dr. {getVeterinarioNombre(registro.veterinario_id)}</strong></p>
                </div>
                <div className="grid grid-2">
                  <div>
                    <p><strong>Diagnóstico:</strong></p>
                    <p>{registro.diagnostico}</p>
                  </div>
                  <div>
                    <p><strong>Tratamiento:</strong></p>
                    <p>{registro.tratamiento}</p>
                  </div>
                  {registro.vacunas && (
                    <div>
                      <p><strong>Vacunas:</strong></p>
                      <p>{registro.vacunas}</p>
                    </div>
                  )}
                  {registro.estudios && (
                    <div>
                      <p><strong>Estudios:</strong></p>
                      <p>{registro.estudios}</p>
                    </div>
                  )}
                  <div>
                    <p><strong>Peso:</strong> {registro.peso} kg</p>
                  </div>
                  {registro.observaciones && (
                    <div className="grid-span-2">
                      <p><strong>Observaciones:</strong></p>
                      <p>{registro.observaciones}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialMedico;