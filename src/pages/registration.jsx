import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
// Импортируем только нужные функции аутентификации
import { sendOtpCode, verifyOtpCode } from '../api/authApi'; 
import './main.css';

// Функция валидации имени (осталась без изменений)
const validateName = (name) => {
  const errors = [];
  const trimmed = name.trim();
  
  if (!trimmed) {
    errors.push('ФИО обязательно для заполнения');
    return errors;
  }
  
  const validPattern = /^[а-яА-ЯёЁa-zA-Z\s\-]+$/;
  if (!validPattern.test(trimmed)) {
    errors.push('ФИО должно содержать только буквы, пробелы и дефисы');
  }
  
  const words = trimmed.split(/\s+/).filter(word => word.length > 0);
  if (words.length < 2) {
    errors.push('Введите имя и фамилию');
  }
  
  if (words.some(word => word.length < 2)) {
    errors.push('Каждая часть ФИО должна содержать минимум 2 символа');
  }
  
  if (trimmed.length > 100) {
    errors.push('ФИО не должно превышать 100 символов');
  }
  
  if (/\d/.test(trimmed)) {
    errors.push('ФИО не должно содержать цифры');
  }
  
  return errors;
};

function Registration() {
  const navigate = useNavigate();

  // Состояния полей
  const [loginData, setLoginData] = useState({ name: '', email: '', code: '' });
  
  // Состояния интерфейса
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  // Состояния ошибок валидации
  const [errors, setErrors] = useState({ name: [], email: [], code: [] });
  const [touched, setTouched] = useState({ name: false, email: false, code: false });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    
    // Сброс состояния отправки кода, если изменили почту
    if (name === 'email') {
      setIsCodeSent(false);
      setServerError('');
    }
    
    // Валидация при вводе
    if (touched[name] && name === 'name') {
      setErrors(prev => ({ ...prev, name: validateName(value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (name === 'name') {
      setErrors(prev => ({ ...prev, name: validateName(value) }));
    }
  };

  // Проверка валидности формы перед отправкой кода или входом
  const isFormValid = () => {
    const nameErrors = validateName(loginData.name);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;
    
    let newErrors = { ...errors, name: nameErrors };

    if (!emailRegex.test(loginData.email)) {
      newErrors.email = ['Некорректный формат email'];
      isValid = false;
    } else {
      newErrors.email = [];
    }

    if (nameErrors.length > 0) isValid = false;

    setErrors(newErrors);
    return isValid;
  };

  // 1. Отправка кода на почту
  const handleSendCode = async () => {
    // Сначала проверим базовую валидацию почты
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!loginData.email || !emailRegex.test(loginData.email)) {
      setErrors(prev => ({ ...prev, email: ['Введите корректный email'] }));
      setTouched(prev => ({ ...prev, email: true }));
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      await sendOtpCode(loginData.email);
      setIsCodeSent(true);
      alert(`Код подтверждения отправлен на ${loginData.email}`);
    } catch (err) {
      setServerError(err.message || 'Не удалось отправить код. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Вход / Регистрация (Подтверждение кода)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Проверяем все поля
    if (!isFormValid()) {
      setTouched({ name: true, email: true, code: true });
      return;
    }

    if (!isCodeSent) {
      setServerError('Сначала получите код подтверждения на почту');
      return;
    }

    if (!loginData.code.trim()) {
      setErrors(prev => ({ ...prev, code: ['Введите код из письма'] }));
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      // Вызываем API верификации. 
      // Бэкенд сам определит: если юзер с таким email есть — войдет, если нет — создаст.
      // Мы также передаем name, чтобы при создании нового юзера записать его имя.
      const result = await verifyOtpCode(loginData.email, loginData.code, loginData.name);
      
      console.log('Успешная авторизация:', result);
      
      // Переход в профиль или на главную
      navigate('/profile'); 
      
    } catch (err) {
      console.error(err);
      setServerError(err.message || 'Неверный код или ошибка сервера.');
    } finally {
      setIsLoading(false);
    }
  };

  // Заглушка для GitHub (пока не реализована на бэке)
  const handleGithubAuth = () => {
    alert('Вход через GitHub временно недоступен');
  };

  return (
    <div className="overlay1">
      <div className="card1">
        <h1>Вход / Регистрация</h1>

        {/* Ошибка от сервера */}
        {serverError && (
          <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
            {serverError}
          </div>
        )}

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
              disabled={isLoading}
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
          
          {/* Поле Email */}
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Введите почту"
              value={loginData.email}
              onChange={handleLoginChange}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              required
              disabled={isLoading}
              className={errors.email.length > 0 && touched.email ? 'input-error' : ''}
            />
            {errors.email.length > 0 && touched.email && (
               <ul className="error-list">{errors.email.map((e,i)=><li key={i} className="error-item">• {e}</li>)}</ul>
            )}
          </div>
          
          {/* Поле Кода */}
          <div className="password-field-group">
            <div className="password-input-wrapper">
              <input
                type="text" // Тип text, так как это код, а не пароль
                name="code"
                placeholder="Введите код из письма"
                value={loginData.code}
                onChange={handleLoginChange}
                onBlur={() => setTouched(prev => ({ ...prev, code: true }))}
                required
                disabled={isLoading || !isCodeSent}
                className={`password-input ${errors.code.length > 0 && touched.code ? 'input-error' : ''}`}
              />
              <button 
                type="button" 
                className="btn-send-code-inline"
                onClick={handleSendCode}
                disabled={isLoading}
              >
                {isLoading ? 'Отправка...' : 'Отправить код'}
              </button>
            </div>
          </div>
          
          {isCodeSent && !serverError && (
            <span className="password-sent-hint">✓ Код отправлен! Проверьте почту.</span>
          )}

          {/* Кнопки действий */}
          <button className="btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Проверка...' : 'Войти'}
          </button>

          <button type="button" className="btn-secondary" onClick={handleGithubAuth} disabled={isLoading}>
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