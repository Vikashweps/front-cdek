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

// Валидация даты жеребьёвки
const validateDrawDate = (dateString, minDate, maxDate) => {
  const errors = [];
  
  if (!dateString) {
    errors.push('Дата жеребьёвки обязательна');
    return errors;
  }
  
  const date = new Date(dateString);
  const min = new Date(minDate);
  const max = new Date(maxDate);
  
  date.setHours(0, 0, 0, 0);
  min.setHours(0, 0, 0, 0);
  max.setHours(23, 59, 59, 999);
  
  if (isNaN(date.getTime())) {
    errors.push('Введите корректную дату');
    return errors;
  }
  
  if (date < min || date > max) {
    errors.push(`Дата должна быть между ${minDate} и ${maxDate}`);
  }
  
  return errors;
};

// Валидация пожеланий (опциональное поле)
const validateOrganizerNotes = (notes) => {
  const errors = [];
  
  // Проверка: не больше 500 символов
  if (notes && notes.length > 500) {
    errors.push('Максимальная длина — 500 символов');
  }
  
  return errors;
};

function Game_add() {
  const navigate = useNavigate();
  
  const [teamName, setTeamName] = useState('');
  const [drawDate, setDrawDate] = useState('');
  const [wantParticipate, setWantParticipate] = useState(false);
  
  //  Состояние для пожеланий организатора
  const [organizerNotes, setOrganizerNotes] = useState('');
  
  const [errors, setErrors] = useState({ teamName: [], drawDate: [], organizerNotes: [] });
  const [touched, setTouched] = useState({ teamName: false, drawDate: false, organizerNotes: false });

  const MIN_DATE = '2026-12-01';
  const MAX_DATE = '2027-01-31';

  const handleTeamNameChange = (e) => {
    const value = e.target.value;
    setTeamName(value);
    if (touched.teamName) {
      setErrors(prev => ({ ...prev, teamName: validateTeamName(value) }));
    }
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDrawDate(value);
    if (touched.drawDate) {
      setErrors(prev => ({ ...prev, drawDate: validateDrawDate(value, MIN_DATE, MAX_DATE) }));
    }
  };

  //Обработчик для пожеланий
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
    const nameErrors = validateTeamName(teamName);
    const dateErrors = validateDrawDate(drawDate, MIN_DATE, MAX_DATE);
    const notesErrors = validateOrganizerNotes(organizerNotes);
    setErrors({ teamName: nameErrors, drawDate: dateErrors, organizerNotes: notesErrors });
    return nameErrors.length === 0 && dateErrors.length === 0 && notesErrors.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setTouched({ teamName: true, drawDate: true, organizerNotes: true });
      return;
    }
    
    console.log({ 
      teamName, 
      drawDate, 
      wantParticipate,
      organizerNotes  
    });
    
    // Отправка на сервер...
    navigate('/game-add-link');
  };

  const handleGoGameAddLink = () => {
    navigate('/game-add-link'); 
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const canSubmit = teamName.trim() && drawDate && 
                    errors.teamName.length === 0 && 
                    errors.drawDate.length === 0;

  return (
    <div className="overlay_game_add"> 
      <div className="card_game_add"> 
        <h1>Создание игры</h1>

        <form onSubmit={handleSubmit} className="game-add-form" noValidate>                     
          {/* Поле названия команды */}
          <div className="form-group">
            <label>Название команды <span className="required">*</span></label>
            <input 
              type="text"
              name="teamName"
              placeholder="Введите название команды"
              value={teamName}
              onChange={handleTeamNameChange}
              onBlur={handleBlur}
              className={`input-field ${errors.teamName.length > 0 && touched.teamName ? 'input-error' : ''}`}
              required
            />
            {errors.teamName.length > 0 && touched.teamName && (
              <ul className="error-list">
                {errors.teamName.map((err, i) => (
                  <li key={i} className="error-item">• {err}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Поле выбора даты */}
          <div className="form-group date-group">
            <label>Дата жеребьёвки <span className="required">*</span></label>
            <input
              type="date"
              name="drawDate"
              value={drawDate}
              onChange={handleDateChange}
              onBlur={handleBlur}
              min={MIN_DATE}
              max={MAX_DATE}
              className={`input-field date-input ${errors.drawDate.length > 0 && touched.drawDate ? 'input-error' : ''}`}
              required
            />
            {!drawDate && !touched.drawDate && (
              <span className="date-placeholder"></span>
            )}
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
              placeholder="Например: Сбор подарков в офисе на 3 этаже 28.12, обмен — в конференц-зале..."
              value={organizerNotes}
              onChange={handleNotesChange}
              onBlur={handleBlur}
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

          {/* Чекбокс */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={wantParticipate}
                onChange={(e) => setWantParticipate(e.target.checked)}
                className="checkbox"
              />
              <span className="checkbox-text">Хочу участвовать в жеребьевке</span>
            </label>
          </div>

          <div className="game-add-buttons">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={!canSubmit}
              title={!canSubmit ? 'Заполните все обязательные поля' : ''}
              onClick={handleGoGameAddLink}
            >
              Создать
            </button>
            <button type="button" className="btn-secondary" onClick={handleGoBack}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Game_add;