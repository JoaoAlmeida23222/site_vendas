import React, { useEffect } from 'react';
import './Contact.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {

  useEffect(() => {
        window.scrollTo(0, 0);
      }, [])

  return (
    <div className="contact-page">
      <Navbar />

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>We’re here to help – get in touch with us!</p>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="contact-info">
        <div className="contact-card">
          <i className="fas fa-phone-alt fa-2x"></i>
          <h3>Call Us</h3>
          <p>+351 964 285 717</p>
        </div>

        <div className="contact-card">
          <i className="fas fa-comments fa-2x"></i>
          <h3>Chat Live</h3>
          <p>Coming Soon</p>
          <a href="#chat">Start Chat</a>
        </div>

        <div className="contact-card">
          <i className="fas fa-envelope fa-2x"></i>
          <h3>Email Us</h3>
          <p>gearfitbussiness2025@.</p>
        </div>

        <div className="contact-card">
          <i className="fas fa-map-marker-alt fa-2x"></i>
          <h3>Visit Us</h3>
          <p>123 GearFit Blvd, Muscle City, USA</p>
        </div>
      </section>
      <Footer />
    </div>
    
  );
};

export default Contact;
