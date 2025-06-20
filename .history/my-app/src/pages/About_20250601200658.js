
import React, { useEffect } from 'react';
import './About.css';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 

const About = () => {

   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <div className="about-page">
       <Navbar /> 
      <section className="about-hero">
        <div className="hero-content">
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
          <h4>
          OUR MOBILE APP COMING SOON!
          </h4>
          <button 
  className="check-app-button" 
  onClick={() => window.location.href = '/MobileApp'}>
  Check it out 
</button>
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
      <Footer />
    </div>
  );
};

export default About;
