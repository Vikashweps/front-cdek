import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

function Game_edit() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    teamName: 'КОМАНДА1',
    drawDate: '2026-12-14',
  });

  const [participants, setParticipants] = useState([
    { id: 1, name: 'Анна Петрова', email: 'anna@example.com' },
    { id: 2, name: 'Иван Сидоров', email: 'ivan@example.com' },
    { id: 3, name: 'Мария Козлова', email: 'maria@example.com' },
    { id: 4, name: 'Дмитрий Волков', email: 'dmitry@example.com' },
    { id: 5, name: 'Елена Новикова', email: 'elena@example.com' },
    { id: 6, name: 'Алексей Морозов', email: 'alexey@example.com' },
  ]);

  // Обработчики изменений полей
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Удаление участника
  const handleRemoveParticipant = (id) => {
    if (window.confirm('Удалить этого участника из игры?')) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  // Сохранение изменений
  const handleSave = () => {
    console.log('Сохраняем изменения:', formData);
    console.log('Участники:', participants);
    alert('Изменения сохранены!');
    navigate('/game');
  };

  // Отмена
  const handleCancel = () => {
    navigate('/game');
  };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Ссылка для приглашения (в реальном приложении — с сервера)
    const inviteLink = `${window.location.origin}/join/TEAM123`;

    // Открыть окно
    const handleAddParticipant = () => {
    setIsModalOpen(true);
    setIsCopied(false);
    };

    // Закрыть окно
    const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsCopied(false);
    };

    // Копировать ссылку
    const handleCopyLink = async () => {
    try {
        await navigator.clipboard.writeText(inviteLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
        alert('Не удалось скопировать');
    }
    };

  return (
    <div className="overlay_game">
      <div className="card_game card_game-edit">
        {/* Заголовок */}
        <h2 className="game-title">Редактирование игры</h2>
        <h1 className="team-name">{formData.teamName}</h1>

        {/* Две колонки */}
        <div className="edit-content-grid">
          
          {/* ЛЕВАЯ КОЛОНКА: Поля редактирования */}
          <div className="edit-column edit-settings">
            <h3>Настройки игры</h3>
            
            <div className="form-group">
              <label>Название команды *</label>
              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                placeholder="Введите название"
              />
            </div>

            <div className="form-group">
              <label>Дата жеребьёвки *</label>
              <input
                type="date"
                name="drawDate"
                value={formData.drawDate}
                onChange={handleChange}
              />
            </div>

            {/* Ссылка на добавление участников */}
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleAddParticipant}
            >
              + Добавить участников
            </button>
          </div>

          {/* ПРАВАЯ КОЛОНКА: Список участников */}
          <div className="edit-column edit-participants">
            <div className="participants-header">
              <h3>Участники ({participants.length})</h3>
              <span className="participants-hint">Нажмите ✕ для удаления</span>
            </div>
            
            {/* Скроллируемый список */}
            <div className="participants-scroll">
              {participants.length === 0 ? (
                <p className="empty-participants">Пока нет участников</p>
              ) : (
                participants.map((participant) => (
                  <div key={participant.id} className="participant-item">
                    <div className="participant-info">
                      <span className="participant-name">{participant.name}</span>
                      <span className="participant-email">{participant.email}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleRemoveParticipant(participant.id)}
                      title="Удалить участника"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Кнопки сохранения */}
        <div className="edit-footer">
            <button 
            type="button" 
            className="btn-primary"
            onClick={handleSave}
          >
            Сохранить изменения
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleCancel}
          >
            Отмена
          </button>
          
        </div>
      </div>
      {/* Модальное окно со ссылкой */}
{isModalOpen && (
  <div className="modal-overlay" onClick={handleCloseModal}>
    <div className="modal-small" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={handleCloseModal}>×</button>
      
      <p className="modal-label">Ссылка для приглашения:</p>
      
      <div className="link-row">
        <input 
          type="text" 
          className="link-input" 
          value={inviteLink} 
          readOnly 
        />
        <button 
          type="button" 
          className="btn-primary"
          onClick={handleCopyLink}
        >
          {isCopied ? '✓' : 'Копировать'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Game_edit;