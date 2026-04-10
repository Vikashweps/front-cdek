import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css'; 

function Game_add_link() {
    const navigate = useNavigate();
    
    // Состояния модального окна
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    
    // Состояние для email и ошибки
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const inviteLink = `${window.location.origin}/join/TEAM123`;

    // Копировать ссылку
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            alert('Не удалось скопировать');
        }
    };

    // Проверка и отправка email
    const handleSendEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            setEmailError('Введите email');
            return;
        }
        
        if (!emailRegex.test(email)) {
            setEmailError('Некорректный email');
            return;
        }

        setEmailError('');
        console.log(`Отправка на ${email}`);
        alert(`Приглашение отправлено на ${email}`);
        setEmail('');
    };

    // Открыть окно
    const handleAddParticipant = () => {
        setIsModalOpen(true);
        setEmailError('');
        setEmail('');
    };

    // Закрыть окно
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEmailError('');
        setEmail('');
    };

    return (
        <div className="overlay_profile_red"> 
            <div className="card_profile_red"> 
                <h1>Создание игры</h1>
                
                {/* Обновленный параграф с стилями */}
                <p style={{ 
                    textAlign: 'center', 
                    color: '#757575', 
                    fontSize: '14px', 
                    lineHeight: '1.5',
                    marginBottom: '20px',
                    maxWidth: '350px',
                    margin: '0 auto 20px auto'
                }}>
                    Игра успешно создана! Пригласите участников по ссылке или отправьте приглашение на email.
                </p>

                {/* Кнопка открытия модалки */}
                <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={handleAddParticipant}
                    style={{ width: '100%', maxWidth: '350px', margin: '0 auto 20px auto', display: 'block' }}
                >
                    + Добавить участников
                </button>

                <div className="button-group" style={{ flexDirection: 'column' }}> 
                    <button type="button" className="btn-primary" onClick={() => navigate('/game')}>
                        Перейти к игре
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => navigate('/profile')}>
                        Мой профиль
                    </button>
                </div>
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-small" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={handleCloseModal}>×</button>
                        
                        <h3>Приглашение участников</h3>

                        {/* Блок 1: Ссылка */}
                        <p className="modal-label">Ссылка для приглашения:</p>
                        <div className="link-row">
                            <input 
                                type="text" 
                                className="link-input" 
                                value={inviteLink} 
                                readOnly 
                            />
                            <button 
                                type="button" 
                                className="btn-primary"
                                onClick={handleCopyLink}
                                style={{ minWidth: '100px' }}
                            >
                                {isCopied ? '✓ Скопировано!' : 'Копировать'}
                            </button>
                        </div>

                        {/* Блок 2: Email с проверкой */}
                        <p className="modal-label" style={{ marginTop: '15px' }}>Отправить приглашение на почту:</p>
                        <div className="link-row">
                            <input 
                                type="email" 
                                className={`link-input ${emailError ? 'input-error' : ''}`}
                                placeholder="example@mail.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (emailError) setEmailError('');
                                }}
                            />
                            <button 
                                type="button" 
                                className="btn-primary"
                                onClick={handleSendEmail}
                                style={{ minWidth: '100px' }}
                            >
                                Отправить
                            </button>
                        </div>
                        
                        {/* Текст ошибки */}
                        {emailError && <span className="error-text">{emailError}</span>}
                        
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game_add_link;