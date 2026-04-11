import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinGameByLink } from '../api/invitationsApi.jsx';
import { fetchGameById, runDraw } from '../api/eventsApi.jsx';
import { fetchRecipientChat, sendMessage } from '../api/chatApi.jsx';
import './main.css';

void [fetchGameById, runDraw, fetchRecipientChat, sendMessage];

function Profile() {
  const navigate = useNavigate();

  // Состояния для модального окна подключения
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinLink, setJoinLink] = useState('');
  const [joinError, setJoinError] = useState('');

  const handleGoHome = () => {
    navigate('/'); 
  };

  const handleGoWishlist = () => {
    navigate('/wishlist'); 
  };

  const handleGoProfileRed = () => {
    navigate('/profile-red'); 
  };

  const handleGoGameAdd = () => {
    navigate('/game-add'); 
  };

  const handleGoGame = () => {
    navigate('/game/demo');
  };

  // Открытие модалки
  const openJoinModal = () => {
    setIsJoinModalOpen(true);
    setJoinLink('');
    setJoinError('');
  };

  // Закрытие модалки
  const closeJoinModal = () => {
    setIsJoinModalOpen(false);
    setJoinLink('');
    setJoinError('');
  };

  // Обработка подключения к игре
  const handleJoinSubmit = async () => {
    if (!joinLink.trim()) {
      setJoinError('Введите ссылку-приглашение');
      return;
    }

    // Простая проверка: ссылка должна содержать домен или путь /join/
    // Можно усложнить регулярное выражение при необходимости
    const isValidLink = joinLink.includes('/join/') || joinLink.startsWith('http');

    if (!isValidLink) {
      setJoinError('Некорректный формат ссылки');
      return;
    }

    setJoinError('');
    try {
      const data = await joinGameByLink(joinLink.trim());
      const id =
        data?.eventId ??
        data?.event?.id ??
        data?.id ??
        'demo';
      closeJoinModal();
      navigate(`/game/${id}`);
    } catch (err) {
      setJoinError(err.message || 'Не удалось подключиться к игре');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Вы действительно хотите выйти из профиля?')) {
      localStorage.removeItem('token'); 
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="overlay_profile">
      <div className="card_profile">

        <button 
          type="button" 
          className="btn-logout" 
          onClick={handleLogout}
          title="Выйти из профиля"
        >
          <i className="ti ti-logout" style={{ fontSize: '20px' }}></i>
        </button>
        
        <h1>МОЙ ПРОФИЛЬ</h1>

        <div className="profile-content">
          {/* Левая колонка: Личные данные */}
          <div className="column personal-data">
            <h3>ЛИЧНЫЕ ДАННЫЕ</h3>
            <form>
              <div className="input-readonly">
                <span className="value">Иван Иванов</span>
              </div>

              <div className="input-readonly">
                <span className="value">ivan@example.com</span>
              </div>

              <button type="button" className="btn-secondary" onClick={handleGoProfileRed}>
                Изменить данные
              </button>

              <button type="button" className="btn-primary" onClick={handleGoWishlist}>
                Мой вишлист
              </button>

              <button type="button" className="btn-secondary" onClick={handleGoHome}>
                На главную
              </button>
            </form>
          </div>

          {/* Правая колонка: Игры */}
          <div className="column games-list">
            <h3>МОИ ИГРЫ</h3>
            
            <div className="games-scroll-container">
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 1 </button>
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 2</button>
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 3</button>
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 4</button>
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 5</button>
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 6</button>
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 7</button>
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 8</button> 
            </div>

            {/* Блок кнопок управления играми */}
            <div className="game-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              <button type="button" className="btn-primary" onClick={handleGoGameAdd}>
                + Создать новую игру
              </button>
              
              <button type="button" className="btn-secondary" onClick={openJoinModal}>
                Подключиться к игре
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === МОДАЛЬНОЕ ОКНО ПОДКЛЮЧЕНИЯ === */}
      {isJoinModalOpen && (
        <div className="modal-overlay" onClick={closeJoinModal}>
          <div className="modal-small" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeJoinModal}>×</button>
            
            <h3>Подключение к игре</h3>
            <p className="modal-label">Вставьте ссылку-приглашение:</p>
            
            <div className="link-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <input 
                type="text" 
                className={`link-input ${joinError ? 'input-error' : ''}`}
                placeholder="https://site.com/join/..."
                value={joinLink}
                onChange={(e) => {
                  setJoinLink(e.target.value);
                  if (joinError) setJoinError('');
                }}
                style={{ marginBottom: '10px' }}
              />
              
              <button 
                type="button" 
                className="btn-primary"
                onClick={handleJoinSubmit}
                style={{ width: '100%' }}
              >
                Войти в игру
              </button>
            </div>

            {joinError && <span className="error-text" style={{ marginTop: '8px', display: 'block' }}>{joinError}</span>}
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;