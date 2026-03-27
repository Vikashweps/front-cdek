import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css'; 

function Game_add() {
    const navigate = useNavigate();
    
    const [teamName, setTeamName] = useState('');
    const [drawDate, setDrawDate] = useState('');
    const [wantParticipate, setWantParticipate] = useState(false);
    const [error, setError] = useState('');

    // Ограничение даты: декабрь 2026 - январь 2027
    const MIN_DATE = '2026-12-01';
    const MAX_DATE = '2027-01-31';

    // Валидация даты в JavaScript
    const validateDate = (dateString) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const min = new Date(MIN_DATE);
        const max = new Date(MAX_DATE);
        
        // Устанавливаем время на начало дня для корректного сравнения
        date.setHours(0, 0, 0, 0);
        min.setHours(0, 0, 0, 0);
        max.setHours(23, 59, 59, 999);
        
        return date >= min && date <= max;
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDrawDate(newDate);
        
        // Проверяем дату при изменении
        if (newDate && !validateDate(newDate)) {
            setError(`Дата должна быть между ${MIN_DATE} и ${MAX_DATE}`);
        } else {
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Финальная проверка перед отправкой
        if (!validateDate(drawDate)) {
            setError(`Дата жеребьевки должна быть между ${MIN_DATE} и ${MAX_DATE}`);
            return;
        }
        
        if (!teamName.trim()) {
            setError('Введите название команды');
            return;
        }
        
        console.log({ teamName, drawDate, wantParticipate });
        // Отправка данных...
    };

    const handleGoGameAddLink = () => {
        navigate('/game-add-link'); 
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="overlay_game_add"> 
            <div className="card_game_add"> 
                <h1>Создание игры</h1>

                <form onSubmit={handleSubmit} className="game-add-form">                     
                    <div className="form-group">
                        <input 
                            type="text"
                            placeholder="Введите название команды"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    {/* Поле выбора даты с ограничением */}
                    <div className="form-group date-group">
                        <input
                            type="date"
                            value={drawDate}
                            onChange={handleDateChange}
                            min={MIN_DATE}
                            max={MAX_DATE}
                            className="input-field date-input"
                            required
                        />
                        {!drawDate && (
                            <span className="date-placeholder">Дата жеребьевки</span>
                        )}
                    </div>

                    {/* Сообщение об ошибке */}
                    {error && (
                        <div className="error-message" style={{color: '#e74c3c', fontSize: '14px', marginBottom: '10px'}}>
                            {error}
                        </div>
                    )}

                    {/* Чекбокс */}
                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={wantParticipate}
                                onChange={(e) => setWantParticipate(e.target.checked)}
                                className="checkbox"
                            />
                            <span className="checkbox-text">Хочу участвовать в жеребьевке</span>
                        </label>
                    </div>

                    <div className="game-add-buttons">
                        <button 
                            type="submit" 
                            className="btn-primary" 
                            onClick={handleGoGameAddLink}
                            disabled={!!error || !drawDate || !teamName}
                        >
                            Создать
                        </button>
                        <button type="button" className="btn-secondary" onClick={handleGoBack}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Game_add;