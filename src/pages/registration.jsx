import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { joinGameByLink } from '../api/invitationsApi.jsx';
import { fetchGameById, runDraw } from '../api/eventsApi.jsx';
import { fetchRecipientChat, sendMessage } from '../api/chatApi.jsx';
import './main.css';

void [joinGameByLink, fetchGameById, runDraw, fetchRecipientChat, sendMessage];

// Функция валидации имени
const validateName = (name) => {
  const errors = [];
  const trimmed = name.trim();
  
  // Проверка: не пустое
  if (!trimmed) {
    errors.push('ФИО обязательно для заполнения');
    return errors;
  }
  
  // Проверка: только буквы, пробелы и дефисы (кириллица + латиница)
  const validPattern = /^[а-яА-ЯёЁa-zA-Z\s\-]+$/;
  if (!validPattern.test(trimmed)) {
    errors.push('ФИО должно содержать только буквы, пробелы и дефисы');
  }
  
  // Проверка: минимум 2 слова (имя и фамилия)
  const words = trimmed.split(/\s+/).filter(word => word.length > 0);
  if (words.length < 2) {
    errors.push('Введите имя и фамилию');
  }
  
  // Проверка: длина каждого слова минимум 2 символа
  if (words.some(word => word.length < 2)) {
    errors.push('Каждая часть ФИО должна содержать минимум 2 символа');
  }
  
  // Проверка: общая длина
  if (trimmed.length > 100) {
    errors.push('ФИО не должно превышать 100 символов');
  }
  
  // Проверка: нет цифр
  if (/\d/.test(trimmed)) {
    errors.push('ФИО не должно содержать цифры');
  }
  
  return errors;
};

function Registration() {
  const navigate = useNavigate();

  const handleGoRegistration_end = () => {
    navigate('/registration-end'); 
  };

  const [loginData, setLoginData] = useState({ name: '', email: '', password: '' });
  const [passwordSent, setPasswordSent] = useState(false);
  
  // Состояния для ошибок и "затронутых" полей
  const [errors, setErrors] = useState({ name: [], email: [], password: [] });
  const [touched, setTouched] = useState({ name: false, email: false, password: false });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    
    if (name === 'email') setPasswordSent(false);
    
    // Валидация при изменении, если поле уже было затронуто
    if (touched[name] && name === 'name') {
      setErrors(prev => ({ ...prev, name: validateName(value) }));
    }
  };

  // Обработчик потери фокуса
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (name === 'name') {
      setErrors(prev => ({ ...prev, name: validateName(value) }));
    }
  };

  // Проверка всей формы перед отправкой
  const isFormValid = () => {
    const nameErrors = validateName(loginData.name);
    setErrors(prev => ({ ...prev, name: nameErrors }));
    return nameErrors.length === 0;
  };

  // Обработчик входа
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // ← НОВОЕ: Валидируем перед отправкой
    if (!isFormValid()) {
      setTouched({ name: true, email: true, password: true });
      return;
    }
    
    console.log('Вход:', loginData);
    handleGoRegistration_end();
  };

  // Авторизация через GitHub
  const handleGithubAuth = () => {
    console.log('Авторизация через GitHub');
    handleGoRegistration_end();
  };

  // Отправка пароля на почту
  const handleSendPassword = () => {
    const { email } = loginData;
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Сначала введите корректный адрес почты');
      return;
    }
    
    console.log(`Отправляем пароль на ${email}`);
    setPasswordSent(true);
    
    setTimeout(() => setPasswordSent(false), 5000);
    alert(`Пароль отправлен на ${email}`);
  };

  return (
    <div className="overlay1">
      <div className="card1">
        <h1>Вход</h1>

        <form onSubmit={handleLoginSubmit} className="auth-form" noValidate>
          
          {/* Поле ФИО */}
          <div className="form-group">
            <input
              type="text" 
              name="name"
              placeholder="Введите ФИО"
              value={loginData.name}
              onChange={handleLoginChange}
              onBlur={handleBlur}
              required
              className={errors.name.length > 0 && touched.name ? 'input-error' : ''}
            />
            {errors.name.length > 0 && touched.name && (
              <ul className="error-list">
                {errors.name.map((err, i) => (
                  <li key={i} className="error-item">• {err}</li>
                ))}
              </ul>
            )}
          </div>
          
          <input
            type="email"
            name="email"
            placeholder="Введите почту"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />
          
          <div className="password-field-group">
            <div className="password-input-wrapper">
              <input
                type="password"
                name="password"
                placeholder="Введите код"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                className="password-input"
              />
              <button 
                type="button" 
                className="btn-send-code-inline"
                onClick={handleSendPassword}
              >
                Отправить код на почту
              </button>
            </div>
          </div>
          
          {passwordSent && (
            <span className="password-sent-hint">✓ Пароль отправлен!</span>
          )}

          {/* Кнопки */}
          <button className="btn-primary" type="submit">
            Войти
          </button>

          <button type="button" className="btn-secondary" onClick={handleGithubAuth}>
            Через GitHub
          </button>
        </form>

        <p className="agreement1">
          Продолжая, вы соглашаетесь с <a href="#">Пользовательским соглашением</a>
        </p>
      </div>
    </div>
  );
}

export default Registration;