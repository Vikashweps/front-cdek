import React from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

function Wishlist() {
  const navigate = useNavigate();
  const isEmpty = true; // Поменяйте на `false`, чтобы показать обычный вид

  const handleGoProfile = () => {
    navigate('/profile'); 
  };

  const handleGoWishlist_add = () => {
    navigate('/wishlist-add'); 
  };

  const handleGoWishlist_red = () => {
    navigate('/wishlist-red'); 
  };

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="overlay_wishlist">
      <div className="card_wishlist">

        {/* === ПУСТОЕ СОСТОЯНИЕ === */}
        {isEmpty ? (
          <div className="wishlist-empty">
            <div className="empty-icon">🎁</div>
            <h2 className="empty-title">Тут пока ничего нет</h2>
            <p className="empty-text">
              Добавьте первый товар в свой вишлист, чтобы друзья знали, что вам подарить!
            </p>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={handleGoWishlist_add}
            >
              Добавить товар
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleGoBack}
            >
              Назад
            </button>
          </div>
        ) : (
          /* === ОБЫЧНЫЙ ВИД (если есть товары) === */
          <div className="wishlist-content">
            <div className="column staff-data">
              <h1>Название</h1>
              <form>
                <div className="input-data">
                  <span className="value">100 Р</span>
                </div>
                <div className="input-data">
                  <span className="value">Ссылка на товар</span>
                </div>
                <button type="button" className="btn-secondary" onClick={handleGoWishlist_red}>
                  Редактировать
                </button>
                <button type="button" className="btn-primary" onClick={handleGoWishlist_add}>
                  Добавить новый товар
                </button>
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
            <h3>1 из 1</h3>
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

export default Wishlist;