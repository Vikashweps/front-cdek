import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

function SecretChat() {
  const navigate = useNavigate();
  
  // Состояние для активной вкладки
  const [activeTab, setActiveTab] = useState('recipient'); // 'recipient' или 'sender'
  
  const [message, setMessage] = useState('');
  
  // Сообщения для двух чатов
  const [messages, setMessages] = useState({
    recipient: [  // Чат с тем, кому вы дарите
      { id: 1, text: 'Привет! Это твой тайный Санта ', sender: 'them', time: '10:30' },
      { id: 2, text: 'О, привет!', sender: 'me', time: '10:32' },
      { id: 3, text: 'Уже выбрал(а) подарок?', sender: 'them', time: '10:35' },
    ],
    sender: [  // Чат с тем, кто дарит вам
      { id: 1, text: 'Привет! Я твой тайный Санта ', sender: 'them', time: '11:00' },
      { id: 2, text: 'Ура! А я уже добавил(а) всё в вишлист', sender: 'me', time: '11:02' },
    ]
  });
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Прокрутка при смене вкладки или новом сообщении
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTab]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };
      
      // Добавляем сообщение в активный чат
      setMessages(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newMessage]
      }));
      setMessage('');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Данные для отображения в заголовке
  const chatData = {
    recipient: {
      title: 'Секретный чат с Имя',
      partner: 'Имя'
    },
    sender: {
      title: 'Секретный чат с Сантой',
      partner: 'Тайный отправитель'
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
      <button className="btn-secondary" onClick={handleGoBack}>
          Назад
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
          <h1 className="chat-title">{chatData[activeTab].title}</h1>
          <h2 className="chat-team">Команда "КОМАНДА1"</h2>
          <p className="chat-partner">Собеседник: {chatData[activeTab].partner}</p>
        </div>

        {/* Область сообщений */}
        <div className="chat-messages">
          {messages[activeTab].map((msg) => (
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
                <div className="message-avatar me"></div>
              )}
            </div>
          ))}
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