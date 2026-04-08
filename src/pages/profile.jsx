import React from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

function Profile() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // ← Переход на главную
  };
  const handleGoWishlist = () => {
    navigate('/wishlist'); 
  };

  const handleGoProfileRed = () => {
    navigate('/profile-red'); 
  };

  const handleGoGameAdd = () => {
    navigate('/game-add'); 
  };

  const handleGoGame = () => {
    navigate('/game'); 
  };

  const handleLogout = () => {
    if (window.confirm('Вы действительно хотите выйти из профиля?')) {
      // Здесь можно очистить токены/данные пользователя
      localStorage.removeItem('token'); 
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="overlay_profile">
      <div className="card_profile">

        <button 
          type="button" 
          className="btn-logout" 
          onClick={handleLogout}
          title="Выйти из профиля"
        >
          <i className="ti ti-logout" style={{ fontSize: '20px' }}></i>
        </button>
        
        <h1>МОЙ ПРОФИЛЬ</h1>

        <div className="profile-content">
          <div className="column personal-data">
            <h3 >ЛИЧНЫЕ ДАННЫЕ</h3>
            <form>
              <div className="input-readonly">
                <span className="value">Иван Иванов</span>
                </div>

                <div className="input-readonly">
                <span className="value">ivan@example.com</span>
                </div>

                <button type="button" className="btn-secondary" onClick={handleGoProfileRed}>
              
                Изменить данные
              </button>

             <button type="button" className="btn-primary" onClick={handleGoWishlist}>
                Мой вишлист
              </button>

              <button type="button" className="btn-secondary" onClick={handleGoHome}>
                На главную
              </button>
            </form>
          </div>

          <div className="column games-list">
            <h3>МОИ ИГРЫ</h3>
            <div className="games-scroll-container">
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 1 </button>
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 2</button>
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 3</button>
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 4</button>
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 5</button>
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 6</button>
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 7</button>
              <button type="button" className="game-item" onClick={handleGoGame}>Команда 8</button> 
            </div>
            <button type="button" className="btn-secondary" onClick={handleGoGameAdd}>
                Создать новую игру
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Profile;