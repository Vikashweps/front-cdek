import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css'; 

function Game_add_link() {
    const navigate = useNavigate();
    
    const [teamName, setTeamName] = useState('');
    const [drawDate, setDrawDate] = useState('');
    const [wantParticipate, setWantParticipate] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ teamName, drawDate, wantParticipate });
    };

    // Переход назад
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
                    <h3>Ссылка для участников:</h3>                
                   <div className="link">
                    <span className="value">https://example.com</span>
                  </div>
                  

                    <div className="button-group">
                        <button type="submit" className="btn-primary" onClick={handleGoGame}>
                            Перейти к игре
                        </button>
                        <button type="button" className="btn-secondary" onClick={handleGoProfile}>
                            Мой профиль
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Game_add_link;