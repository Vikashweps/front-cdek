import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  
  // Проверка: только разрешённые символы (кириллица, латиница, цифры, пробел, - , . ( ) /)
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
  
  // Проверка: не должно начинаться или заканчиваться пробелом
  if (trimmed.startsWith(' ') || trimmed.endsWith(' ')) {
    errors.push('Название не должно начинаться или заканчиваться пробелом');
  }
  
  return errors;
};

// Валидация цены
const validatePrice = (price) => {
  const errors = [];
  
//   if (!price) {
//     errors.push('Цена обязательна для заполнения');
//     return errors;
//   }
  
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
  
  // Проверка: разумный максимум (1 000 000)
  if (num > 1000000) {
    errors.push('Максимальная цена — 1 000 000');
  }
  
  // Проверка: не больше 2 знаков после запятой
  const parts = price.toString().split('.');
  if (parts[1] && parts[1].length > 2) {
    errors.push('Цена может иметь не более 2 знаков после запятой');
  }
  
  return errors;
};

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

    // Состояния для ошибок и "затронутых" полей
    const [errors, setErrors] = useState({ name: [], price: [] });
    const [touched, setTouched] = useState({ name: false, price: false });
    
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);

    // Обработчики полей
    const handlePriceChange = (e) => {
        const value = e.target.value;
        // Разрешаем ввод только цифр и точки
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, price: value }));
        // Если поле уже было затронуто — валидируем сразу
        if (touched.price) {
            setErrors(prev => ({ ...prev, price: validatePrice(value) }));
        }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Если поле уже было затронуто — валидируем сразу
        if (touched[name]) {
        if (name === 'name') {
            setErrors(prev => ({ ...prev, name: validateName(value) }));
        }
        }
    };

    // Обработчик потери фокуса (валидация при уходе с поля)
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        if (name === 'name') {
        setErrors(prev => ({ ...prev, name: validateName(value) }));
        } else if (name === 'price') {
        setErrors(prev => ({ ...prev, price: validatePrice(value) }));
        }
    };

    // Проверка всей формы перед отправкой
    const isFormValid = () => {
        const nameErrors = validateName(formData.name);
        const priceErrors = validatePrice(formData.price);
        setErrors({ name: nameErrors, price: priceErrors });
        return nameErrors.length === 0 && priceErrors.length === 0;
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

    // Обработчики кнопок
    const handleSave = (e) => {
        e.preventDefault();
        
        // Валидируем перед сохранением
        if (!isFormValid()) {
        setTouched({ name: true, price: true }); // Показать все ошибки
        return;
        }
        
        console.log('Сохраняем товар:', formData);
        alert('Товар сохранён');
        navigate('/wishlist');
    };

    const handleDelete = () => {
        if (window.confirm('Удалить этот товар?')) {
        alert('Товар удалён');
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
        
        <form onSubmit={handleSave} noValidate>
          <div className="wishlist-content">
            {/* ЛЕВАЯ КОЛОНКА - ФОРМА */}
            <div className="form-left">
              
              {/* Поле названия */}
              <div className="form-group">
                {/* ← ИСПРАВЛЕНО: Текст лейбла */}
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
              
              {/* Поле ссылки (без строгой валидации) */}
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
          
          {/* Кнопки */}
          <div className="wishlist-red-buttons">
            <button type="submit" className="btn-primary">
              Сохранить
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


export default WishlistRed;