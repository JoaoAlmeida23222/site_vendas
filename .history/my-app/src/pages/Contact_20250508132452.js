import React from 'react';
import './Contact.css';
import Navbar from '../components/Navbar';

const Contact = () => {
  return (
    <div className="contact-container">
        <Navbar />
      <div className="contact-overlay">
        <div className="contact-content">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-text">
            Got a question or need help? Reach out and we’ll get back to you as soon as we can!
          </p>

          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
          </form>

          <p className="contact-quote">“Push harder than yesterday if you want a different tomorrow.”</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
