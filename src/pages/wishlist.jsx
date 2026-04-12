import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Импортируем ваши API методы
import { 
  fetchMyWishlist, 
  addWishlistItem, 
  deleteWishlistItem 
} from '../api/wishlistApi.jsx'; // Убедитесь, что путь правильный
import './main.css';

function Wishlist() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  
  // Состояния
  const [gifts, setGifts] = useState([]);
  const [wishlistId, setWishlistId] = useState(null); // ID вишлиста нужен для добавления/удаления
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  
  const [openMenuId, setOpenMenuId] = useState(null);

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadWishlist = async () => {
      if (!eventId) return;

      try {
        setIsLoading(true);
        setError(null);
        
        // Запрос к вашему API
        const data = await fetchMyWishlist(eventId);
        
        // Адаптируйте под структуру ответа вашего API
        // Обычно это { id: ..., items: [...] } или просто массив
        const items = data.items || data.data || [];
        const wId = data.id || data.wishlistId;

        setWishlistId(wId);
        setGifts(items);
        setIsEmpty(items.length === 0);
        
      } catch (err) {
        console.error('Ошибка загрузки вишлиста:', err);
        setError(err.message || 'Не удалось загрузить товары');
        setIsEmpty(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWishlist();
  }, [eventId]);

  const handleGoWishlist_add = () => {
    // Передаем wishlistId и eventId на страницу добавления
    if (wishlistId) {
      navigate(`/game/${eventId}/wishlist/add?wishlistId=${wishlistId}`);
    } else {
      alert('Ошибка: Вишлист не найден');
    }
  };

  const handleGoWishlist_red = (id) => {
    navigate(`/game/${eventId}/wishlist/items/${id}`);
    setOpenMenuId(null);
  };

  // Удаление товара
  const handleDelete = async (itemId) => {
    if (!wishlistId) return;

    if (window.confirm('Удалить этот подарок?')) {
      try {
        // Оптимистичное обновление UI
        const prevGifts = [...gifts];
        setGifts(prev => prev.filter(gift => gift.id !== itemId));
        setOpenMenuId(null);
        
        // Запрос на сервер
        await deleteWishlistItem(wishlistId, itemId);
        
      } catch (err) {
        console.error('Ошибка удаления:', err);
        alert('Не удалось удалить товар. Попробуйте снова.');
        // Откат изменений при ошибке
        setGifts(prevGifts);
      }
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  // Рендер состояния загрузки
  if (isLoading) {
    return (
      <div className="overlay_wishlist">
        <div className="card_wishlist wishlist-new">
          <button className="close-wishlist" onClick={handleClose}>
            <i className="ti ti-x" style={{ fontSize: '24px', color: '#44E858' }}></i>
          </button>
          <div className="wishlist-loading">
            <i className="ti ti-loader" style={{ fontSize: '48px', color: '#44E858', animation: 'spin 1s linear infinite' }}></i>
            <p>Загрузка вишлиста...</p>
          </div>
        </div>
      </div>
    );
  }

  // Рендер состояния ошибки (если не пустой список)
  if (error && !isEmpty && gifts.length === 0) {
    return (
      <div className="overlay_wishlist">
        <div className="card_wishlist wishlist-new">
          <button className="close-wishlist" onClick={handleClose}>
            <i className="ti ti-x" style={{ fontSize: '24px', color: '#44E858' }}></i>
          </button>
          <div className="wishlist-error">
            <i className="ti ti-alert-circle" style={{ fontSize: '48px', color: '#e74c3c' }}></i>
            <p className="error-text">{error}</p>
            <button className="btn-secondary" onClick={() => window.location.reload()}>
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overlay_wishlist">
      <div className="card_wishlist wishlist-new">
        
        {/* КРЕСТИК ДЛЯ ЗАКРЫТИЯ */}
        <button className="close-wishlist" onClick={handleClose}>
          <i className="ti ti-x" style={{ fontSize: '24px', color: '#44E858' }}></i>
        </button>

        {/* ПУСТОЕ СОСТОЯНИЕ */}
        {isEmpty ? (
          <div className="wishlist-empty">
            <div className="empty-icon">
              <i className="ti ti-gift" style={{ fontSize: '48px', color: '#44E858', animation: 'bounce 2s infinite' }}></i>
            </div>
            <h2 className="empty-title">Тут пока ничего нет</h2>
            <p className="empty-text">
              Добавьте первый товар в свой вишлист, чтобы друзья знали, что вам подарить!
            </p>
            <button type="button" className="btn-primary" onClick={handleGoWishlist_add}>
              Добавить товар
            </button>
          </div>
        ) : (
          <>
            {/* ЗАГОЛОВОК С КНОПКОЙ */}
            <div className="wishlist-header">
              <h1 className="wishlist-title">Мой вишлист</h1>
              <button type="button" className="btn-primary" onClick={handleGoWishlist_add}>
                Добавить подарок
              </button>
            </div>

            {/* СКРОЛЛИРУЕМЫЙ СПИСОК ПОДАРКОВ */}
            <div className="wishlist-scroll-container">
              <div className="wishlist-grid">
                {gifts.map((gift) => (
                  <div key={gift.id} className="gift-card">
                    {/* Меню (3 точки) */}
                    <div className="gift-menu" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="gift-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(gift.id);
                        }}
                      >
                        <i className="ti ti-dots-vertical" style={{ fontSize: '20px', color: '#757575' }}></i>
                      </button>
                      
                      {/* Выпадающее меню */}
                      {openMenuId === gift.id && (
                        <div className="gift-menu-dropdown">
                          <button 
                            className="menu-item edit"
                            onClick={() => handleGoWishlist_red(gift.id)}
                          >
                            <i className="ti ti-pencil" style={{ fontSize: '16px' }}></i>
                            Редактировать
                          </button>
                          <button 
                            className="menu-item delete"
                            onClick={() => handleDelete(gift.id)}
                          >
                            <i className="ti ti-trash" style={{ fontSize: '16px' }}></i>
                            Удалить
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Контент карточки */}
                    <div className="gift-content">
                      <div className="gift-image">
                        <img src={gift.imageUrl || gift.image || '/placeholder.png'} alt={gift.name} />
                      </div>
                      <div className="gift-info">
                        <h3 className="gift-name">{gift.name}</h3>
                        <p className="gift-price">
                          {gift.price ? `${Number(gift.price).toLocaleString('ru-RU')} ₽` : ''}
                        </p>
                        {gift.link && (
                          <a href={gift.link} className="gift-link" target="_blank" rel="noopener noreferrer">
                            В магазин
                            <i className="ti ti-arrow-up-right" style={{ fontSize: '14px' }}></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Wishlist;