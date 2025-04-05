import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Logo
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/produtos" className="navbar-link">
            Produtos
          </Link>
          <Link to="/sobre" className="navbar-link">
            Sobre
          </Link>
          <Link to="/contato" className="navbar-link">
            Contato
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
