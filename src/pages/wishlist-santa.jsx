import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

function Wishlist_Santa() {
  const navigate = useNavigate();
  const isEmpty = false; // Поменяйте на `true`, чтобы показать пустое состояние
  
  // Параметры пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // Замените на реальное количество страниц из данных

  const handleGoBack = () => {
    navigate(-1);  
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Здесь логика загрузки предыдущей страницы
      console.log('Предыдущая страница', currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Здесь логика загрузки следующей страницы
      console.log('Следующая страница', currentPage + 1);
    }
  };

  // Флаги активности кнопок
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;
  const showPagination = !isEmpty && totalPages > 0;

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
                  <img src="/cookie.png" alt="Товар" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Пагинация — показываем только если есть товары и страниц больше 0 */}
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

export default Wishlist_Santa;