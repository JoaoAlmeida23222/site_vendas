import React from 'react';
import './Contact.css';
import Navbar from '../components/Navbar';

const Contact = () => {
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

      {/* Contact Info Section */}
      <section className="contact-info-section">
        <div className="contact-info">
          <div className="contact-item">
            <div className="contact-icon">✉️</div>
            <div className="contact-details">
              <h3>Email</h3>
              <p>support@gearfit.com</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <div className="contact-details">
              <h3>Phone</h3>
              <p>+1 (800) 123-4567</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div className="contact-details">
              <h3>Address</h3>
              <p>123 Fit Street, Iron City, GA 30000</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">🕒</div>
            <div className="contact-details">
              <h3>Hours</h3>
              <p>Mon–Fri: 9am–6pm</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;