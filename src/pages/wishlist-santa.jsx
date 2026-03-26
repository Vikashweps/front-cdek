import React from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

function Wishlist_Santa() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);  
  };

  return (
    <div className="overlay_wishlist">
      <div className="card_wishlist">

        {/* Контейнер для двух колонок */}
        <div className="wishlist-content">
          
          <div className="column staff-data">
            <h1>Вишлист Имя</h1>

            <h3>Название</h3>
            <form>
              <div className="input-data">
                <span className="value">000 Р</span>
                </div>

                <div className="input-data">
                <span className="value">Ссылка на товар</span>
                </div>


              <button type="button" className="btn-secondary" onClick={handleGoBack}>
                Назад
              </button>
            </form>
          </div>

          <div className="column picture">
                <div className="avatar-upload">
                    <div className="avatar-preview">
                        <img src="/Group 47.png"  />
                    </div>
                </div>
          </div>

        </div>
        <div className="arrows-container">
          <button type="button" className="arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <h3 >1 из N</h3>

          <button type="button" className="arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Wishlist_Santa;