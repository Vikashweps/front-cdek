import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

function WishlistAdd() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleGoWishlist = () => {
        navigate('/wishlist'); 
    };
    const handleGoBack = () => {
    navigate(-1);  // -1 = перейти на одну страницу назад в истории
    };
    
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        link: ''
    });
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);

    // Обработка ввода для поля цены (разрешаем только ручной ввод)
    const handlePriceChange = (e) => {
        const value = e.target.value;
        // Разрешаем пустую строку или число с точкой
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setFormData(prev => ({ ...prev, price: value }));
        }
    };

    // Остальные поля
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Drag & Drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prev => [...prev, ...droppedFiles]);
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    // Отправка формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const productData = {
            name: formData.name,
            price: parseFloat(formData.price) || 0,
            productLink: formData.link
        };
        
        try {
            const response = await fetch('http://localhost:8080/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            
            if (response.ok) {
                navigate('/wishlist');
            } else {
                alert('Ошибка при добавлении товара');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ошибка соединения с сервером');
        }
    };

    return (
        <div className="overlay_wishlist">
            <div className="card_wishlist">
                <h1>Добавление товара</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="wishlist-content">
                        {/* ЛЕВАЯ КОЛОНКА */}
                        <div className="form-left">
                            <div className="form-group">
                                <label>Введите название <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    name="name"
                                    placeholder="Введите название" 
                                    value={formData.name}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Цена</label>
                                <input 
                                    type="text" 
                                    name="price"
                                    placeholder="0" 
                                    value={formData.price}
                                    onChange={handlePriceChange}
                                    inputMode="decimal"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Ссылка на товар</label>
                                <input 
                                    type="url" 
                                    name="link"
                                    placeholder="https://..." 
                                    value={formData.link}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        
                        {/* ПРАВАЯ КОЛОНКА - ЗАГРУЗКА */}
                        <div className="form-right">
                            <div 
                                className={`upload-area ${isDragging ? 'dragover' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <i className="ti ti-upload" style={{ fontSize: '48px', color: '#44E858' }}></i>
                                <div className="upload-text">
                                    Чтобы загрузить файл кликните или<br/>перетащите его в эту область
                                </div>
                                <div className="upload-hint">
                                    Можно загрузить не более 1 файла
                                </div>
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    style={{ display: 'none' }} 
                                    accept="image/*" 
                                    multiple
                                    onChange={handleFileSelect}
                                />
                            </div>
                            
                            {files.length > 0 && (
                                <div className="file-list">
                                    <strong>Выбрано файлов: {files.length}</strong>
                                    {files.map((file, index) => (
                                        <div key={index} className="file-item">• {file.name}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* КНОПКИ */}
                        <div className="wishlist-add-buttons">
                            <button type="submit" className="btn-primary">
                                Добавь в вишлист
                            </button>
                            <button 
                                type="button" 
                                className="btn-secondary"
                                onClick={handleGoBack}
                            >
                                Отмена
                            </button>
                        </div>
                </form>
            </div>
        </div>
    );
}

export default WishlistAdd;