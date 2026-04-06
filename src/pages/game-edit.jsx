import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

// === ФУНКЦИИ ВАЛИДАЦИИ ===

// Валидация названия команды
const validateTeamName = (name) => {
  const errors = [];
  const trimmed = name.trim();
  
  if (!trimmed) {
    errors.push('Название команды обязательно');
    return errors;
  }
  
  const validPattern = /^[а-яА-ЯёЁa-zA-Z0-9\s\-\,\.\(\)\/]+$/;
  if (!validPattern.test(trimmed)) {
    errors.push('Разрешены только буквы, цифры, пробел и символы: - , . ( ) /');
  }
  
  if (trimmed.length < 3) {
    errors.push('Минимальная длина названия — 3 символа');
  }
  if (trimmed.length > 150) {
    errors.push('Максимальная длина названия — 150 символов');
  }
  
  if (trimmed.startsWith(' ') || trimmed.endsWith(' ')) {
    errors.push('Название не должно начинаться или заканчиваться пробелом');
  }
  
  return errors;
};

// ← ИСПРАВЛЕНО: Функция теперь принимает даты как параметры
const validateDrawDate = (dateString, minDateStr, maxDateStr) => {
  const errors = [];
  
  if (!dateString) {
    errors.push('Дата жеребьёвки обязательна');
    return errors;
  }
  
  const date = new Date(dateString);
  
  // Проверка: валидная дата
  if (isNaN(date.getTime())) {
    errors.push('Введите корректную дату');
    return errors;
  }
  
  // ← ИСПРАВЛЕНО: Парсим строки дат в формате YYYY-MM-DD
  const minDate = new Date(minDateStr);
  const maxDate = new Date(maxDateStr);
  
  // Сбрасываем время для корректного сравнения
  date.setHours(0, 0, 0, 0);
  minDate.setHours(0, 0, 0, 0);
  maxDate.setHours(23, 59, 59, 999);
  
  // Проверка: не раньше минимума
  if (date < minDate) {
    errors.push(`Дата не может быть раньше ${minDateStr}`);
  }
  
  // ← ИСПРАВЛЕНО: Сравниваем с объектом Date, а не со строкой
  if (date > maxDate) {
    errors.push(`Дата не может быть позднее ${maxDateStr}`);
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

  // ← ИСПРАВЛЕНО: Формат дат должен быть YYYY-MM-DD (как возвращает input type="date")
  const MIN_DATE = '2026-12-01';
  const MAX_DATE = '2027-01-31';

  const [errors, setErrors] = useState({ teamName: [], drawDate: [] });
  const [touched, setTouched] = useState({ teamName: false, drawDate: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (touched[name]) {
      if (name === 'teamName') {
        setErrors(prev => ({ ...prev, teamName: validateTeamName(value) }));
      } else if (name === 'drawDate') {
        // ← ИСПРАВЛЕНО: Передаём даты как параметры
        setErrors(prev => ({ ...prev, drawDate: validateDrawDate(value, MIN_DATE, MAX_DATE) }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (name === 'teamName') {
      setErrors(prev => ({ ...prev, teamName: validateTeamName(value) }));
    } else if (name === 'drawDate') {
      // ← ИСПРАВЛЕНО: Передаём даты как параметры
      setErrors(prev => ({ ...prev, drawDate: validateDrawDate(value, MIN_DATE, MAX_DATE) }));
    }
  };

  // ← ИСПРАВЛЕНО: Используем formData.drawDate вместо drawDate
  const isFormValid = () => {
    const nameErrors = validateTeamName(formData.teamName);
    const dateErrors = validateDrawDate(formData.drawDate, MIN_DATE, MAX_DATE);
    setErrors({ teamName: nameErrors, drawDate: dateErrors });
    return nameErrors.length === 0 && dateErrors.length === 0;
  };

  const handleRemoveParticipant = (id) => {
    if (window.confirm('Удалить этого участника из игры?')) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (!isFormValid()) {
      setTouched({ teamName: true, drawDate: true });
      return;
    }
    
    console.log('Сохраняем изменения:', formData);
    console.log('Участники:', participants);
    alert('✅ Изменения сохранены!');
    navigate('/game');
  };

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
        <h2 className="game-title">Редактирование игры</h2>
        <h1 className="team-name">{formData.teamName}</h1>

        <div className="edit-content-grid">
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
                className={errors.teamName.length > 0 && touched.teamName ? 'input-error' : ''}
              />
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
                className={errors.drawDate.length > 0 && touched.drawDate ? 'input-error' : ''}
                // ← Используем тот же формат для min/max
                min={MIN_DATE}
                max={MAX_DATE}
              />
              {errors.drawDate.length > 0 && touched.drawDate && (
                <ul className="error-list">
                  {errors.drawDate.map((err, i) => (
                    <li key={i} className="error-item">• {err}</li>
                  ))}
                </ul>
              )}
            </div>

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
                      style={{ border: 'none' }}
                    >
                      <i className="ti ti-x" style={{ fontSize: '16px', color: 'black'}}></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="edit-footer">
          <button type="button" className="btn-primary" onClick={handleSave}>
            Сохранить изменения
          </button>
          <button type="button" className="btn-secondary" onClick={handleCancel}>
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
              <input type="text" className="link-input" value={inviteLink} readOnly />
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleCopyLink}
              >
                {isCopied ? (
                  <i 
                    className="ti ti-check" 
                    style={{ 
                      fontSize: '18px', 
                      color: '#1E1E1E',    /* ← Тёмный цвет для контраста на зелёном */
                      fontWeight: 'bold'   /* ← Жирность для лучшей видимости */
                    }}
                  />
                ) : 'Копировать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game_edit;