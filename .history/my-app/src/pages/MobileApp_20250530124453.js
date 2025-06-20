import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './MobileApp.css';

const 
MobileApp = () => {
  return (
    <div className="app-presentation-page">
      <Navbar />

      <div className="app-hero">
        <p className="tag">NEW!</p>
        <h1>
          Shop <span className="highlight">Smarter.</span>{' '}
          <span className="highlight">Train Harder.</span>
        </h1>
        <h2>Your Gym Essentials. On Mobile.</h2>
        <p className="subtext">
          Discover, compare, and shop top gym gear, supplements, and apparel.
          Exclusive deals & seamless experience—right from your phone!
        </p>

        <div className="download-buttons">
          <a href="#" className="btn ios">⬇ Download on iOS</a>
          <a href="#" className="btn android">▶ Get on Android</a>
        </div>

        <p className="rating">⭐ 4.8/5 — Trusted by 10,000+ athletes</p>

        <div className="phone-image">
        <img src="/images/mobilescreen.png" alt="GearFit Mobile Preview" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MobileApp;
