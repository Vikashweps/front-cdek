import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './main.css';

function WishlistRed() {
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef(null);
    
    // Демо-данные (без загрузки с сервера)
    const [formData, setFormData] = useState({
        name: 'Тестовый товар',
        price: '1999',
        link: 'https://example.com'
    });
    
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);

    // Обработчики полей
    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setFormData(prev => ({ ...prev, price: value }));
        }
    };

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

    // Обработчики кнопок (Демо)
    const handleSave = (e) => {
        e.preventDefault();
        alert(' Товар сохранён ');
        navigate('/wishlist');
    };

    const handleDelete = () => {
        if (window.confirm('Удалить этот товар?')) {
            alert(' Товар удалён ');
            navigate('/wishlist');
        }
    };

    const handleGoBack = () => {
        navigate(-1); 
    };

    return (
        <div className="overlay_wishlist">
            <div className="card_wishlist">
                <h1>Редактирование товара</h1>
                
                <form onSubmit={handleSave}>
                    <div className="wishlist-content">
                        {/* ЛЕВАЯ КОЛОНКА - ФОРМА */}
                        <div className="form-left">
                            <div className="form-group">
                                <label>Название <span className="required">*</span></label>
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
                                    Загрузить новый файл <br/>
                                </div>
                                <div className="upload-hint">
                                    Можно загрузить не более 1 файла
                                </div>
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    style={{ display: 'none' }} 
                                    accept="image/*" 
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
                    
                    {/* ТОЛЬКО ТРИ КНОПКИ СНИЗУ */}
                    <div className="wishlist-red-buttons">
                        <button type="submit" className="btn-primary">
                            Сохранить
                        </button>
                        <button 
                            type="button" 
                            className="btn-secondary"
                            onClick={handleDelete}
                        >
                            Удалить
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

export default WishlistRed;