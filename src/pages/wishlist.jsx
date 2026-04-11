import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinGameByLink } from '../api/invitationsApi.jsx';
import { fetchGameById, runDraw } from '../api/eventsApi.jsx';
import { fetchRecipientChat, sendMessage } from '../api/chatApi.jsx';
import './main.css';

void [joinGameByLink, fetchGameById, runDraw, fetchRecipientChat, sendMessage];

function Wishlist() {
  const navigate = useNavigate();
  const isEmpty = false;
  
  // Демо-данные подарков
  const [gifts, setGifts] = useState([
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

  const [openMenuId, setOpenMenuId] = useState(null);

  const handleGoProfile = () => {
    navigate('/profile'); 
  };

  const handleGoWishlist_add = () => {
    navigate('/wishlist-add'); 
  };

  const handleGoWishlist_red = (id) => {
    console.log('Редактировать:', id);
    navigate('/wishlist-red'); 
    setOpenMenuId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Удалить этот подарок?')) {
      setGifts(gifts.filter(gift => gift.id !== id));
      setOpenMenuId(null);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Закрытие меню при клике вне
  React.useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

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
                        <img src={gift.image} alt={gift.name} />
                      </div>
                      <div className="gift-info">
                        <h3 className="gift-name">{gift.name}</h3>
                        <p className="gift-price">{gift.price}</p>
                        {gift.link }
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