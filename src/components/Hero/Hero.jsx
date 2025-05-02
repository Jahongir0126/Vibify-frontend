import React from 'react';
import './Hero.scss';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Vibify — найди людей с такими же целями
        </h1>
        <h2 className="hero-subtitle">
          Вместе — быстрее
        </h2>
        <button className="hero-button">
          Начать челлендж
        </button>
      </div>
    </section>
  );
};

export default Hero;