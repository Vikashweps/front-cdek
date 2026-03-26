import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css'; 

function Game_add() {
    const navigate = useNavigate();
    
    const [teamName, setTeamName] = useState('');
    const [drawDate, setDrawDate] = useState('');
    const [wantParticipate, setWantParticipate] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ teamName, drawDate, wantParticipate });
    };
    // Обработчик изменения полей
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Переход назад
    const handleGoProfile = () => {
        navigate('/profile'); 
    };

    const handleGoGameAddLink = () => {
        navigate('/game-add-link'); 
    };

    const handleGoBack = () => {
    navigate(-1);  // -1 = перейти на одну страницу назад в истории
    };

    return (
        <div className="overlay_profile_red"> 
            <div className="card_profile_red"> 
                <h1>Создание игры</h1>

                <form onSubmit={handleSubmit}>                     
                    <div className="form-group">
                        <input 
                            type="text"
                            placeholder="Введите название команды"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    {/* Поле выбора даты */}
                    <div className="form-group">
                        <input
                        type="date"
                        value={drawDate}
                        onChange={(e) => setDrawDate(e.target.value)}
                        className="input-field date-input"
                        />
                        {drawDate || (
                        <span className="date-placeholder">Дата жеребьевки</span>
                        )}
                    </div>

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

                    <div className="button-group">
                        <button type="submit" className="btn-primary" onClick={handleGoGameAddLink}>
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