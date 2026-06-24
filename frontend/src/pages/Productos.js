import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Productos.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [compraSuccess, setCompraSuccess] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('Todos');
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getItemsCount } = useCart();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${API}/productos`);
      setProductos(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar productos');
      setLoading(false);
    }
  };

  const handleAddToCart = (producto) => {
    addToCart(producto);
  };

  const handleComprar = async () => {
    if (!user) {
      alert('Debes iniciar sesión para comprar');
      return;
    }

    try {
      const items = cart.map(item => ({
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio
      }));

      await axios.post(`${API}/compras`, { items });
      setCompraSuccess('¡Compra realizada con éxito!');
      clearCart();
      setShowCart(false);
      fetchProductos(); // Refresh stock
      setTimeout(() => setCompraSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al realizar la compra');
    }
  };

  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria))];
  const productosFiltrados = categoriaFilter === 'Todos' 
    ? productos 
    : productos.filter(p => p.categoria === categoriaFilter);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="productos-page" data-testid="productos-page">
      <div className="container">
        <div className="productos-header">
          <h1>Tienda de Productos</h1>
          <button 
            className="cart-button" 
            onClick={() => setShowCart(!showCart)}
            data-testid="cart-toggle-btn"
          >
            🛒 Carrito ({getItemsCount()})
          </button>
        </div>

        {compraSuccess && (
          <div className="alert alert-success" data-testid="compra-success">
            {compraSuccess}
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {/* Category Filter */}
        <div className="category-filter">
          {categorias.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${categoriaFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoriaFilter(cat)}
              data-testid={`filter-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="productos-grid">
          {productosFiltrados.map(producto => (
            <div key={producto.id} className="producto-card" data-testid={`producto-${producto.id}`}>
              {producto.imagen_url && (
                <div className="producto-image">
                  <img src={producto.imagen_url} alt={producto.nombre} />
                </div>
              )}
              <div className="producto-info">
                <h3>{producto.nombre}</h3>
                <p className="producto-description">{producto.descripcion}</p>
                <p className="producto-categoria">{producto.categoria}</p>
                <div className="producto-footer">
                  <p className="producto-precio">${producto.precio.toLocaleString()}</p>
                  <p className="producto-stock">Stock: {producto.stock}</p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(producto)}
                  disabled={producto.stock === 0}
                  data-testid={`add-to-cart-${producto.id}`}
                >
                  {producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div className="cart-overlay" onClick={() => setShowCart(false)}>
            <div className="cart-sidebar" onClick={(e) => e.stopPropagation()} data-testid="cart-sidebar">
              <div className="cart-header">
                <h2>Carrito de Compras</h2>
                <button className="close-btn" onClick={() => setShowCart(false)}>✕</button>
              </div>

              {cart.length === 0 ? (
                <div className="cart-empty">
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.producto.id} className="cart-item" data-testid={`cart-item-${item.producto.id}`}>
                        <div className="cart-item-info">
                          <h4>{item.producto.nombre}</h4>
                          <p className="cart-item-precio">${item.producto.precio.toLocaleString()}</p>
                        </div>
                        <div className="cart-item-actions">
                          <div className="quantity-control">
                            <button 
                              onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                              data-testid={`decrease-${item.producto.id}`}
                            >
                              -
                            </button>
                            <span data-testid={`quantity-${item.producto.id}`}>{item.cantidad}</span>
                            <button 
                              onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                              data-testid={`increase-${item.producto.id}`}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="remove-btn"
                            onClick={() => removeFromCart(item.producto.id)}
                            data-testid={`remove-${item.producto.id}`}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-footer">
                    <div className="cart-total">
                      <h3>Total:</h3>
                      <h3 data-testid="cart-total">${getTotal().toLocaleString()}</h3>
                    </div>
                    <button
                      className="btn btn-success btn-block"
                      onClick={handleComprar}
                      data-testid="checkout-btn"
                      disabled={!user}
                    >
                      {user ? 'Finalizar Compra' : 'Inicia sesión para comprar'}
                    </button>
                    <button
                      className="btn btn-secondary btn-block"
                      onClick={clearCart}
                      data-testid="clear-cart-btn"
                    >
                      Vaciar Carrito
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Productos;
