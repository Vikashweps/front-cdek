import React from 'react';
import './profile.css';

function Profile() {
  return (
    <div className="overlay2">
      <div className="card2">
        <h1>МОЙ ПРОФИЛЬ</h1>

        {/* Контейнер для двух колонок */}
        <div className="profile-content">
          
          <div className="column personal-data">
            <h3>ЛИЧНЫЕ ДАННЫЕ</h3>
            <form>
              <div className="input-readonly">
                <span className="value">Иван Иванов</span>
                </div>

                <div className="input-readonly">
                <span className="value">ivan@example.com</span>
                </div>

                <button type="button" className="sec">
              
                ИЗМЕНИТЬ ДАННЫЕ
              </button>

             <button type="button" className="prim">
                ВИШЛИСТ
              </button>

              <button type="button" className="sec">
                НА ГЛАВНУЮ
              </button>
            </form>
          </div>

          <div className="column games-list">
            <h3>МОИ ИГРЫ</h3>
            
            {/* Контейнер со скроллом для кнопок команд */}
            <div className="games-scroll-container">
              <button type="button" className="game-item">
                Команда 1
              </button>

              <button type="button" className="game-item">
                Команда 2
              </button>
              
              <button type="button" className="game-item">Команда 3</button>
              <button type="button" className="game-item">Команда 4</button>
              <button type="button" className="game-item">Команда 5</button>
              <button type="button" className="game-item">Команда 6</button>
              <button type="button" className="game-item">Команда 7</button>
              <button type="button" className="game-item">Команда 8</button> 
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


export default Profile;