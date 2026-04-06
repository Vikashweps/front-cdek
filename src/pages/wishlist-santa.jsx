import React from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

function Wishlist_Santa() {
  const navigate = useNavigate();
  const isEmpty = true; // Поменяйте на `false`, чтобы показать обычный вид

  const handleGoBack = () => {
    navigate(-1);  
  };

  return (
    <div className="overlay_wishlist">
      <div className="card_wishlist">

        {/* === ПУСТОЕ СОСТОЯНИЕ === */}
        {isEmpty ? (
          <div className="wishlist-empty">
            <i 
                className="ti ti-gift" 
                style={{ 
                  fontSize: '48px', 
                  color: '#44E858',
                  animation: 'bounce 2s infinite'
                }}
              ></i>
            <h2 className="empty-title">У этого участника пока нет вишлиста</h2>
            <p className="empty-text">
              Возможно, он ещё не успел добавить товары. Попробуйте позже или напишите в секретный чат!
            </p>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleGoBack}
            >
              Назад
            </button>
          </div>
        ) : (
          /* === ОБЫЧНЫЙ ВИД (если товары есть) === */
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
                  <img src="/Group 47.png" alt="Товар" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Пагинация — показываем только если есть товары */}
        {!isEmpty && (
          <div className="arrows-container">
            <button type="button" className="arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <h3>1 из N</h3>

            <button type="button" className="arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Wishlist_Santa;