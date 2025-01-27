import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    title: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');

        if (!token) {
          navigate('/login');
          return;
        }

        // Eğer backend'den profil bilgisi çekilecekse:
        const response = await fetch('http://localhost:8080/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          // Eğer profil henüz oluşturulmamışsa, email'i kullan
          setProfile(prev => ({
            ...prev,
            email: userEmail || ''
          }));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error('Profil güncellenirken bir hata oluştu');
      }

      alert('Profil başarıyla güncellendi!');
      navigate('/products');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Profil yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <UserCircle className="user-icon" />
          <h1>Profil Düzenle</h1>
        </div>
        <div className="header-right">
          
        </div>
      </header>

      <main className="dashboard-main">
        <form onSubmit={handleSubmit} className="profile-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="fullName">Ad Soyad:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="form-input"
              required
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Ünvan:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={profile.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="save-button">
              Kaydet
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="cancel-button"
            >
              İptal
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Profile;