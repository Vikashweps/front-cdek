import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './main.css';

function Game() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const isDrawDone = true; // Поменяйте на `true`, чтобы показать состояние после жеребьёвки
  const isOrganizer = true; 

  const [gameData] = useState({
    teamName: 'КОМАНДА1',
    period: '10.12.26',
    drawDate: '14.12.26',
    stage: isDrawDone ? 'Дарение подарков' : 'Добавление участников',
    participantsCount: 10,
    isOrganizer: isOrganizer,
    isDrawDone: isDrawDone,
    isChatAvailable: isDrawDone
  });

  const handleGoWishlist = () => {
    navigate('/wishlist'); 
  };

  const handleGoProfile = () => {
    navigate('/profile'); 
  };
  const handleGoEditGame = () => {
    navigate(`/game-edit?eventId=${encodeURIComponent(eventId || '')}`);
  };

  const handleLeaveGame = () => {
    if (window.confirm('Вы уверены, что хотите выйти из игры?')) {
      navigate('/profile');
    }
  };

  const handleDrawResult = () => {
    if (!gameData.isDrawDone) {
      alert('Жеребьёвка ещё не проведена!');
      return;
    }
    navigate('/game-letter');
  };

  const handleSecretChat = () => {
    if (!gameData.isChatAvailable) {
      alert('Секретный чат будет доступен после жеребьёвки!');
      return;
    }
    navigate(`/game/${eventId}/chat`);
  };

  return (
    <div className="overlay_game">
      <div className="card_game">
        {/* Заголовок */}
        <h2 className="game-title">Тайный Санта</h2>
        
        {/* Название команды */}
        <h1 className="team-name">Команда "{gameData.teamName}"</h1>

         {/* ← НОВОЕ: Кнопка редактирования (видна только организатору) */}
        {isOrganizer && (
          <button 
            type="button" 
            className="btn-edit-game"
            onClick={handleGoEditGame}
            title="Настройки игры"
          >
            <i 
            className="ti ti-edit" 
            style={{ 
              fontSize: '20px', 
              color: '#000000' 
            }}
          ></i>
          </button>
        )}

        {/* Информация об игре */}
        <div className="game-info">
          <p className="info-text">Начало игры: {gameData.period}</p>
          <p className="info-text">Дата жеребьёвки: {gameData.drawDate}</p>
        </div>
                  
        {/* Статус и участники - две колонки */}
        <div className="game-status-grid">
          <div className="status-box">
            <span className="status-label">Этап игры:</span>
            {/* ← Динамический текст этапа */}
            <span className="status-value">{gameData.stage}</span>
          </div>

          <div className="status-box">
            <span className="status-label">Количество участников:</span>
            <span className="status-value">{gameData.participantsCount}</span>
          </div>
        </div>

        {/* Кнопки - две колонки */}
        <div className="game-buttons-grid">
          <div className="buttons-column">
            <button 
              type="button" 
              className="btn-primary"  
              onClick={handleSecretChat}
              disabled={!gameData.isDrawDone}
            >
              Секретный чат
            </button>

            <button 
              type="button" 
              className="btn-primary"
              onClick={handleDrawResult}
              disabled={!gameData.isDrawDone}
            >
              Результат жеребьёвки
            </button>
          </div>

          <div className="buttons-column">
            <button 
              type="button" 
              className="btn-primary"
              onClick={handleGoWishlist}
            >
              Проверить вишлист
            </button>
            
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleGoProfile}
            >
              Мой профиль
            </button>
          </div>
        </div>

        {/* Футер с кнопкой выхода */}
        <div className="game-footer">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleLeaveGame}
            disabled={gameData.isDrawDone}  
          >
            Выйти из игры
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;