import React from 'react';
import './Hero.scss';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Знакомься нешаблонно: путешествия, философия, квесты
        </h1>
        <h2 className="hero-subtitle">
          Найди тех, кто разделяет твои странности
        </h2>
        <button className="hero-button">
          Начать челлендж
        </button>
      </div>
    </section>
  );
};

export default Hero; 