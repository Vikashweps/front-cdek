import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Импортируем нужные методы API
import { fetchGameById, fetchParticipants, fetchAssignments } from '../api/gameApi.js';
import './main.css';

function Game() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  // Состояния для данных
  const [gameData, setGameData] = useState(null);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [isDrawDone, setIsDrawDone] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  
  // Состояния загрузки и ошибок
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadData = async () => {
      if (!eventId) return;

      try {
        setIsLoading(true);
        setError(null);

        // 1. Получаем данные игры
        const game = await fetchGameById(eventId);
        
        // 2. Получаем список участников (для подсчета количества)
        const participants = await fetchParticipants(eventId);
        const pCount = Array.isArray(participants) ? participants.length : (participants.items?.length || 0);
        setParticipantsCount(pCount);

        // 3. Проверяем, является ли текущий пользователь организатором
        // Обычно это поле isOrganizer в объекте игры или participant
        const organizerStatus = game.isOrganizer || false;
        setIsOrganizer(organizerStatus);

        // 4. Проверяем статус жеребьёвки
        // Пытаемся получить назначение. Если оно есть - жеребьёвка прошла.
        // Или проверяем поле status у игры (например, 'DRAW_DONE')
        let drawStatus = false;
        try {
          const assignment = await fetchAssignments(eventId);
          // Если ответ не пустой и содержит данные о назначении
          if (assignment && (assignment.recipient || assignment.length > 0)) {
            drawStatus = true;
          }
        } catch (assignErr) {
          // Если жеребьёвка ещё не проведена, API может вернуть 404 или пустой ответ
          drawStatus = false;
        }
        setIsDrawDone(drawStatus);

        // Сохраняем основные данные игры
        setGameData({
          teamName: game.name || game.teamName || 'Команда',
          period: game.startDate ? new Date(game.startDate).toLocaleDateString('ru-RU', { day: '2digit', month: '2digit', year: '2digit' }) : '...',
          drawDate: game.drawDate ? new Date(game.drawDate).toLocaleDateString('ru-RU', { day: '2digit', month: '2digit', year: '2digit' }) : '...',
          stage: drawStatus ? 'Дарение подарков' : 'Добавление участников',
          isChatAvailable: drawStatus
        });

      } catch (err) {
        console.error('Ошибка загрузки данных игры:', err);
        setError(err.message || 'Не удалось загрузить данные игры');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [eventId]);

  // Обработчики навигации
  const handleGoWishlist = () => {
    navigate(`/game/${eventId}/wishlist`);
  };

  const handleGoProfile = () => {
    navigate('/profile'); 
  };

  const handleGoEditGame = () => {
    navigate(`/game/${eventId}/edit`);
  };

  const handleLeaveGame = () => {
    if (window.confirm('Вы уверены, что хотите выйти из игры?')) {
      navigate('/profile');
    }
  };

  const handleDrawResult = () => {
    if (!isDrawDone) {
      alert('Жеребьёвка ещё не проведена!');
      return;
    }
    navigate(`/game/${eventId}/letter`);
  };

  const handleSecretChat = () => {
    if (!isDrawDone) {
      alert('Секретный чат будет доступен после жеребьёвки!');
      return;
    }
    navigate(`/game/${eventId}/chat`);
  };

  // Рендер состояния загрузки
  if (isLoading) {
    return (
      <div className="overlay_game">
        <div className="card_game">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <i className="ti ti-loader" style={{ fontSize: '48px', color: '#44E858', animation: 'spin 1s linear infinite' }}></i>
            <p style={{ marginTop: '20px', color: '#757575' }}>Загрузка игры...</p>
          </div>
        </div>
      </div>
    );
  }

  // Рендер состояния ошибки
  if (error || !gameData) {
    return (
      <div className="overlay_game">
        <div className="card_game">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <i className="ti ti-alert-circle" style={{ fontSize: '48px', color: '#e74c3c' }}></i>
            <h2 style={{ marginTop: '20px', color: '#1E1E1E' }}>Ошибка</h2>
            <p style={{ color: '#757575', marginBottom: '20px' }}>{error || 'Данные не найдены'}</p>
            <button className="btn-secondary" onClick={() => navigate('/profile')}>Вернуться в профиль</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overlay_game">
      <div className="card_game">
        {/* Заголовок */}
        <h2 className="game-title">Тайный Санта</h2>
        
        {/* Название команды */}
        <h1 className="team-name">{gameData.teamName}</h1>

         {/* Кнопка редактирования (видна только организатору) */}
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
            <span className="status-value">{gameData.stage}</span>
          </div>

          <div className="status-box">
            <span className="status-label">Количество участников:</span>
            <span className="status-value">{participantsCount}</span>
          </div>
        </div>

        {/* Кнопки - две колонки */}
        <div className="game-buttons-grid">
          <div className="buttons-column">
            <button 
              type="button" 
              className="btn-primary"  
              onClick={handleSecretChat}
              disabled={!gameData.isChatAvailable}
            >
              Секретный чат
            </button>

            <button 
              type="button" 
              className="btn-primary"
              onClick={handleDrawResult}
              disabled={!isDrawDone}
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
            disabled={isDrawDone}  
          >
            Выйти из игры
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;