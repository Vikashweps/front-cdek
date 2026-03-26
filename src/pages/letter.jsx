import React from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

function Letter() {
  const navigate = useNavigate();

  const handleGoWishlist = () => {
    navigate('/wishlist-santa');
  };

  return (
    <div className="letter-page">

      <div className="letter-card">
        <button className="letter-close" onClick={() => navigate(-1)}>×</button>
        
        {/* Шапка письма */}
        <div className="letter-header">
          <div className="letter-from">
            <span className="label">От:</span>
            <span className="name">Имя</span>
          </div>
          <div className="letter-to">
            <span className="label">Кому:</span>
            <span className="name">Санте</span>
          </div>
          <div className="letter-date">14 декабря 2026</div>
        </div>

        {/* Текст письма */}
        <div className="letter-body">
          <p className="greeting">Дорогой Санта,</p>
          
          <p className="letter-text">
            Меня зовут <span className="highlight">Имя</span>. В этом году я стабильно показывал(а) хорошие результаты!
            В качестве подарка я буду рад(а) получить следующее:
          </p>

          <button className="btn-primary" onClick={handleGoWishlist}>
            МОЙ ВИШЛИСТ
          </button>

          <p className="letter-text">
            Обещаю в новом году быть еще ответственнее, помогать коллегам и верить в чудо,
            даже когда дедлайны горят!
          </p>

          <p className="closing">
            С праздничным настроением, <span className="highlight">Имя</span>
          </p>
        </div>

        {/* Пунктирная рамка */}
        <div className="letter-border"></div>
      </div>
    </div>
  );
}

export default Letter;