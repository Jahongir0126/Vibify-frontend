import React from 'react';
import './Hero.scss';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">

        <h1 className="hero-title">
          найди людей с такими же целями
        </h1>
        <h2 className="hero-subtitle">
          Вместе — быстрее
        </h2>
        <button className="hero-button ">
          <Link  to={"/search"} className='nav-link'>
            Найти 
            </Link>
        </button>
      </div>
    </section>
  );
};

export default Hero;