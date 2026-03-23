import React from 'react';
import './registration.css';

function Registration() {
  return (
    <div className="overlay1">
      <div className="card1">
        <h1>ТАЙНЫЙ САНТА</h1>

        <form>
          <input type="text" placeholder="Введите имя" />
          <input type="email" placeholder="Введите почту" />

          <button className="primary1" type="submit1">
            Создать аккаунт
          </button>

          <button type="button" className="secondary1">
            Авторизоваться через Github
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