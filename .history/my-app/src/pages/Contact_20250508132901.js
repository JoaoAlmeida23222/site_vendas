import React from 'react';
import './Contact.css';
import Navbar from '../components/Navbar';

const Contact = () => {
  return (
    <div className="contact-page">
      <Navbar /> {/* Include the Navbar component */}
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>We’re here to help — reach out anytime.</p>
        </div>
      </section>

      <section className="contact-info-section">
  <h2>Get in Touch</h2>
  <div className="contact-info-list">
    <p className="contact-line">
      <strong>Email:</strong> support@gearfit.com
    </p>
    <p className="contact-line">
      <strong>Phone:</strong> +1 (800) 123-4567
    </p>
    <p className="contact-line">
      <strong>Address:</strong> 123 Fit Street, Iron City, GA 30000
    </p>
    <p className="contact-line">
      <strong>Hours:</strong> Mon–Fri, 9am–6pm
    </p>
  </div>
</section>


    </div>
  );
};

export default Contact;