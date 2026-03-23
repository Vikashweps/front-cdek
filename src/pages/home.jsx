import React, { useState } from 'react';
import './styles.css';

function Home() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    { question: "Как долго длится игра?", answer: "Стандартно: 2–3 недели (от заполнения вишлистов до доставки). Даты задаёт организатор при создании." },
    { question: "Что будет, если участник не заполнил вишлист?", answer: "Вишлист может оставаться пустым по завершению жеребьевки. В таком случае Тайный Санта увидит пустой список и сможет выбрать подарок самостоятельно." },
    { question: "Когда я узнаю, кому дарить подарок?", answer: "В день жеребьёвки (дата задаётся при создании игры). Вы получите уведомление на почту с именем получателя и его вишлистом." },
    { question: "Могу ли я вытянуть самого себя?", answer: "Нет. Система гарантирует, что вы никогда не будете дарить подарок себе." }
  ];

  const rulesData = [
    { title: "Зарегистрируйтесь и создайте игру", desc: "Организатор задаёт название команды/отдела, выбирает даты жеребьёвки и бюджет подарка." },
    { title: "Пригласите друзей", desc: "Система выдаёт уникальную ссылку. Отправьте её участникам для подключения к игре!" },
    { title: "Заполните вишлисты", desc: "Каждый участник переходит по ссылке, регистрируется и добавляет желаемые подарки." },
    { title: "Жеребьёвка", desc: "В назначенную дату система автоматически распределяет пары." },
    { title: "Дарите подарки!", desc: "" }
  ];

  return (
    <div className="app">
      
      {/* HEADER */}
      <header className="header">
        <nav>
          <a href="#profile">Профиль</a>
          <a href="#wishlist">Вишлист</a>
          <a href="#" className="logo">
            <img src="/sdek-logo.png" alt="СДЭК" className="logo-img" 
                 onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='inline'}} />
            <span style={{color: '#44E858', fontWeight: 'bold', fontSize: '24px', display: 'none'}}>СДЭК</span>
          </a>
          <a href="#rules">Правила</a>
          <a href="#faq">Вопросы</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>ТАЙНЫЙ САНТА</h1>
        <p>Один клик — и вы в игре. Один конверт — и вы узнаёте, чью жизнь сделаете чуточку ярче этим Новым годом!</p>
        <button>НАЧАТЬ</button>
      </section>

      {/* ADVANTAGES */}
      <section className="advantages">
        <h2>НАШИ ПРЕИМУЩЕСТВА</h2>
        <div className="cards">
          <div className="card">
            <h3>Доставка через СДЭК</h3>
            <p>Доставим ваш подарок курьером дедом-морозом</p>
          </div>
          <div className="card">
            <h3>Вишлисты</h3>
            <p>Добавляйте ссылки на желаемые товары</p>
          </div>
          <div className="card">
            <h3>Анонимные вопросы</h3>
            <p>Задавайте вопросы адресату в секретном чате</p>
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className="rules">
        <h2>ПРАВИЛА ИГРЫ</h2>
        <ul>
          {rulesData.map((rule, index) => (
            <li key={index}>
              <strong>{rule.title}</strong>
              {rule.desc && <span>{rule.desc}</span>}
            </li>
          ))}
        </ul>
        <button>НАЧАТЬ</button>
      </section>

      {/* FAQ */}
      <section className="faq">
        <h2>ЧАСТЫЕ ВОПРОСЫ</h2>
        <div className="faq-list">
          {faqData.map((item, index) => (
            <details key={index} className="faq-item" open={openIndex === index}>
              <summary onClick={(e) => { e.preventDefault(); toggleFaq(index); }}>
                {item.question}
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
        <button className="footer-button">СОЗДАТЬ ИГРУ</button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Контакты</h4>
            <p>+7 (495) 009 04 05</p>
          </div>
          <div className="footer-section">
            <h4>Поддержка</h4>
            <a href="#faq">Частые вопросы</a>
          </div>
          <div className="footer-section">
            <h4>Правила</h4>
            <a href="#rules">Правила игры</a>
          </div>
          <div className="footer-logo">
            <img src="/sdek-logo.png" alt="СДЭК" className="footer-logo-img" 
                 onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='inline'}} />
            <span style={{color: '#44E858', fontWeight: 'bold', fontSize: '24px', display: 'none'}}>СДЭК</span>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Тайный Санта. Все права защищены.</div>
      </footer>
      
    </div>
  );
}

export default Home;