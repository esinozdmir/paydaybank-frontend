import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, UserCircle, LogOut, PlusCircle } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const NavButton = ({ icon: Icon, text, path, onClick, className }) => (
    <button
      onClick={onClick || (() => navigate(path))}
      className={`nav-button ${location.pathname === path ? 'nav-active' : 'nav-inactive'} ${className}`}
    >
      <Icon className="nav-icon" />
      <span>{text}</span>
    </button>
  );

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Menü</h1>
        </div>

        <div className="nav-links">
          <NavButton icon={ShoppingBag} text="Ürünler" path="/products" />
          <NavButton icon={PlusCircle} text="Ürün Ekle" path="/add-product" />
          <NavButton icon={UserCircle} text="Profil" path="/profile" />
          <NavButton icon={LogOut} text="Çıkış Yap" onClick={handleLogout} className="logout-button" />
        </div>
      </aside>

      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
