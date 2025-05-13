import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>AgroFeng</h3>
          <p>Transforming landscapes through the harmony of agroecology and feng shui principles.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/scan">Scan Land</a></li>
            <li><a href="/design">View Design</a></li>
            <li><a href="/implement">Implementation</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Agroecology Guide</a></li>
            <li><a href="#">Feng Shui Principles</a></li>
            <li><a href="#">Plant Database</a></li>
            <li><a href="#">Community Forum</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AgroFeng App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
