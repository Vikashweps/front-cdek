import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Импортируем нужные методы API
import { fetchAssignments, fetchParticipantWishlist } from '../api/gameApi.js';
import './main.css';

function Letter({ organizerMessage }) {  
  const navigate = useNavigate();
  const { eventId } = useParams();

  // Состояния для данных
  const [recipientName, setRecipientName] = useState('Санте'); // По умолчанию "Санте", если данные не загрузятся
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleGoWishlist = () => {
    // Если есть ID получателя, можно передать его в маршрут
    navigate(`/game/${eventId}/wishlist/santa`);
  };

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadData = async () => {
      if (!eventId) return;

      try {
        setIsLoading(true);
        
        // 1. Получаем назначение (кому мы дарим)
        // Предполагаем, что API возвращает объект { recipient: { id, name, ... } }
        const assignment = await fetchAssignments(eventId);
        
        if (assignment && assignment.recipient) {
          setRecipientName(assignment.recipient.name || 'Санте');
          
          // 2. Получаем вишлист этого участника
          // Используем ID получателя из назначения
          const wishlist = await fetchParticipantWishlist(assignment.recipient.id, eventId);
          
          // Сохраняем список товаров (адаптируйте под структуру ответа: массив или .items)
          const items = Array.isArray(wishlist) ? wishlist : (wishlist.items || []);
          setWishlistItems(items);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных письма:', error);
        // В случае ошибки оставляем значение по умолчанию ("Санте")
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [eventId]);

  // Пока данные грузятся, можно показывать заглушку или ничего не менять
  if (isLoading) {
    return (
      <div className="letter-page">
        <div className="letter-card">
           <button className="letter-close" onClick={() => navigate(-1)}>×</button>
           <p style={{ textAlign: 'center', paddingTop: '50px' }}>Загрузка письма...</p>
        </div>
      </div>
    );
  }

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
            {/* ← ИЗМЕНЕНИЕ: Подставляем реальное имя получателя */}
            <span className="name">{recipientName}</span>
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