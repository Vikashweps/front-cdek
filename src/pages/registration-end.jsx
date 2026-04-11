import React from 'react';
import { useNavigate } from 'react-router-dom';
import { joinGameByLink } from '../api/invitationsApi.jsx';
import { fetchGameById, runDraw } from '../api/eventsApi.jsx';
import { fetchRecipientChat, sendMessage } from '../api/chatApi.jsx';
import './main.css';

void [joinGameByLink, fetchGameById, runDraw, fetchRecipientChat, sendMessage];

function Registration_end() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // ← Переход на главную
  };
  const handleGoWishlist = () => {
    navigate('/wishlist'); 
  };
  const handleGoProfile = () => {
    navigate('/profile'); 
  };

  return (
    <div className="overlay1">
      <div className="card1">
        <h1>ТАЙНЫЙ САНТА</h1>

        <form className="registration-end-form">
          <h3>Спасибо! Регистрация завершена.</h3>

          <button className="btn-primary" type="button"  onClick={handleGoWishlist}>
            Создать вишлист
          </button>
          <button className="btn-primary" type="button"  onClick={handleGoProfile}>
            Мой профиль
          </button>

          <button type="button" className="btn-secondary" onClick={handleGoHome}>
                На главную
          </button>
        </form>

      </div>
    </div>
  );
}

export default Registration_end;