import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile-red.css'; // Убедитесь, что имя файла совпадает

function Profile_red() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: 'Иван Иванов',
        mail: 'ivan@example.com'
    });

    // Обработчик изменения полей
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Переход назад
    const handleGoProfile = () => {
        navigate('/profile'); 
    };

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Сохраняем данные:', formData);
        handleGoProfile();
    };

    return (
        <div className="overlay_profile_red"> 
            <div className="card_profile_red"> 
                <h1>Редактирование профиля</h1>

                <form onSubmit={handleSubmit}> 
                    <div className="form-group_profile_red">
                        <label>Имя</label>
                        <input 
                            type="text" 
                            name="name"
                            placeholder="Введите имя" 
                            value={formData.name}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    
                    <div className="form-group_profile_red">
                        <label>Почта</label>
                        <input 
                            type="email" 
                            name="mail"
                            value={formData.mail}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="button-group_profile_red">
                        <button type="submit" className="prim_profile_red">
                            Сохранить
                        </button>
                        <button type="button" className="sec_profile_red" onClick={handleGoProfile}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile_red;