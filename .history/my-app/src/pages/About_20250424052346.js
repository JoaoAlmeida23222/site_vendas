// src/pages/About.js
import React from 'react';
import './About.css';
import Navbar from '../components/Navbar'; // Import the Navbar component

const About = () => {
    
  return (
    
    <div className="about-container">
        <Navbar />
      <div className="about-overlay">
        <div className="about-content">
          <h1 className="about-title">WHO WE ARE</h1>
          <p className="about-text">
            At <strong>GYM STORE</strong>, we're passionate about fitness and committed to helping you unlock your full potential. 
            Our carefully curated collection of gym equipment blends performance, innovation, and aesthetics — empowering every rep, set, and session.
          </p>
          <p className="about-text">
            Whether you're building your home gym or managing a fitness studio, our mission is to equip you with the tools you need to train smarter, lift harder, and achieve greatness.
          </p>
          <p className="about-quote">
            "Train with purpose. Elevate your strength."
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
