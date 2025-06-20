import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

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
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="/videos/gym-bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-container">
  <div className="hero-content">
    <h1>DISCOVER YOUR STRENGTH</h1>
    <p>
      Transform your workout with our premium selection of gym equipment,
      designed to deliver performance and style with every rep.
    </p>
    <button 
      className="shop-button" 
      onClick={handleShopNow}
      type="button"
    >
      SHOP NOW
    </button>
  </div>

  {/* QR Code OUTSIDE the content block, still inside container */}
  <div className="qr-floating">
    <div className="qr-card">
      <h3>Coming Soon</h3>
      <p>Scan to preview our mobile app</p>
      <QRCodeSVG
        value="https://your-app-preview-page.com"
        size={120}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
        includeMargin={true}
      />
    </div>
  </div>
</div>

</section>
</div>
       
      
    
  );
};

export default Home;
