import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Импортируем методы API для чата и назначений
import { fetchRecipientChat, sendMessage } from '/src/api/gameApi.jsx';
import { fetchAssignments } from '/src/api/gameApi.jsx';
import './main.css';

function SecretChat() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  
  // Состояние для активной вкладки
  const [activeTab, setActiveTab] = useState('recipient'); // 'recipient' или 'sender'
  
  const [message, setMessage] = useState('');
  
  // ← НОВОЕ: Состояния для данных с сервера
  const [messages, setMessages] = useState({
    recipient: [],
    sender: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [chatData, setChatData] = useState({
    recipient: { title: 'Загрузка...', partner: '' },
    sender: { title: 'Загрузка...', partner: '' }
  });
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Прокрутка при смене вкладки или новом сообщении
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTab]);

  // ← НОВОЕ: Загрузка данных чата и имен при монтировании
  useEffect(() => {
    const loadData = async () => {
      if (!eventId) return;

      try {
        setIsLoading(true);

        // 1. Получаем назначение, чтобы узнать имена
        const assignment = await fetchAssignments(eventId);
        
        // Адаптируйте под структуру ответа API
        const recipientName = assignment?.recipient?.name || 'Участник';
        const senderName = assignment?.sender?.name || 'Тайный Санта';

        // Обновляем заголовки
        setChatData({
          recipient: {
            title: `Секретный чат с ${recipientName}`,
            partner: recipientName
          },
          sender: {
            title: `Секретный чат с ${senderName}`,
            partner: senderName
          }
        });

        // 2. Загружаем историю сообщений (только для вкладки recipient, так как API только для неё)
        // Для вкладки sender логику нужно добавить, если есть соответствующий эндпоинт
        try {
          const chatHistory = await fetchRecipientChat(eventId);
          
          // Преобразуем ответ API в формат компонента
          // Ожидаем массив: [{ id, text, senderId, createdAt, ... }]
          const formattedMessages = Array.isArray(chatHistory) ? chatHistory.map(msg => ({
            id: msg.id,
            text: msg.text,
            // Определяем, кто отправил: я или собеседник
            sender: msg.isMine || msg.senderId === 'me' ? 'me' : 'them',
            time: new Date(msg.createdAt || msg.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
          })) : [];

          setMessages(prev => ({
            ...prev,
            recipient: formattedMessages
          }));
        } catch (chatErr) {
          console.warn('Не удалось загрузить чат:', chatErr);
        }

      } catch (err) {
        console.error('Ошибка загрузки данных чата:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [eventId]);

  // ← НОВОЕ: Отправка сообщения с сохранением на сервер
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !eventId) return;

    const text = message.trim();
    
    // Оптимистичное обновление UI (сразу показываем сообщение)
    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      text,
      sender: 'me',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newMessage]
    }));
    setMessage('');

    // Отправка на сервер (только для вкладки recipient)
    if (activeTab === 'recipient') {
      try {
        await sendMessage(eventId, text);
        // Здесь можно заменить tempId на реальный ID из ответа сервера, если нужно
      } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
        alert('Не удалось отправить сообщение. Попробуйте позже.');
        // Можно удалить сообщение из списка при ошибке
      }
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Рендер состояния загрузки
  if (isLoading) {
    return (
      <div className="chat-page">
        <div className="chat-container">
          <div style={{ textAlign: 'center', padding: '50px', width: '100%' }}>
            <i className="ti ti-loader" style={{ fontSize: '48px', color: '#44E858', animation: 'spin 1s linear infinite' }}></i>
            <p style={{ marginTop: '20px', color: '#757575' }}>Загрузка чата...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <button className="close" onClick={handleGoBack}>
           <i className="ti ti-x" style={{ fontSize: '24px', color: '#000000' }}></i>
        </button>
        
        <div className="chat-tabs">
          <button
            className={`chat-tab ${activeTab === 'recipient' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipient')}
          >
            <i className="ti ti-gift" style={{ fontSize: '24px', color: '#000000' }}></i> Тому, кому дарю
          </button>
          <button
            className={`chat-tab ${activeTab === 'sender' ? 'active' : ''}`}
            onClick={() => setActiveTab('sender')}
          >
            <i className="ti ti-christmas-tree" style={{ fontSize: '24px', color: '#000000' }}></i> Кто дарит мне
          </button>
        </div>

        <div className="chat-header">
          {/* ← Динамический заголовок */}
          <h1 className="chat-title">{chatData[activeTab].title}</h1>
          <h2 className="chat-team">Команда</h2>
          <p className="chat-partner">Собеседник: {chatData[activeTab].partner}</p>
        </div>

        {/* Область сообщений */}
        <div className="chat-messages">
          {messages[activeTab].length === 0 ? (
            <div style={{ textAlign: 'center', color: '#757575', marginTop: '40px' }}>
              Пока нет сообщений. Напишите первым!
            </div>
          ) : (
            messages[activeTab].map((msg) => (
              <div 
                key={msg.id} 
                className={`message ${msg.sender === 'me' ? 'message-me' : 'message-them'}`}
              >
                {msg.sender === 'them' && (
                  <div className="message-avatar">
                    {activeTab === 'recipient' ? (
                      <i className="ti ti-gift" style={{ fontSize: '24px', color: '#44E858' }}></i>
                    ) : (
                      <i className="ti ti-christmas-tree" style={{ fontSize: '24px', color: '#44E858' }}></i>
                    )}
                  </div>
                )}
                
                <div className="message-bubble">
                  <p className="message-text">{msg.text}</p>
                  <span className="message-time">{msg.time}</span>
                </div>

                {msg.sender === 'me' && (
                  <div className="message-avatar me">
                    <i className="ti ti-user"></i>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Форма ввода */}
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder="Введите текст..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="chat-send-btn">
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}

export default SecretChat;