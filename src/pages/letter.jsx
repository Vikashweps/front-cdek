import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { joinGameByLink } from '../api/invitationsApi.jsx';
import { fetchGameById, runDraw } from '../api/eventsApi.jsx';
import { fetchRecipientChat, sendMessage } from '../api/chatApi.jsx';
import './main.css';

void [joinGameByLink, fetchGameById, runDraw, fetchRecipientChat, sendMessage];

function Letter({ organizerMessage }) {  
  const navigate = useNavigate();
  const { eventId } = useParams();

  const handleGoWishlist = () => {
    navigate(`/game/${eventId}/wishlist/santa`);
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
        </div>

        {/* Текст письма */}
        <div className="letter-body">
          <p className="greeting">Дорогой Санта,</p>
          
          <p className="letter-text">
            Меня зовут <span className="highlight">Имя</span>.
            В этом году я стабильно показывал(а) хорошие результаты!
            В качестве подарка я буду рад(а) получить следующее:
          </p>

          <button className="btn-primary" onClick={handleGoWishlist}>
            Мой вишлист
          </button>

          <p className="letter-text">
            Обещаю в новом году быть еще ответственнее, помогать коллегам и верить в чудо,
            даже когда дедлайны горят!
          </p>

          <p className="closing">
            С праздничным настроением, <span className="highlight">Имя</span>
          </p>

          {organizerMessage && (
            <div className="organizer-message">
              <div className="organizer-badge">
                <i className="ti ti-speakerphone" style={{ fontSize: '16px', marginRight: '6px' }}></i>
                От организатора
              </div>
              <p className="organizer-text">{organizerMessage}</p>
            </div>
          )}
        </div>

        {/* Пунктирная рамка */}
        <div className="letter-border"></div>
      </div>
    </div>
  );
}

export default Letter;