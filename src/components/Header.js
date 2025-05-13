import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <h1>AgroFeng</h1>
        </Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/scan">Scan Land</Link></li>
          <li><Link to="/design">View Design</Link></li>
          <li><Link to="/implement">Implementation</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
