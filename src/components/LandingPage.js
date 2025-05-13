import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Land into a Sustainable Paradise</h1>
          <p>
            Using principles of agroecology and feng shui to create harmonious, 
            productive landscapes that nourish both people and the planet.
          </p>
          <Link to="/scan" className="btn btn-primary">
            Start Your Transformation
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📸</div>
            <h3>Scan Your Land</h3>
            <p>Take photos of your space and our app will analyze the terrain, soil, and existing features.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Generate Design</h3>
            <p>Receive a personalized landscape design that incorporates agroecology and feng shui principles.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔮</div>
            <h3>Visualize Growth</h3>
            <p>See how your landscape will evolve over time with our predictive visualization tools.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Implementation Guide</h3>
            <p>Follow our step-by-step guide to bring your design to life with detailed instructions.</p>
          </div>
        </div>
      </section>

      <section className="benefits">
        <h2>Benefits of AgroFeng Design</h2>
        <div className="benefits-container">
          <div className="benefit">
            <h3>Sustainable Food Production</h3>
            <p>Create a system that produces food while regenerating the land.</p>
          </div>
          <div className="benefit">
            <h3>Harmonious Energy Flow</h3>
            <p>Design spaces that promote positive energy and well-being.</p>
          </div>
          <div className="benefit">
            <h3>Biodiversity Support</h3>
            <p>Enhance local ecosystems and support beneficial wildlife.</p>
          </div>
          <div className="benefit">
            <h3>Climate Resilience</h3>
            <p>Build landscapes that can adapt to changing climate conditions.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Begin Your Journey?</h2>
        <p>Transform your space into a thriving, harmonious ecosystem.</p>
        <Link to="/scan" className="btn btn-primary">
          Get Started Now
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
