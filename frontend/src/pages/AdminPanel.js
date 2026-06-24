import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import '../App.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showVetForm, setShowVetForm] = useState(false);
  const [showHistorialForm, setShowHistorialForm] = useState(false);
  const [productForm, setProductForm] = useState({
    nombre: '', descripcion: '', precio: '', stock: '', categoria: 'Alimentos', imagen_url: ''
  });
  const [vetForm, setVetForm] = useState({
    nombre: '', apellido: '', especialidad: '', telefono: ''
  });
  const [historialForm, setHistorialForm] = useState({
    mascota_id: '', veterinario_id: '', diagnostico: '', tratamiento: '', vacunas: '', estudios: '', peso: '', observaciones: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, usersRes, mascotasRes, turnosRes, vetsRes, comprasRes] = await Promise.all([
        axios.get(`${API}/admin/stats`),
        axios.get(`${API}/productos`),
        axios.get(`${API}/auth/me`), // Limited, would need admin endpoint
        axios.get(`${API}/mascotas`),
        axios.get(`${API}/turnos`),
        axios.get(`${API}/veterinarios`),
        axios.get(`${API}/compras`)
      ]);
      setStats(statsRes.data);
      setProductos(prodRes.data);
      setMascotas(mascotasRes.data);
      setTurnos(turnosRes.data);
      setVeterinarios(vetsRes.data);
      setCompras(comprasRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/productos`, {
        ...productForm,
        precio: parseFloat(productForm.precio),
        stock: parseInt(productForm.stock)
      });
      alert('Producto creado exitosamente');
      setProductForm({ nombre: '', descripcion: '', precio: '', stock: '', categoria: 'Alimentos', imagen_url: '' });
      setShowProductForm(false);
      fetchAllData();
    } catch (err) {
      alert('Error al crear producto');
    }
  };

  const handleVetSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/veterinarios`, vetForm);
      alert('Veterinario creado exitosamente');
      setVetForm({ nombre: '', apellido: '', especialidad: '', telefono: '' });
      setShowVetForm(false);
      fetchAllData();
    } catch (err) {
      alert('Error al crear veterinario');
    }
  };

  const handleHistorialSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/historial-medico`, {
        ...historialForm,
        peso: parseFloat(historialForm.peso)
      });
      alert('Historial médico creado exitosamente');
      setHistorialForm({ mascota_id: '', veterinario_id: '', diagnostico: '', tratamiento: '', vacunas: '', estudios: '', peso: '', observaciones: '' });
      setShowHistorialForm(false);
    } catch (err) {
      alert('Error al crear historial médico');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await axios.delete(`${API}/productos/${id}`);
        fetchAllData();
      } catch (err) {
        alert('Error al eliminar producto');
      }
    }
  };

  const handleUpdateStock = async (id, newStock) => {
    try {
      await axios.put(`${API}/productos/${id}`, { stock: parseInt(newStock) });
      fetchAllData();
    } catch (err) {
      alert('Error al actualizar stock');
    }
  };

  if (loading && !stats) {
    return <div className="loading"><div className="spinner"></div><p>Cargando panel...</p></div>;
  }

  return (
    <div className="page-container" data-testid="admin-panel">
      <div className="container">
        <h1 style={{color: '#ff6b6b'}}>🔧 Panel de Administración</h1>

        {/* Tabs */}
        <div className="admin-tabs">
          {['stats', 'productos', 'veterinarios', 'turnos', 'mascotas', 'compras', 'historial'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              data-testid={`tab-${tab}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-4">
            <div className="card-celeste text-center">
              <h2>{stats.usuarios}</h2>
              <p>Usuarios</p>
            </div>
            <div className="card-celeste text-center">
              <h2>{stats.mascotas}</h2>
              <p>Mascotas</p>
            </div>
            <div className="card-celeste text-center">
              <h2>{stats.productos}</h2>
              <p>Productos</p>
            </div>
            <div className="card-celeste text-center">
              <h2>{stats.turnos_activos}</h2>
              <p>Turnos Activos</p>
            </div>
          </div>
        )}

        {/* Productos Tab */}
        {activeTab === 'productos' && (
          <div>
            <button className="btn btn-primary mb-20" onClick={() => setShowProductForm(!showProductForm)} data-testid="add-product-btn">
              {showProductForm ? 'Cancelar' : '+ Agregar Producto'}
            </button>

            {showProductForm && (
              <div className="card mb-20">
                <h2>Nuevo Producto</h2>
                <form onSubmit={handleProductSubmit}>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Nombre</label>
                      <input className="form-input" required value={productForm.nombre} onChange={(e) => setProductForm({...productForm, nombre: e.target.value})} data-testid="product-nombre" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Categoría</label>
                      <select className="form-select" value={productForm.categoria} onChange={(e) => setProductForm({...productForm, categoria: e.target.value})} data-testid="product-categoria">
                        <option>Alimentos</option>
                        <option>Accesorios</option>
                        <option>Juguetes</option>
                        <option>Higiene</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Precio</label>
                      <input className="form-input" type="number" step="0.01" required value={productForm.precio} onChange={(e) => setProductForm({...productForm, precio: e.target.value})} data-testid="product-precio" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Stock</label>
                      <input className="form-input" type="number" required value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} data-testid="product-stock" />
                    </div>
                    <div className="form-group" style={{gridColumn: 'span 2'}}>
                      <label className="form-label">Descripción</label>
                      <textarea className="form-textarea" required value={productForm.descripcion} onChange={(e) => setProductForm({...productForm, descripcion: e.target.value})} data-testid="product-descripcion" />
                    </div>
                    <div className="form-group" style={{gridColumn: 'span 2'}}>
                      <label className="form-label">URL Imagen</label>
                      <input className="form-input" value={productForm.imagen_url} onChange={(e) => setProductForm({...productForm, imagen_url: e.target.value})} data-testid="product-imagen" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success mt-20" data-testid="save-product">Guardar Producto</button>
                </form>
              </div>
            )}

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p.id} data-testid={`product-row-${p.id}`}>
                      <td>{p.nombre}</td>
                      <td>{p.categoria}</td>
                      <td>${p.precio.toLocaleString()}</td>
                      <td>
                        <input 
                          type="number" 
                          defaultValue={p.stock} 
                          onBlur={(e) => handleUpdateStock(p.id, e.target.value)}
                          style={{width: '70px', padding: '5px'}}
                          data-testid={`stock-input-${p.id}`}
                        />
                      </td>
                      <td>
                        <button className="btn btn-danger" onClick={() => handleDeleteProduct(p.id)} data-testid={`delete-product-${p.id}`}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Veterinarios Tab */}
        {activeTab === 'veterinarios' && (
          <div>
            <button className="btn btn-primary mb-20" onClick={() => setShowVetForm(!showVetForm)} data-testid="add-vet-btn">
              {showVetForm ? 'Cancelar' : '+ Agregar Veterinario'}
            </button>

            {showVetForm && (
              <div className="card mb-20">
                <h2>Nuevo Veterinario</h2>
                <form onSubmit={handleVetSubmit}>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Nombre</label>
                      <input className="form-input" required value={vetForm.nombre} onChange={(e) => setVetForm({...vetForm, nombre: e.target.value})} data-testid="vet-nombre" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Apellido</label>
                      <input className="form-input" required value={vetForm.apellido} onChange={(e) => setVetForm({...vetForm, apellido: e.target.value})} data-testid="vet-apellido" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Especialidad</label>
                      <input className="form-input" required value={vetForm.especialidad} onChange={(e) => setVetForm({...vetForm, especialidad: e.target.value})} data-testid="vet-especialidad" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Teléfono</label>
                      <input className="form-input" required value={vetForm.telefono} onChange={(e) => setVetForm({...vetForm, telefono: e.target.value})} data-testid="vet-telefono" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success mt-20" data-testid="save-vet">Guardar Veterinario</button>
                </form>
              </div>
            )}

            <div className="grid grid-3">
              {veterinarios.map(v => (
                <div key={v.id} className="card-celeste" data-testid={`vet-card-${v.id}`}>
                  <h3>{v.nombre} {v.apellido}</h3>
                  <p><strong>Especialidad:</strong> {v.especialidad}</p>
                  <p><strong>Teléfono:</strong> {v.telefono}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Turnos Tab */}
        {activeTab === 'turnos' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Mascota ID</th>
                  <th>Veterinario ID</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {turnos.map(t => (
                  <tr key={t.id} data-testid={`turno-admin-${t.id}`}>
                    <td>{t.mascota_id}</td>
                    <td>{t.veterinario_id}</td>
                    <td>{t.fecha}</td>
                    <td>{t.hora}</td>
                    <td>{t.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mascotas Tab */}
        {activeTab === 'mascotas' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Raza</th>
                  <th>Sexo</th>
                  <th>Edad</th>
                  <th>Peso</th>
                  <th>Usuario ID</th>
                </tr>
              </thead>
              <tbody>
                {mascotas.map(m => (
                  <tr key={m.id} data-testid={`mascota-admin-${m.id}`}>
                    <td>{m.nombre}</td>
                    <td>{m.raza}</td>
                    <td>{m.sexo}</td>
                    <td>{m.edad}</td>
                    <td>{m.peso}</td>
                    <td>{m.usuario_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Compras Tab */}
        {activeTab === 'compras' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Usuario ID</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {compras.map(c => (
                  <tr key={c.id} data-testid={`compra-admin-${c.id}`}>
                    <td>{c.usuario_id}</td>
                    <td>${c.total.toLocaleString()}</td>
                    <td>{new Date(c.fecha).toLocaleDateString()}</td>
                    <td>{c.items.length} items</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Historial Tab */}
        {activeTab === 'historial' && (
          <div>
            <button className="btn btn-primary mb-20" onClick={() => setShowHistorialForm(!showHistorialForm)} data-testid="add-historial-btn">
              {showHistorialForm ? 'Cancelar' : '+ Agregar Registro Médico'}
            </button>

            {showHistorialForm && (
              <div className="card mb-20">
                <h2>Nuevo Registro Médico</h2>
                <form onSubmit={handleHistorialSubmit}>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Mascota</label>
                      <select className="form-select" required value={historialForm.mascota_id} onChange={(e) => setHistorialForm({...historialForm, mascota_id: e.target.value})} data-testid="historial-mascota">
                        <option value="">Selecciona mascota</option>
                        {mascotas.map(m => <option key={m.id} value={m.id}>{m.nombre} - {m.raza}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Veterinario</label>
                      <select className="form-select" required value={historialForm.veterinario_id} onChange={(e) => setHistorialForm({...historialForm, veterinario_id: e.target.value})} data-testid="historial-vet">
                        <option value="">Selecciona veterinario</option>
                        {veterinarios.map(v => <option key={v.id} value={v.id}>{v.nombre} {v.apellido}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Diagnóstico</label>
                      <textarea className="form-textarea" required value={historialForm.diagnostico} onChange={(e) => setHistorialForm({...historialForm, diagnostico: e.target.value})} data-testid="historial-diagnostico" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tratamiento</label>
                      <textarea className="form-textarea" required value={historialForm.tratamiento} onChange={(e) => setHistorialForm({...historialForm, tratamiento: e.target.value})} data-testid="historial-tratamiento" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vacunas</label>
                      <input className="form-input" value={historialForm.vacunas} onChange={(e) => setHistorialForm({...historialForm, vacunas: e.target.value})} data-testid="historial-vacunas" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Estudios</label>
                      <input className="form-input" value={historialForm.estudios} onChange={(e) => setHistorialForm({...historialForm, estudios: e.target.value})} data-testid="historial-estudios" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Peso (kg)</label>
                      <input className="form-input" type="number" step="0.1" required value={historialForm.peso} onChange={(e) => setHistorialForm({...historialForm, peso: e.target.value})} data-testid="historial-peso" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Observaciones</label>
                      <textarea className="form-textarea" value={historialForm.observaciones} onChange={(e) => setHistorialForm({...historialForm, observaciones: e.target.value})} data-testid="historial-observaciones" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success mt-20" data-testid="save-historial">Guardar Registro</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .admin-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .tab-btn {
          padding: 12px 24px;
          border: 2px solid #83d4d7;
          background-color: white;
          color: #000;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .tab-btn:hover {
          background-color: #acf2f5;
        }
        .tab-btn.active {
          background-color: #83d4d7;
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
