import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinGameByLink } from '../api/invitationsApi.jsx';
import { fetchGameById, runDraw } from '../api/eventsApi.jsx';
import { fetchRecipientChat, sendMessage } from '../api/chatApi.jsx';
import './main.css';

void [joinGameByLink, fetchGameById, runDraw, fetchRecipientChat, sendMessage]; 

// Валидация имени
const validateName = (name) => {
  const errors = [];
  
  // Убираем пробелы по краям для проверки
  const trimmed = name.trim();
  
  // Проверка: не пустое и не только пробелы
  if (!trimmed) {
    errors.push('Имя не может быть пустым');
    return errors;
  }
  
  // Проверка: только разрешённые символы (кириллица, латиница, дефис, пробел)
  const validPattern = /^[а-яА-ЯёЁa-zA-Z\s-]+$/;
  if (!validPattern.test(trimmed)) {
    errors.push('Имя может содержать только буквы, пробелы и дефисы');
  }
  
  // Проверка: длина
  if (trimmed.length < 2) {
    errors.push('Минимальная длина имени - 2 символа');
  }
  if (trimmed.length > 50) {
    errors.push('Максимальная длина имени - 50 символов');
  }
  
  // Проверка: не должно начинаться или заканчиваться пробелом/дефисом
  if (trimmed.startsWith(' ') || trimmed.endsWith(' ') || 
      trimmed.startsWith('-') || trimmed.endsWith('-')) {
    errors.push('Имя не должно начинаться или заканчиваться пробелом или дефисом');
  }
  
  // Проверка: нет нескольких пробелов подряд
  if (/\s{2,}/.test(trimmed)) {
    errors.push('Не должно быть нескольких пробелов подряд');
  }
  
  // Проверка: нет нескольких дефисов подряд
  if (/--+/.test(trimmed)) {
    errors.push('Не должно быть нескольких дефисов подряд');
  }
  
  return errors;
};

// Валидация почты
const validateEmail = (email) => {
  const errors = [];
  
  if (!email) {
    errors.push('Почта обязательна для заполнения');
    return errors;
  }
  
  // Базовая проверка формата: local-part@domain.tld
  // local-part: буквы, цифры, . _ % + -
  // domain: буквы, цифры, дефисы, хотя бы одна точка
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailPattern.test(email)) {
    errors.push('Введите корректный адрес почты (пример: name@example.com)');
  }
  
  return errors;
};

function Profile_red() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: 'Иван Иванов',
        mail: 'ivan@example.com'
    });

    //  Состояние для ошибок
    const [errors, setErrors] = useState({
        name: [],
        mail: []
    });

    // Состояние для "грязных" полей (было ли поле затронуто пользователем)
    const [touched, setTouched] = useState({
        name: false,
        mail: false
    });

    // Обработчик изменения полей
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Если поле уже было "затронуто", валидируем сразу
        if (touched[name]) {
        const validator = name === 'name' ? validateName : validateEmail;
        setErrors({ ...errors, [name]: validator(value) });
        }
    };

    // Обработчик потери фокуса (валидация при уходе с поля)
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        
        const validator = name === 'name' ? validateName : validateEmail;
        setErrors({ ...errors, [name]: validator(value) });
    };

    // Проверка всей формы перед отправкой
    const isFormValid = () => {
        const nameErrors = validateName(formData.name);
        const mailErrors = validateEmail(formData.mail);
        setErrors({ name: nameErrors, mail: mailErrors });
        return nameErrors.length === 0 && mailErrors.length === 0;
    };

    // Переход назад
    const handleGoProfile = () => {
        navigate('/profile'); 
    };

      // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // ← НОВОЕ: Валидируем перед отправкой
        if (!isFormValid()) {
        // Помечаем все поля как "затронутые", чтобы показать ошибки
        setTouched({ name: true, mail: true });
        return;
        }
        
        console.log('Сохраняем данные:', formData);
        handleGoProfile();
    };
    
    const handleGoBack = () => {
    navigate(-1);  // -1 = перейти на одну страницу назад в истории
    };

    return (
    <div className="overlay_profile_red"> 
      <div className="card_profile_red"> 
        <h1>Редактирование профиля</h1>

        <form onSubmit={handleSubmit} noValidate> 
          <div className="form-group">
            <label htmlFor="name">Имя *</label>
            <input 
              id="name"
              type="text" 
              name="name"
              placeholder="Введите имя" 
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required 
              className={errors.name.length > 0 && touched.name ? 'input-error' : ''}
              pattern="^[а-яА-ЯёЁa-zA-Z\s-]+$"
              minLength={2}
              maxLength={50}
            />
            {errors.name.length > 0 && touched.name && (
              <ul className="error-list">
                {errors.name.map((err, i) => (
                  <li key={i} className="error-item">• {err}</li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="mail">Почта *</label>
            <input 
              id="mail"
              type="email" 
              name="mail"
              placeholder="Введите почту" 
              value={formData.mail}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={errors.mail.length > 0 && touched.mail ? 'input-error' : ''}
            />
            {errors.mail.length > 0 && touched.mail && (
              <ul className="error-list">
                {errors.mail.map((err, i) => (
                  <li key={i} className="error-item">• {err}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="button-group">
            <button type="submit" className="btn-primary">
              Сохранить
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

export default Profile_red;