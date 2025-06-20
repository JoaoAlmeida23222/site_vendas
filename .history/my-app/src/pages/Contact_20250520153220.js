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

      {/* Info Cards Section */}
      <section className="contact-info">
        <div className="contact-card">
          <i className="fas fa-phone-alt fa-2x"></i>
          <h3>Call Us</h3>
          <p>+1 (800) 123-4567</p>
        </div>

        <div className="contact-card">
          <i className="fas fa-comments fa-2x"></i>
          <h3>Chat Live</h3>
          <p>Sun 7:00pm – Fri 7:00pm EST</p>
          <a href="#chat">Start Chat</a>
        </div>

        <div className="contact-card">
          <i className="fas fa-envelope fa-2x"></i>
          <h3>Email Us</h3>
          <p>Drop us a message anytime.</p>
          <a href="#form">Send Message</a>
        </div>

        <div className="contact-card">
          <i className="fas fa-map-marker-alt fa-2x"></i>
          <h3>Visit Us</h3>
          <p>123 GearFit Blvd, Muscle City, USA</p>
        </div>
      </section>
      </
    </div>
  );
};

export default Contact;
