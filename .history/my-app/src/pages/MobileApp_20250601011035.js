import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MobileApp.css';

const MobileApp = () => {
  const navigate = useNavigate();

  return (
    <div className="app-presentation-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <div className="app-hero">
        <p className="tag">COMING SOON!</p>
        <h1>
          Shop <span className="highlight">Smarter.</span>{' '}
          <span className="highlight">Train Harder.</span>
        </h1>
        <h2>Your Gym Essentials. Now on Mobile.</h2>
        <p className="subtext">
          Discover, compare, and shop top gym gear, supplements, and apparel.
          Exclusive deals & seamless experience—right from your phone!
        </p>

        <div className="download-buttons">
          <a href="#D" className="btn ios">⬇ Download on iOS</a>
          <a href="#D" className="btn android">▶ Get on Android</a>
        </div>

        <p className="rating">⭐ 4.8/5 — Trusted by 10,000+ athletes</p>

        <div className="phone-image">
          <img src="/images/mobilescreen.png" alt="GearFit Mobile Preview" />
        </div>
      </div>
    </div>
  );
};

export default MobileApp;
