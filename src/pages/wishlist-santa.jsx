import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Импортируем нужный метод
import { fetchParticipantWishlist } from '../api/gameApi.js'; // Проверьте путь к файлу
import './main.css';

function Wishlist_Santa({ participantName: propName }) {
  const navigate = useNavigate();
  const { eventId, participantSlug } = useParams();

  // Определяем имя для отображения
  const nameFromSlug = participantSlug ? decodeURIComponent(participantSlug) : undefined;
  const displayName = propName || nameFromSlug || 'Участник';

  // Состояния
  const [gifts, setGifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  // Загрузка вишлиста при монтировании
  useEffect(() => {
    const loadWishlist = async () => {
      if (!eventId || !participantSlug) return;

      try {
        setIsLoading(true);
        setError(null);

        // ВАЖНО: API требует participantId. 
        // Если participantSlug в URL — это действительно ID (число или UUID), то передаем его.
        // Если Slug — это текстовое имя (напр. "ivan-ivanov"), а API ждет числовой ID,
        // то здесь нужно сначала сделать fetchParticipants(eventId), найти пользователя по slug и взять его id.
        // Ниже код предполагает, что participantSlug подходит как идентификатор для API.
        
        const data = await fetchParticipantWishlist(participantSlug, eventId);

        // Адаптируйте под структуру ответа вашего API
        // Ожидаем что-то вроде: { items: [...] } или просто массив [...]
        const items = Array.isArray(data) ? data : (data.items || data.data || []);

        setGifts(items);
        setIsEmpty(items.length === 0);

      } catch (err) {
        console.error('Ошибка загрузки вишлиста участника:', err);
        setError(err.message || 'Не удалось загрузить вишлист');
        setIsEmpty(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [eventId, participantSlug]);

  const handleClose = () => {
    // Возвращаемся на страницу игры или списка участников
    navigate(-1);
  };

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

  // Рендер состояния ошибки (если список пуст из-за ошибки)
  if (error && gifts.length === 0) {
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
              Подождите, пока {displayName} добавит товары, или напишите в секретный чат!
            </p>
          </div>
        ) : (
          <>
            {/* ЗАГОЛОВОК */}
            <div className="wishlist-header">
              <h1 className="wishlist-title">Вишлист: {displayName}</h1>
            </div>

            {/* СКРОЛЛИРУЕМЫЙ СПИСОК ПОДАРКОВ */}
            <div className="wishlist-scroll-container">
              <div className="wishlist-grid">
                {gifts.map((gift) => (
                  <div key={gift.id} className="gift-card">
                    {/* Убрал меню (3 точки), так как это чужой вишлист */}
                    
                    <div className="gift-content">
                      <div className="gift-image">
                        <img 
                          src={gift.imageUrl || gift.image || '/placeholder.png'} 
                          alt={gift.name} 
                          onError={(e) => { e.target.src = '/placeholder.png'; }}
                        />
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

export default Wishlist_Santa;