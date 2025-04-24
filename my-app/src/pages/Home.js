import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    console.log('Navigating to products...');
    navigate('/products');
  };

  return (
    <div className="home">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <h1>DISCOVER YOUR STRENGHT</h1>
            <p>Transform your workout with our premium selection of gym equipment, designed to deliver performance and style with every rep.</p>
            <button 
              className="shop-button" 
              onClick={handleShopNow}
              type="button"
            >
              SHOP NOW
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 