import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './main.css';

function Registration() {
  const navigate = useNavigate();

  const handleGoRegistration_end = () => {
    navigate('/registration-end'); 
  };

  const [activeTab, setActiveTab] = useState('register'); // 'register' или 'login'
  
  // ← НОВОЕ: Состояния для полей форм
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log('Регистрация:', registerData);
    handleGoRegistration_end();
  };

  // ← НОВОЕ: Обработчики для формы входа
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Вход:', loginData);
    handleGoRegistration_end();
  };

  // ← НОВОЕ: Обработчик для GitHub (общий)
  const handleGithubAuth = () => {
    console.log('Авторизация через GitHub');
    handleGoRegistration_end();
  };

  return (
    <div className="overlay1">
      <div className="card1">
        <h1>ТАЙНЫЙ САНТА</h1>

         {/* ← НОВОЕ: Вкладки */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Регистрация
          </button>
          <button
            type="button"
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Вход
          </button>
        </div>

        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <input
              type="text"
              name="name"
              placeholder="Введите имя"
              value={registerData.name}
              onChange={handleRegisterChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Введите почту"
              value={registerData.email}
              onChange={handleRegisterChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Придумайте пароль"
              value={registerData.password}
              onChange={handleRegisterChange}
              required
            />

            <button className="btn-primary" type="submit">
              Создать аккаунт
            </button>

            <button type="button" className="btn-secondary" onClick={handleGithubAuth}>
              Через GitHub
            </button>
          </form>
        )}

        {/* ← НОВОЕ: Форма входа (показывается если activeTab === 'login') */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <input
              type="email"
              name="email"
              placeholder="Введите почту"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Введите пароль"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />

            <button className="btn-primary" type="submit">
              Войти
            </button>

            <button type="button" className="btn-secondary" onClick={handleGithubAuth}>
              Через GitHub
            </button>
            
            <button type="button" className="btn-link" onClick={() => setActiveTab('register')}>
              Забыли пароль?
            </button>
          </form>
        )}

        <p className="agreement1">
          Продолжая, вы соглашаетесь с <a href="#">Пользовательским соглашением</a>
        </p>
      </div>
    </div>
  );
}

export default Registration;