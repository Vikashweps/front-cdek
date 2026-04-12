import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Импортируем нужные методы API
import { fetchGameById, updateGame, fetchParticipants, removeParticipant, generateInviteLink } from '/src/api/gameApi.jsx';
import './main.css';

// === ФУНКЦИИ ВАЛИДАЦИИ (без изменений) ===
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

const validateDrawDate = (dateString, minDateStr, maxDateStr) => {
  const errors = [];
  if (!dateString) {
    errors.push('Дата жеребьёвки обязательна');
    return errors;
  }
  const date = new Date(dateString);
  const minDate = new Date(minDateStr);
  const maxDate = new Date(maxDateStr);
  date.setHours(0, 0, 0, 0);
  minDate.setHours(0, 0, 0, 0);
  maxDate.setHours(23, 59, 59, 999);
  if (isNaN(date.getTime())) {
    errors.push('Введите корректную дату');
    return errors;
  }
  if (date < minDate || date > maxDate) {
    errors.push(`Дата должна быть между ${minDateStr} и ${maxDateStr}`);
  }
  return errors;
};

const validateOrganizerNotes = (notes) => {
  const errors = [];
  if (notes && notes.length > 500) {
    errors.push('Максимальная длина — 500 символов');
  }
  return errors;
};

function Game_edit() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  // Состояния для данных формы
  const [formData, setFormData] = useState({
    teamName: '',
    drawDate: '',
  });

  const [organizerNotes, setOrganizerNotes] = useState('');
  const [participants, setParticipants] = useState([]);
  
  // Состояния загрузки и ошибок
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  const MIN_DATE = '2026-12-01';
  const MAX_DATE = '2027-01-31';

  const [errors, setErrors] = useState({ teamName: [], drawDate: [], organizerNotes: [] });
  const [touched, setTouched] = useState({ teamName: false, drawDate: false, organizerNotes: false });

  // ← НОВОЕ: Загрузка данных игры при монтировании
  useEffect(() => {
    const loadData = async () => {
      if (!eventId) return;

      try {
        setIsLoading(true);
        
        // 1. Получаем данные игры
        const game = await fetchGameById(eventId);
        
        // Заполняем форму данными с сервера
        setFormData({
          teamName: game.name || game.teamName || '',
          drawDate: game.drawDate ? game.drawDate.split('T')[0] : '' // Преобразуем в YYYY-MM-DD
        });
        
        // Получаем пожелания организатора (если есть такое поле в ответе)
        setOrganizerNotes(game.organizerNotes || game.description || '');

        // 2. Получаем ссылку-приглашение
        try {
          const inviteData = await generateInviteLink(eventId);
          // Адаптируйте под структуру ответа (может быть ссылка или код)
          const link = inviteData.link || inviteData.invitationLink || `${window.location.origin}/join/${inviteData.code || eventId}`;
          setInviteLink(link);
        } catch (err) {
          console.warn('Не удалось получить ссылку-приглашение', err);
          setInviteLink(`${window.location.origin}/join/${eventId}`);
        }

        // 3. Получаем список участников
        const participantsList = await fetchParticipants(eventId);
        // Адаптируем ответ (массив или объект { items: [] })
        const list = Array.isArray(participantsList) ? participantsList : (participantsList.items || []);
        setParticipants(list);

      } catch (error) {
        console.error('Ошибка загрузки данных игры:', error);
        alert('Не удалось загрузить данные игры. Проверьте консоль.');
        navigate(`/game/${eventId}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [eventId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (touched[name]) {
      if (name === 'teamName') {
        setErrors(prev => ({ ...prev, teamName: validateTeamName(value) }));
      } else if (name === 'drawDate') {
        setErrors(prev => ({ ...prev, drawDate: validateDrawDate(value, MIN_DATE, MAX_DATE) }));
      }
    }
  };

  const handleNotesChange = (e) => {
    const value = e.target.value;
    setOrganizerNotes(value);
    if (touched.organizerNotes) {
      setErrors(prev => ({ ...prev, organizerNotes: validateOrganizerNotes(value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (name === 'teamName') {
      setErrors(prev => ({ ...prev, teamName: validateTeamName(value) }));
    } else if (name === 'drawDate') {
      setErrors(prev => ({ ...prev, drawDate: validateDrawDate(value, MIN_DATE, MAX_DATE) }));
    } else if (name === 'organizerNotes') {
      setErrors(prev => ({ ...prev, organizerNotes: validateOrganizerNotes(value) }));
    }
  };

  const isFormValid = () => {
    const nameErrors = validateTeamName(formData.teamName);
    const dateErrors = validateDrawDate(formData.drawDate, MIN_DATE, MAX_DATE);
    const notesErrors = validateOrganizerNotes(organizerNotes);
    setErrors({ teamName: nameErrors, drawDate: dateErrors, organizerNotes: notesErrors });
    return nameErrors.length === 0 && dateErrors.length === 0 && notesErrors.length === 0;
  };

  // ← НОВОЕ: Удаление участника через API
  const handleRemoveParticipant = async (id) => {
    if (window.confirm('Удалить этого участника из игры?')) {
      try {
        await removeParticipant(id);
        // Обновляем список локально
        setParticipants(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Ошибка удаления участника:', error);
        alert('Не удалось удалить участника. Попробуйте позже.');
      }
    }
  };

  // ← НОВОЕ: Сохранение изменений через API
  const handleSave = async () => {
    if (!isFormValid()) {
      setTouched({ teamName: true, drawDate: true, organizerNotes: true });
      return;
    }
    
    try {
      setIsSaving(true);

      const updatedData = {
        name: formData.teamName,
        drawDate: formData.drawDate,
        organizerNotes: organizerNotes
      };

      await updateGame(eventId, updatedData);
      
      alert('Изменения сохранены!');
      navigate(`/game/${eventId}`);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить изменения. Попробуйте позже.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/game/${eventId}`);
  };

  // Модальное окно
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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

  // Рендер состояния загрузки
  if (isLoading) {
    return (
      <div className="overlay_game">
        <div className="card_game card_game-edit">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <i className="ti ti-loader" style={{ fontSize: '48px', color: '#44E858', animation: 'spin 1s linear infinite' }}></i>
            <p style={{ marginTop: '20px', color: '#757575' }}>Загрузка настроек игры...</p>
          </div>
        </div>
      </div>
    );
  }

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
                disabled={isSaving}
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
                disabled={isSaving}
                className={errors.drawDate.length > 0 && touched.drawDate ? 'input-error' : ''}
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

            <div className="form-group">
              <label>Пожелания от организатора <br /> (отобразится в письмах участников после жеребьевки)</label>
              <textarea
                name="organizerNotes"
                placeholder="Например: Сбор подарков в офисе на 3 этаже, обмен — в конференц-зале... "
                value={organizerNotes}
                onChange={handleNotesChange}
                onBlur={handleBlur}
                disabled={isSaving}
                className={`input-field input-notes ${errors.organizerNotes.length > 0 && touched.organizerNotes ? 'input-error' : ''}`}
                rows={4}
                maxLength={500}
              />
              {errors.organizerNotes.length > 0 && touched.organizerNotes && (
                <ul className="error-list">
                  {errors.organizerNotes.map((err, i) => (
                    <li key={i} className="error-item">• {err}</li>
                  ))}
                </ul>
              )}
            </div>

            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleAddParticipant}
              disabled={isSaving}
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
                      disabled={isSaving}
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
          <button type="button" className="btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
          <button type="button" className="btn-secondary" onClick={handleCancel} disabled={isSaving}>
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
                disabled={isCopied}
              >
                {isCopied ? (
                  <i 
                    className="ti ti-check" 
                    style={{ 
                      fontSize: '18px', 
                      color: '#1E1E1E',
                      fontWeight: 'bold'
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