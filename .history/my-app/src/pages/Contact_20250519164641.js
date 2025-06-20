import React from 'react';
import './Contact.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
      <section className="contact-info-cards">
  <div className="contact-card">
    <i className="fas fa-phone-alt"></i> {/* This uses Font Awesome for the phone icon */}
    <h3>Call Us</h3>
    <p>+1 (800) 123-4567</p>
  </div>
  
  <div className="contact-card">
    <i className="fas fa-comment"></i> {/* Chat icon */}
    <h3>Chat Live</h3>
    <p>We’re available Sun 7:00pm EST – Friday 7:00pm EST</p>
    <a href="#chat" className="btn">Chat Now</a>
  </div>
  
  <div className="contact-card">
    <i className="fas fa-envelope"></i> {/* Envelope icon for email */}
    <h3>Ask a Question</h3>
    <p>Fill out our form and we’ll get back to you in 24 hours.</p>
    <a href="#form" className="btn">Get Started</a>
  </div>
</section>
<Footer />
    </div>
  );
};

export default Contact;