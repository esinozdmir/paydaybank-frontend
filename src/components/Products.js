import React, { useState, useEffect } from 'react';
import { LogOut, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import './Products.css';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fullname, setFullname] = useState('');

  useEffect(() => {
    const storedFullname = localStorage.getItem('userFullname');
    setFullname(storedFullname || 'Misafir');
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://localhost:8080/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        throw new Error('Ürünler yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, event) => {
    event.stopPropagation(); // Prevent navigation when clicking delete button
    
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8080/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        throw new Error('Ürün silinirken bir hata oluştu');
      }

      // Update products list after successful deletion
      setProducts(products.filter(product => product.id !== productId));
      alert('Ürün başarıyla silindi');
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Ürünler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left">
            <ShoppingBag className="shop-icon" />
            <h1>Ürün Kataloğu</h1>
          </div>
          <div className="header-right">
            <p>Hoş geldin, {fullname} 👋</p>
          </div>
        </header>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <ShoppingBag className="shop-icon" />
          <h1>Ürün Kataloğu</h1>
        </div>
        <p className="text-gray-600">
          Hoş geldin, <span className="font-medium text-gray-900">{fullname}</span> 👋
        </p>
      </header>
  
      <main className="dashboard-main">
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card"
                 onClick={() => navigate(`/products/${product.id}`)}
                 style={{ cursor: "pointer" }}>
              <div className="product-image-container">
                {product.image ? (
                  <img
                    src={product.image.startsWith('http') ? product.image : `http://localhost:8080${product.image}`}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = `
                        <div class="product-image-placeholder">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                          </svg>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="product-image-placeholder">
                    <ShoppingBag size={40} />
                  </div>
                )}
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-info">
                  <p className="product-available">
                    Stok Durumu: {product.available ? 'Mevcut' : 'Stokta Yok'}
                  </p>
                  <p className="product-price">{product.price} TL</p>
                </div>
                <button
                  className="delete-button"
                  onClick={(e) => handleDelete(product.id, e)}
                  disabled={deleteLoading}
                >
                  <Trash2 size={20} />
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Products;