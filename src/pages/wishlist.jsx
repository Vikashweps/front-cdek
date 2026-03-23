import React from 'react';
import { useNavigate } from 'react-router-dom';
import './wishlist.css';

function Wishlist() {
  const navigate = useNavigate();

  const handleGoProfile = () => {
    navigate('/profile'); // ← Переход на главную
  };

  // Обработчик выбора файла
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Создаем временную ссылку на файл в браузере
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="overlay_wishlist">
      <div className="card_wishlist">

        {/* Контейнер для двух колонок */}
        <div className="wishlist-content">
          
          <div className="column staff-data">
            <h1 >Название</h1>
            <form>
              <div className="input-data">
                <span className="value">000 Р</span>
                </div>

                <div className="input-data">
                <span className="value">Ссылка на товар</span>
                </div>

             <button type="button" className="prim">
                Редактировать
              </button>

              <button type="button" className="sec" onClick={handleGoProfile}>
                Назад
              </button>
            </form>
          </div>

          <div className="column picture">
                {/* --- БЛОК ЗАГРУЗКИ АВАТАРА --- */}
                <div className="avatar-upload">
                <label className="avatar-btn">
                    Загрузить фото
                    <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    />
                </label>
                </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Wishlist;