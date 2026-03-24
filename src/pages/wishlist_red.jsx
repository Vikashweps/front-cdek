import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';  // ✅ Добавили useParams
import './wishlist-add.css';

function WishlistRed() {
    const navigate = useNavigate();
    const { id } = useParams();  // ✅ Теперь работает
    const fileInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        link: ''
    });
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const [existingImage, setExistingImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Загрузка данных товара
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const response = await fetch(`http://localhost:8080/api/products/${id}`);
                if (response.ok) {
                    const product = await response.json();
                    setFormData({
                        name: product.name || '',
                        price: product.price?.toString() || '',
                        link: product.productLink || ''
                    });
                    if (product.imageUrl) {
                        setExistingImage(product.imageUrl);
                    }
                } else {
                    alert('Ошибка загрузки товара');
                    navigate('/wishlist');
                }
            } catch (error) {
                console.error('Error:', error);
                // Для демо - тестовые данные
                setFormData({
                    name: 'Тестовый товар',
                    price: '1999',
                    link: 'https://example.com'
                });
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchProduct();
    }, [id, navigate]);  

    // Обработка цены
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

    // Сохранение
    const handleSave = async (e) => {
        e.preventDefault();
        
        const productData = {
            name: formData.name,
            price: parseFloat(formData.price) || 0,
            productLink: formData.link
        };
        
        try {
            const response = await fetch(`http://localhost:8080/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            
            if (response.ok) {
                navigate('/wishlist');
            } else {
                alert('Ошибка при сохранении');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ошибка соединения');
        }
    };

    // Удаление
    const handleDelete = async () => {
        if (window.confirm('Удалить этот товар?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    navigate('/wishlist');
                } else {
                    alert('Ошибка при удалении');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Ошибка соединения');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="overlay_wishlist">
                <div className="card_wishlist">
                    <h1>Загрузка...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="overlay_wishlist">
            <div className="card_wishlist">
                <h1>Редактирование товара</h1>
                
                <form onSubmit={handleSave}>
                    <div className="wishlist-content">
                        {/* ЛЕВАЯ КОЛОНКА */}
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
                                <label>Ссылка</label>
                                <input 
                                    type="url" 
                                    name="link"
                                    placeholder="https://..." 
                                    value={formData.link}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        
                        {/* ПРАВАЯ КОЛОНКА - ФОТО */}
                        <div className="form-right">
                            <div 
                                className={`upload-area ${isDragging ? 'dragover' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <i className="ti ti-cloud-upload" style={{ fontSize: '48px', color: '#44E858' }}></i>
                                <div className="upload-text">
                                    Кликните или перетащите фото
                                </div>
                                <div className="upload-hint">
                                    Рекомендуемый размер: 500x500 px
                                </div>
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    style={{ display: 'none' }} 
                                    accept="image/*" 
                                    onChange={handleFileSelect}
                                />
                            </div>
                            
                            {/* Текущее фото */}
                            {existingImage && files.length === 0 && (
                                <div className="current-image">
                                    <strong>Текущее фото:</strong>
                                    <img 
                                        src={existingImage} 
                                        alt="Товар" 
                                        className="current-image-preview"
                                        style={{ 
                                            maxWidth: '100%', 
                                            maxHeight: '120px', 
                                            objectFit: 'contain',
                                            marginTop: '8px',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </div>
                            )}
                            
                            {/* Новые файлы */}
                            {files.length > 0 && (
                                <div className="file-list">
                                    <strong>Новое фото:</strong>
                                    {files.map((file, index) => (
                                        <div key={index} className="file-item">
                                            📷 {file.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* КНОПКИ */}
                    <div className="button-group">
                        <button type="submit" className="prim">
                            💾 Сохранить
                        </button>
                        <button type="button" className="danger" onClick={handleDelete}>
                            🗑️ Удалить
                        </button>
                        <button type="button" className="sec" onClick={() => navigate('/wishlist')}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WishlistRed;