import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

// Валидация названия товара
const validateName = (name) => {
  const errors = [];
  const trimmed = name.trim();
  
  // Проверка: не пустое
  if (!trimmed) {
    errors.push('Название товара обязательно');
    return errors;
  }
  
  // Проверка: только разрешённые символы
  const validPattern = /^[а-яА-ЯёЁa-zA-Z0-9\s\-\,\.\(\)\/]+$/;
  if (!validPattern.test(trimmed)) {
    errors.push('Разрешены только буквы, цифры, пробел и символы: - , . ( ) /');
  }
  
  // Проверка: длина (3–150 символов)
  if (trimmed.length < 3) {
    errors.push('Минимальная длина названия — 3 символа');
  }
  if (trimmed.length > 150) {
    errors.push('Максимальная длина названия — 150 символов');
  }
  
  // Проверка: нет пробелов по краям
  if (trimmed.startsWith(' ') || trimmed.endsWith(' ')) {
    errors.push('Название не должно начинаться или заканчиваться пробелом');
  }
  
  return errors;
};

// Валидация цены
const validatePrice = (price) => {
  const errors = [];
  
  const num = parseFloat(price);
  
  // Проверка: это число
  if (isNaN(num)) {
    errors.push('Цена должна быть числом');
    return errors;
  }
  
  // Проверка: положительное число
  if (num <= 0) {
    errors.push('Цена должна быть больше 0');
  }
  
  // Проверка: разумный максимум
  if (num > 1000000) {
    errors.push('Максимальная цена — 10 000');
  }
  
  // Проверка: не больше 2 знаков после запятой
  const parts = price.toString().split('.');
  if (parts[1] && parts[1].length > 2) {
    errors.push('Цена может иметь не более 2 знаков после запятой');
  }
  
  return errors;
};

function WishlistAdd() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    link: ''
  });

  // ← НОВОЕ: Состояния для ошибок и "затронутых" полей
  const [errors, setErrors] = useState({ name: [], price: [] });
  const [touched, setTouched] = useState({ name: false, price: false });

  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);

  const handleGoWishlist = () => {
    navigate('/wishlist'); 
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Обработка ввода для поля цены
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, price: value }));
      // Если поле уже было затронуто — валидируем сразу
      if (touched.price) {
        setErrors(prev => ({ ...prev, price: validatePrice(value) }));
      }
    }
  };

  // Остальные поля
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Если поле уже было затронуто — валидируем сразу
    if (touched[name] && name === 'name') {
      setErrors(prev => ({ ...prev, name: validateName(value) }));
    }
  };

  //  Обработчик потери фокуса (валидация при уходе с поля)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (name === 'name') {
      setErrors(prev => ({ ...prev, name: validateName(value) }));
    } else if (name === 'price') {
      setErrors(prev => ({ ...prev, price: validatePrice(value) }));
    }
  };

  //  Проверка всей формы перед отправкой
  const isFormValid = () => {
    const nameErrors = validateName(formData.name);
    const priceErrors = validatePrice(formData.price);
    setErrors({ name: nameErrors, price: priceErrors });
    return nameErrors.length === 0 && priceErrors.length === 0;
  };

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
    
    // Валидируем перед отправкой
    if (!isFormValid()) {
      setTouched({ name: true, price: true }); // Показать все ошибки
      return;
    }
    
    const productData = {
      name: formData.name.trim(),
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
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="wishlist-content">
            <div className="form-left">

              <div className="form-group">
                <label>Название товара <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Введите название" 
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required 
                  className={errors.name.length > 0 && touched.name ? 'input-error' : ''}
                />
                {/* ← Сообщения об ошибках */}
                {errors.name.length > 0 && touched.name && (
                  <ul className="error-list">
                    {errors.name.map((err, i) => (
                      <li key={i} className="error-item">• {err}</li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Поле цены */}
              <div className="form-group">
                <label>Цена <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="price"
                  placeholder="0" 
                  value={formData.price}
                  onChange={handlePriceChange}
                  onBlur={handleBlur}
                  inputMode="decimal"
                  className={errors.price.length > 0 && touched.price ? 'input-error' : ''}
                />
                {/* ← Сообщения об ошибках */}
                {errors.price.length > 0 && touched.price && (
                  <ul className="error-list">
                    {errors.price.map((err, i) => (
                      <li key={i} className="error-item">• {err}</li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Поле ссылки */}
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