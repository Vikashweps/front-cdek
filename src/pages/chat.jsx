import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

function SecretChat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Placeholder', sender: 'them', time: '10:30' },
    { id: 2, text: 'Placeholder', sender: 'me', time: '10:32' },
    { id: 3, text: 'Placeholder', sender: 'them', time: '10:35' },
    { id: 4, text: 'Placeholder', sender: 'me', time: '10:36' },
    { id: 5, text: 'Placeholder', sender: 'them', time: '10:40' },
    { id: 6, text: 'Placeholder', sender: 'me', time: '10:42' },
  ]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="chat-page">

      {/* Основной контейнер чата */}
      <div className="chat-container">
        {/* Кнопка Назад */}
        <button className="btn-secondary" onClick={handleGoBack}>
          Назад
        </button>

        {/* Заголовок */}
        <div className="chat-header">
          <h1 className="chat-title">Секретный чат с Имя</h1>
          <h2 className="chat-team">Команда "КОМАНДА1"</h2>
        </div>

        {/* Область сообщений */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message ${msg.sender === 'me' ? 'message-me' : 'message-them'}`}
            >
              {msg.sender === 'them' && (
                <div className="message-avatar">👤</div>
              )}
              
              <div className="message-bubble">
                <p className="message-text">{msg.text}</p>
                <span className="message-time">{msg.time}</span>
              </div>

              {msg.sender === 'me' && (
                <div className="message-avatar me">👤</div>
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
            placeholder="Введите текст"
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