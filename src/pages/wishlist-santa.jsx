import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { joinGameByLink } from '../api/invitationsApi.jsx';
import { fetchGameById, runDraw } from '../api/eventsApi.jsx';
import { fetchRecipientChat, sendMessage } from '../api/chatApi.jsx';
import './main.css';

void [joinGameByLink, fetchGameById, runDraw, fetchRecipientChat, sendMessage];

function Wishlist_Santa({ participantName }) {  // ← НОВОЕ: проп для имени
  const navigate = useNavigate();
  const { eventId, participantSlug } = useParams();
  const nameFromSlug = participantSlug
    ? decodeURIComponent(participantSlug)
    : undefined;

  // Приоритет: пропсы > сегмент URL > демо
  const displayName = participantName || nameFromSlug || 'Участник';
  
  const isEmpty = false;
  
  // Демо-данные подарков
  const [gifts] = useState([
    {
      id: 1,
      name: 'Алая зима - Мари Аннетт',
      price: '500 ₽',
      image: '/cookie.png',
      link: 'https://example.com/book',
    },
    {
      id: 2,
      name: 'Набор чая',
      price: '800 ₽',
      image: '/cookie.png',
      link: 'https://example.com/tea'
    },
    {
      id: 3,
      name: 'Коврик для мыши',
      price: '2 300 ₽',
      image: '/cookie.png',
      link: 'https://example.com/mousepad'
    },
    {
      id: 4,
      name: 'Эфирные масла',
      price: '500 ₽',
      image: '/cookie.png',
      link: null
    }
  ]);

  const handleClose = () => {
    navigate(`/game/${eventId}/wishlist`);
  };

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
              Подождите пока участник добавит товары или напишите в секретный чат!
            </p>
          </div>
        ) : (
          <>
            {/* ЗАГОЛОВОК — ← НОВОЕ: реальное имя участника */}
            <div className="wishlist-header">
              <h1 className="wishlist-title">Вишлист {displayName}</h1>
            </div>

            {/* СКРОЛЛИРУЕМЫЙ СПИСОК ПОДАРКОВ */}
            <div className="wishlist-scroll-container">
              <div className="wishlist-grid">
                {gifts.map((gift) => (
                  <div key={gift.id} className="gift-card">
                    <div className="gift-content">
                      <div className="gift-image">
                        <img src={gift.image} alt={gift.name} />
                      </div>
                      <div className="gift-info">
                        <h3 className="gift-name">{gift.name}</h3>
                        <p className="gift-price">{gift.price}</p>
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