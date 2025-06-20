// src/pages/About.js
import React from 'react';
import './About.css';
import Navbar from '../components/Navbar'; // Import the Navbar component

const About = () => {
  return (
    <div className="about-page">
       <Navbar /> {/* Include the Navbar component */}
      <section className="about-hero">
        <div className="her">
          <h1>About GearFit</h1>
          <p>Built for performance. Designed for you.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="content">
          <h2>Our Mission</h2>
          <p>
            At GearFit, we believe fitness gear should be as strong and stylish as the people who use it.
            Our journey began with a simple idea: create gym equipment that inspires confidence, enhances
            performance, and withstands the test of time.
          </p>
          <p>
            Every product is crafted with precision, tested by athletes, and designed with aesthetics that
            elevate any space—whether it's a commercial gym or your home setup.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials">
          <div className="testimonial-card">
            <p>"The dumbbells are top-notch. Sleek design and great grip. GearFit is the real deal!"</p>
            <span>— Alex M.</span>
          </div>
          <div className="testimonial-card">
            <p>"I upgraded my entire gym with GearFit. Every piece feels premium and performs flawlessly."</p>
            <span>— Jamie R.</span>
          </div>
          <div className="testimonial-card">
            <p>"Fast shipping, incredible quality, and it looks amazing in my home gym."</p>
            <span>— Taylor S.</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
