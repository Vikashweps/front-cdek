import React from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

function Registration() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // ← Переход на главную
  };
  const handleGoRegistration_end = () => {
    navigate('/registration-end'); 
  };

  return (
    <div className="overlay1">
      <div className="card1">
        <h1>ТАЙНЫЙ САНТА</h1>

        <form>
          <input type="text" placeholder="Введите имя" />
          <input type="email" placeholder="Введите почту" />

          <button className="btn-primary" type="submit1" onClick={handleGoRegistration_end}>
            Создать аккаунт
          </button>

          <button type="button" className="btn-secondary" onClick={handleGoRegistration_end}>
            Авторизоваться через Github
          </button>
          <button type="button" className="btn-secondary" onClick={handleGoHome}>
                На главную
          </button>
        </form>

        <p className="agreement1">
          Продолжая, вы соглашаетесь с Пользовательским соглашением
        </p>
      </div>
    </div>
  );
}

export default Registration;