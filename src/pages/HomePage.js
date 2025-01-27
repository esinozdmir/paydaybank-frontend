import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // CSS dosyasını unutma!

const HomePage = () => {
    return (
        <div className="music-container">
            <div className="music-overlay">
                <h1 className="music-title">🎵 Müziğin Ritmini Hissedin! 🎶</h1>
                <p className="music-subtitle">Renkli ve enerjik bir müzik dünyasına hoş geldiniz.</p>

                <div className="button-container">
                    <Link to="/login" className="music-link">
                        <button className="music-button">Giriş Yap 🎸</button>
                    </Link>

                    <Link to="/register" className="music-link">
                        <button className="music-button">Kayıt Ol 🎤</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
