import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Импортируем API методы
import { fetchMyWishlist, deleteWishlistItem } from '/src/api/gameApi.jsx'; 
import { updateWishlistItem } from '/src/api/gameApi.jsx';
import './main.css';

// === ФУНКЦИИ ВАЛИДАЦИИ (без изменений) ===
const validateName = (name) => {
  const errors = [];
  const trimmed = name.trim();
  if (!trimmed) {
    errors.push('Название товара обязательно');
    return errors;
  }
  const validPattern = /^[а-яА-ЯёЁa-zA-Z0-9\s\-\,\.\(\)\/]+$/;
  if (!validPattern.test(trimmed)) {
    errors.push('Разрешены только буквы, цифры, пробел и символы: - , . ( ) /');
  }
  if (trimmed.length < 3) {
    errors.push('Минимальная длина названия — 3 символа');
  }
  if (trimmed.length > 150) {
    errors.push('Максимальная длина названия — 150 символов');
  }
  if (trimmed.startsWith(' ') || trimmed.endsWith(' ')) {
    errors.push('Название не должно начинаться или заканчиваться пробелом');
  }
  return errors;
};

const validatePrice = (price) => {
  const errors = [];
  const num = parseFloat(price);
  if (isNaN(num)) {
    errors.push('Цена должна быть числом');
    return errors;
  }
  if (num <= 0) {
    errors.push('Цена должна быть больше 0');
  }
  if (num > 1000000) {
    errors.push('Максимальная цена — 1 000 000');
  }
  const parts = price.toString().split('.');
  if (parts[1] && parts[1].length > 2) {
    errors.push('Цена может иметь не более 2 знаков после запятой');
  }
  return errors;
};

function WishlistRed() {
  const navigate = useNavigate();
  const { eventId, itemId } = useParams();
  const fileInputRef = useRef(null);
  
  // Состояния
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    link: ''
  });
  const [wishlistId, setWishlistId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [errors, setErrors] = useState({ name: [], price: [] });
  const [touched, setTouched] = useState({ name: false, price: false });
  
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);

  // ← НОВОЕ: Загрузка данных товара
  useEffect(() => {
    const loadItem = async () => {
      if (!eventId || !itemId) return;

      try {
        setIsLoading(true);
        setError(null);

        // 1. Получаем весь вишлист
        const wishlistData = await fetchMyWishlist(eventId);
        
        // Сохраняем ID вишлиста для будущего обновления
        setWishlistId(wishlistData.id || wishlistData.wishlistId);

        // 2. Ищем нужный товар в списке
        // Предполагаем, что ответ имеет структуру { items: [...] } или это массив
        const items = Array.isArray(wishlistData) ? wishlistData : (wishlistData.items || []);
        const item = items.find(i => i.id === itemId || i.id.toString() === itemId);

        if (!item) {
          throw new Error('Товар не найден');
        }

        // 3. Заполняем форму
        setFormData({
          name: item.name || '',
          price: item.price ? String(item.price) : '',
          link: item.link || ''
        });
        // Если есть картинка, можно сохранить её URL, чтобы показать превью (опционально)
        
      } catch (err) {
        console.error('Ошибка загрузки товара:', err);
        setError(err.message || 'Не удалось загрузить данные товара');
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [eventId, itemId]);

  // Обработчики полей (без изменений)
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, price: value }));
      if (touched.price) {
        setErrors(prev => ({ ...prev, price: validatePrice(value) }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name] && name === 'name') {
      setErrors(prev => ({ ...prev, name: validateName(value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (name === 'name') {
      setErrors(prev => ({ ...prev, name: validateName(value) }));
    } else if (name === 'price') {
      setErrors(prev => ({ ...prev, price: validatePrice(value) }));
    }
  };

  const isFormValid = () => {
    const nameErrors = validateName(formData.name);
    const priceErrors = validatePrice(formData.price);
    setErrors({ name: nameErrors, price: priceErrors });
    return nameErrors.length === 0 && priceErrors.length === 0;
  };

  // Drag & Drop (без изменений)
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
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

  // ← НОВОЕ: Сохранение с отправкой на сервер
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setTouched({ name: true, price: true });
      return;
    }

    if (!wishlistId) {
      alert('Ошибка: Вишлист не найден');
      return;
    }
    
    try {
      // Подготовка данных (добавьте загрузку файла, если нужно)
      const itemData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        link: formData.link
        // image: ... (если загружаете файл)
      };

      // Вызов API обновления
      await updateWishlistItem(wishlistId, itemId, itemData);
      
      alert('Товар обновлён');
      navigate(`/game/${eventId}/wishlist`);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      alert(`Не удалось сохранить: ${err.message}`);
    }
  };

  // ← НОВОЕ: Удаление с отправкой на сервер
  const handleDelete = async () => {
    if (window.confirm('Удалить этот товар?')) {
      if (!wishlistId) {
        alert('Ошибка: Вишлист не найден');
        return;
      }
      try {
        await deleteWishlistItem(wishlistId, itemId);
        alert('Товар удалён');
        navigate(`/game/${eventId}/wishlist`);
      } catch (err) {
        console.error('Ошибка удаления:', err);
        alert(`Не удалось удалить: ${err.message}`);
      }
    }
  };

  const handleGoBack = () => {
    navigate(-1); 
  };

  // Рендер загрузки
  if (isLoading) {
    return (
      <div className="overlay_wishlist">
        <div className="card_wishlist">
          <h1>Загрузка...</h1>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <i className="ti ti-loader" style={{ fontSize: '48px', color: '#44E858', animation: 'spin 1s linear infinite' }}></i>
          </div>
        </div>
      </div>
    );
  }

  // Рендер ошибки
  if (error) {
    return (
      <div className="overlay_wishlist">
        <div className="card_wishlist">
          <h1>Ошибка</h1>
          <div style={{ textAlign: 'center', padding: '40px', color: '#e74c3c' }}>
            <p>{error}</p>
            <button className="btn-secondary" onClick={handleGoBack}>Назад</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overlay_wishlist">
      <div className="card_wishlist">
        <h1>Редактирование товара</h1>
        
        <form onSubmit={handleSave} noValidate>
          <div className="wishlist-content">
            {/* ЛЕВАЯ КОЛОНКА - ФОРМА */}
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
                {errors.name.length > 0 && touched.name && (
                  <ul className="error-list">
                    {errors.name.map((err, i) => (
                      <li key={i} className="error-item">• {err}</li>
                    ))}
                  </ul>
                )}
              </div>
              
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
                {errors.price.length > 0 && touched.price && (
                  <ul className="error-list">
                    {errors.price.map((err, i) => (
                      <li key={i} className="error-item">• {err}</li>
                    ))}
                  </ul>
                )}
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
                <div className="upload-text">Загрузить новый файл <br/></div>
                <div className="upload-hint">Можно загрузить не более 1 файла</div>
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
          
          <div className="wishlist-red-buttons">
            <button type="submit" className="btn-primary">Сохранить</button>
            <button type="button" className="btn-secondary" onClick={handleDelete} style={{ borderColor: '#e74c3c', color: '#e74c3c' }}>
              Удалить
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