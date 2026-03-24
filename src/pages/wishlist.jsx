import React from 'react';
import { useNavigate } from 'react-router-dom';
import './wishlist.css';

function Wishlist() {
  const navigate = useNavigate();

  const handleGoProfile = () => {
    navigate('/profile'); 
  };

  const handleGoWishlist_add = () => {
    navigate('/wishlist-add'); 
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

             <button type="button" className="sec">
                Редактировать
              </button>

              <button type="button" className="prim" onClick={handleGoWishlist_add}>
                Добавить новый товар
              </button>

              <button type="button" className="sec" onClick={handleGoProfile}>
                Назад
              </button>
            </form>
          </div>

          <div className="column picture">
                <div className="avatar-upload">
                    <div className="avatar-preview">
                        <img src="/Group 47.png"  />
                    </div>
                </div>
          </div>

        </div>
        <button type="button" className="sec">
                1
        </button>
        <button type="button" className="sec">
                N
        </button>
      </div>
    </div>
  );
}

export default Wishlist;