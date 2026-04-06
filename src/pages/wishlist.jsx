import React from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

function Wishlist() {
  const navigate = useNavigate();
  const isEmpty = false; // `false`, чтобы показать обычный вид
  
  // Параметры пагинации
  const currentPage = 1;
  const totalPages = 1; // если товаров мало, страница 1 из 1

  const handleGoProfile = () => {
    navigate('/profile'); 
  };

  const handleGoWishlist_add = () => {
    navigate('/wishlist-add'); 
  };

  const handleGoWishlist_red = () => {
    navigate('/wishlist-red'); 
  };

  // Закрыть страницу (переход на главную)
  const handleClose = () => {
    navigate('/', { replace: true });
  };

  // Обработчики для пагинации
  const handlePrevPage = () => {
    if (currentPage > 1) {
      console.log('Предыдущая страница');
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      console.log('Следующая страница');
    }
  };

  // Флаги активности кнопок
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;
  const showPagination = !isEmpty && totalPages > 0;

  return (
    <div className="overlay_wishlist">
      <div className="card_wishlist">
        
        {/* КРЕСТИК ДЛЯ ЗАКРЫТИЯ */}
        <button className="close" onClick={() => navigate(-1)}>
           <i className="ti ti-x" style={{ fontSize: '24px', color: '#44E858' }}></i>
        </button>
        {/* ПУСТОЕ СОСТОЯНИЕ */}
        {isEmpty ? (
          <div className="wishlist-empty">
            <div className="empty-icon">
              <i 
                className="ti ti-gift" 
                style={{ 
                  fontSize: '48px', 
                  color: '#44E858',
                  animation: 'bounce 2s infinite'
                }}
              ></i>
            </div>
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
          </div>
        ) : (
          /* если есть товары */
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
              </form>
            </div>
            <div className="column picture">
              <div className="avatar-upload">
                <div className="avatar-preview">
                  <img src="/cookie.png" alt="Товар" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Пагинация — показываем только если есть товары и больше 0 страниц */}
        {showPagination && (
          <div className="arrows-container">
            <button 
              type="button" 
              className={`arrow ${isPrevDisabled ? 'arrow-disabled' : ''}`}
              onClick={handlePrevPage}
              disabled={isPrevDisabled}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h3>{currentPage} из {totalPages}</h3>
            <button 
              type="button" 
              className={`arrow ${isNextDisabled ? 'arrow-disabled' : ''}`}
              onClick={handleNextPage}
              disabled={isNextDisabled}
            >
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