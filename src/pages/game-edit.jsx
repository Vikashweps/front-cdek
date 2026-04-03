import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

// === ФУНКЦИИ ВАЛИДАЦИИ ===

// Валидация названия команды
const validateTeamName = (name) => {
  const errors = [];
  const trimmed = name.trim();
  
  // Проверка: не пустое
  if (!trimmed) {
    errors.push('Название команды обязательно');
    return errors;
  }
  
  // Проверка: только разрешённые символы (кириллица, латиница, цифры, пробел, - , . ( ) /)
  const validPattern = /^[а-яА-ЯёЁa-zA-Z0-9\s\-\,\.\(\)\/]+$/;
  if (!validPattern.test(trimmed)) {
    errors.push('Разрешены только буквы, цифры, пробел и символы: - , . ( ) /');
  }
  
  // Проверка: длина (3–150 символов)
  if (trimmed.length < 3) {
    errors.push('Минимальная длина названия — 3 символа');
  }
  if (trimmed.length > 150) {
    errors.push('Максимальная длина названия — 150 символов');
  }
  
  // Проверка: нет пробелов по краям
  if (trimmed.startsWith(' ') || trimmed.endsWith(' ')) {
    errors.push('Название не должно начинаться или заканчиваться пробелом');
  }
  
  return errors;
};

// Валидация даты жеребьёвки
const validateDrawDate = (dateString) => {
  const errors = [];
  
  if (!dateString) {
    errors.push('Дата жеребьёвки обязательна');
    return errors;
  }
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Сбрасываем время для корректного сравнения
  
  // Проверка: валидная дата
  if (isNaN(date.getTime())) {
    errors.push('Введите корректную дату');
    return errors;
  }
  
  // Проверка: не в прошлом
  if (date < today) {
    errors.push('Дата жеребьёвки не может быть в прошлом');
  }
  
  // Проверка: разумный максимум (не дальше 5 лет)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 5);
  if (date > maxDate) {
    errors.push('Дата жеребьёвки не может быть дальше 5 лет');
  }
  
  return errors;
};

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

  // ← НОВОЕ: Состояния для ошибок и "затронутых" полей
  const [errors, setErrors] = useState({ teamName: [], drawDate: [] });
  const [touched, setTouched] = useState({ teamName: false, drawDate: false });

  // Обработчики изменений полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Если поле уже было затронуто — валидируем сразу
    if (touched[name]) {
      if (name === 'teamName') {
        setErrors(prev => ({ ...prev, teamName: validateTeamName(value) }));
      } else if (name === 'drawDate') {
        setErrors(prev => ({ ...prev, drawDate: validateDrawDate(value) }));
      }
    }
  };

  // ← НОВОЕ: Обработчик потери фокуса (валидация при уходе с поля)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (name === 'teamName') {
      setErrors(prev => ({ ...prev, teamName: validateTeamName(value) }));
    } else if (name === 'drawDate') {
      setErrors(prev => ({ ...prev, drawDate: validateDrawDate(value) }));
    }
  };

  // ← НОВОЕ: Проверка всей формы перед сохранением
  const isFormValid = () => {
    const nameErrors = validateTeamName(formData.teamName);
    const dateErrors = validateDrawDate(formData.drawDate);
    setErrors({ teamName: nameErrors, drawDate: dateErrors });
    return nameErrors.length === 0 && dateErrors.length === 0;
  };

  // Удаление участника
  const handleRemoveParticipant = (id) => {
    if (window.confirm('Удалить этого участника из игры?')) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  // Сохранение изменений
  const handleSave = () => {
    // ← НОВОЕ: Валидируем перед сохранением
    if (!isFormValid()) {
      setTouched({ teamName: true, drawDate: true }); // Показать все ошибки
      return;
    }
    
    console.log('Сохраняем изменения:', formData);
    console.log('Участники:', participants);
    alert('✅ Изменения сохранены!');
    navigate('/game');
  };

  // Отмена
  const handleCancel = () => {
    navigate('/game');
  };

  // Модальное окно
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const inviteLink = `${window.location.origin}/join/TEAM123`;

  const handleAddParticipant = () => {
    setIsModalOpen(true);
    setIsCopied(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsCopied(false);
  };

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
            
            {/* Поле названия команды */}
            <div className="form-group">
              <label>Название команды *</label>
              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Введите название"
                // ← Визуальная индикация ошибки
                className={errors.teamName.length > 0 && touched.teamName ? 'input-error' : ''}
              />
              {/* ← Сообщения об ошибках */}
              {errors.teamName.length > 0 && touched.teamName && (
                <ul className="error-list">
                  {errors.teamName.map((err, i) => (
                    <li key={i} className="error-item">• {err}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Поле даты жеребьёвки */}
            <div className="form-group">
              <label>Дата жеребьёвки *</label>
              <input
                type="date"
                name="drawDate"
                value={formData.drawDate}
                onChange={handleChange}
                onBlur={handleBlur}
                // ← Визуальная индикация ошибки
                className={errors.drawDate.length > 0 && touched.drawDate ? 'input-error' : ''}
                // ← Минимальная дата — сегодня
                min={new Date().toISOString().split('T')[0]}
              />
              {/* ← Сообщения об ошибках */}
              {errors.drawDate.length > 0 && touched.drawDate && (
                <ul className="error-list">
                  {errors.drawDate.map((err, i) => (
                    <li key={i} className="error-item">• {err}</li>
                  ))}
                </ul>
              )}
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
                      className="btn-remove"
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