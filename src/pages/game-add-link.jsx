import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css'; 

function Game_add_link() {
    const navigate = useNavigate();
    
    // Данные формы
    const [teamName, setTeamName] = useState('');
    const [drawDate, setDrawDate] = useState('');
    const [wantParticipate, setWantParticipate] = useState(false);

    // ← ИСПРАВЛЕНИЕ: Добавлены недостающие состояния
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const inviteLink = `${window.location.origin}/join/TEAM123`;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ teamName, drawDate, wantParticipate });
        // Здесь можно добавить логику сохранения перед переходом
    };

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

    // Открыть окно
    const handleAddParticipant = () => {
        setIsModalOpen(true);
        setIsCopied(false);
    };

    // Закрыть окно
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsCopied(false);
    };

    const handleGoProfile = () => {
        navigate('/profile'); 
    };

    const handleGoGame = () => {
        navigate('/game'); 
    };

    return (
        <div className="overlay_profile_red"> 
            <div className="card_profile_red"> 
            <h1>Создание игры</h1>

            <form onSubmit={handleSubmit}>                  
                <button 
                type="button" 
                className="btn-secondary"
                onClick={handleAddParticipant}
                style={{ width: '100%', maxWidth: '350px', margin: '0 auto 20px auto', display: 'block' }}
                >
                + Добавить участников
                </button>
                    
                {/* Обернули кнопки в div с классом button-group */}
                <div className="button-group">
                <button type="button" className="btn-primary" onClick={handleGoGame}>
                    Перейти к игре
                </button>
                <button type="button" className="btn-secondary" onClick={handleGoProfile}>
                    Мой профиль
                </button>
                </div>
            </form>
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-small" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={handleCloseModal}>×</button>
                        
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
                            >
                                {isCopied ? '✓ Скопировано!' : 'Копировать'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game_add_link;