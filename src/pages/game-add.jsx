import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css'; 

// Валидация названия команды
const validateTeamName = (name) => {
  const errors = [];
  const trimmed = name.trim();
  
  // Проверка: не пустое
  if (!trimmed) {
    errors.push('Название команды обязательно');
    return errors;
  }
  
  // Проверка: только разрешённые символы
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
const validateDrawDate = (dateString, minDate, maxDate) => {
  const errors = [];
  
  if (!dateString) {
    errors.push('Дата жеребьёвки обязательна');
    return errors;
  }
  
  const date = new Date(dateString);
  const min = new Date(minDate);
  const max = new Date(maxDate);
  
  // Сбрасываем время для корректного сравнения
  date.setHours(0, 0, 0, 0);
  min.setHours(0, 0, 0, 0);
  max.setHours(23, 59, 59, 999);
  
  // Проверка: валидная дата
  if (isNaN(date.getTime())) {
    errors.push('Введите корректную дату');
    return errors;
  }
  
  // Проверка: в разрешённом диапазоне
  if (date < min || date > max) {
    errors.push(`Дата должна быть между ${minDate} и ${maxDate}`);
  }
  
  return errors;
};

function Game_add() {
  const navigate = useNavigate();
  
  const [teamName, setTeamName] = useState('');
  const [drawDate, setDrawDate] = useState('');
  const [wantParticipate, setWantParticipate] = useState(false);
  
  // Состояния для ошибок и "затронутых" полей
  const [errors, setErrors] = useState({ teamName: [], drawDate: [] });
  const [touched, setTouched] = useState({ teamName: false, drawDate: false });

  // Ограничение даты: декабрь 2026 - январь 2027
  const MIN_DATE = '01.12.2026';
  const MAX_DATE = '31.01.2027';

  // Обработчик изменения названия с валидацией
  const handleTeamNameChange = (e) => {
    const value = e.target.value;
    setTeamName(value);
    if (touched.teamName) {
      setErrors(prev => ({ ...prev, teamName: validateTeamName(value) }));
    }
  };

  // Обработчик изменения даты с валидацией
  const handleDateChange = (e) => {
    const value = e.target.value;
    setDrawDate(value);
    if (touched.drawDate) {
      setErrors(prev => ({ ...prev, drawDate: validateDrawDate(value, MIN_DATE, MAX_DATE) }));
    }
  };

  // Обработчик потери фокуса (валидация при уходе с поля)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (name === 'teamName') {
      setErrors(prev => ({ ...prev, teamName: validateTeamName(value) }));
    } else if (name === 'drawDate') {
      setErrors(prev => ({ ...prev, drawDate: validateDrawDate(value, MIN_DATE, MAX_DATE) }));
    }
  };

  // Проверка всей формы перед отправкой
  const isFormValid = () => {
    const nameErrors = validateTeamName(teamName);
    const dateErrors = validateDrawDate(drawDate, MIN_DATE, MAX_DATE);
    setErrors({ teamName: nameErrors, drawDate: dateErrors });
    return nameErrors.length === 0 && dateErrors.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидируем перед отправкой
    if (!isFormValid()) {
      setTouched({ teamName: true, drawDate: true }); // Показать все ошибки
      return;
    }
    
    console.log({ teamName, drawDate, wantParticipate });
    // Отправка данных на сервер...
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
            {/* ← Сообщения об ошибках */}
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
            {/* ← Сообщения об ошибках */}
            {errors.drawDate.length > 0 && touched.drawDate && (
              <ul className="error-list">
                {errors.drawDate.map((err, i) => (
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