import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './main.css';

function Registration() {
  const navigate = useNavigate();

  const handleGoRegistration_end = () => {
    navigate('/registration-end'); 
  };

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [passwordSent, setPasswordSent] = useState(false);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (e.target.name === 'email') setPasswordSent(false);
  };

  // Обработчик входа
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Вход:', loginData);
    handleGoRegistration_end();
  };

  // Авторизация через GitHub
  const handleGithubAuth = () => {
    console.log('Авторизация через GitHub');
    handleGoRegistration_end();
  };

  // ← Отправка пароля на почту
  const handleSendPassword = () => {
    const { email } = loginData;
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Сначала введите корректный адрес почты');
      return;
    }
    
    // Имитация отправки (в реальном приложении — запрос к API)
    console.log(`Отправляем пароль на ${email}`);
    setPasswordSent(true);
    
    setTimeout(() => setPasswordSent(false), 5000);
    alert(`Пароль отправлен на ${email}`);
  };

  return (
    <div className="overlay1">
      <div className="card1">
        <h1>Вход</h1>

        <form onSubmit={handleLoginSubmit} className="auth-form">
          
          {/* Поле почты */}
          <input
            type="email"
            name="email"
            placeholder="Введите почту"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />
          
          {/* Поле пароля с кнопкой отправки */}
          <div className="password-field-group">
            <input
              type="password"
              name="password"
              placeholder="Введите пароль"
              value={loginData.password}
              onChange={handleLoginChange}
              required
              className="password-input"
            />
            <button 
              type="button" 
              className="btn-primary"
              onClick={handleSendPassword}
              title="Отправить пароль на почту"
            >
              Код
            </button>
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