// src/components/Header.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Cmp_logo10.jpg";
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiMenu, FiX, FiDownload } from "react-icons/fi";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import localforage from 'localforage';
import API_BASE_URL from "./apiConfig";
import priceListPdf from "../assets/SriGokilaa_pricelist.pdf";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };


const openPriceListPDF = (e) => {
  e.preventDefault();
  window.open(priceListPdf, '_blank'); // Opens PDF in new tab
};

  // Inject mobile CSS
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = mobileCSS;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <header style={headerStyle} className="header-mobile">
      <div style={logoContainerStyle}>
        <img src={logo} style={logoStyle} alt="Sri Gokilaa Crackers" />
        <h2 style={{ margin: "0 0 0 10px", fontSize: "16px", color: "#fff7f7ff" }}>
          Sri Gokilaa Crackers 
        </h2>
      </div>

      {/* Hamburger Menu Button - Only visible on mobile */}
      <button 
        className="hamburger-button"
        onClick={toggleMobileMenu}
        style={hamburgerButtonStyle}
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <nav className={`nav nav-mobile ${isMobileMenuOpen ? 'nav-open' : ''}`}>
        <ul style={navListStyle} className="nav-list-mobile">
          <li style={navItemStyle}>
            <NavLink to="/" onClick={closeMobileMenu}>Home</NavLink>
          </li>
          <li style={navItemStyle}>
            <NavLink to="/about" onClick={closeMobileMenu}>About Us</NavLink>
          </li>
          <li style={navItemStyle}>
            <NavLink to="/product" onClick={closeMobileMenu}>Purchase Order</NavLink>
          </li>
          
          <li style={navItemStyle}>
            <NavLink to="/quick-purchase" onClick={closeMobileMenu} special="quick">Quick Order</NavLink>
          </li>
         
           <li style={navItemStyle}>
          <a 
  href={priceListPdf} 
  target="_blank" 
  rel="noopener noreferrer"
  download="Sri_Gokilaa_Crackers_Price_List.pdf"
  style={priceListLinkStyle}
  onClick={closeMobileMenu}
>
 Download PriceList
</a>
          </li>
           <li style={navItemStyle}>
            <NavLink to="/safety" onClick={closeMobileMenu}>Safety Tips</NavLink>
          </li>
          <li style={{ ...navItemStyle, marginTop: '10px' }}>
            <Link to="/AdminLogin" style={loginnavLinkStyle} onClick={closeMobileMenu}>
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

// Reusable NavLink — NO HOVER EFFECT
const NavLink = ({ to, children, onClick, special }) => {
  const baseStyle = special === "quick"
    ? quickOrderStyle
    : navLinkStyle;

  return (
    <Link
      to={to}
      style={baseStyle}  // Always use base style
      onClick={onClick}
      // Removed: onMouseEnter, onMouseLeave
    >
      {children}
    </Link>
  );
};
// === Styles === 
const headerStyle = {
  background: 'rgb(26, 35, 126)',
  padding: '0.5rem 2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  color: '#ffffff',
};

const quickOrderStyle = {
  padding: '0.5rem 1rem',
  background: 'linear-gradient(135deg, #ff9800, #f57c00)',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '20px',
  fontWeight: '600',
 fontSize: '0.9rem',
  border: '2px solid #ff9800',
  boxShadow: '0 4px 10px rgba(255, 152, 0, 0.4)',
  transition: 'none', // Removed transition to prevent conflicts with animation
  display: 'inline-block',
  verticalAlign: 'middle',
  margin: '0',
  animation: 'quickOrderBlink 2s infinite ease-in-out',
  animationFillMode: 'forwards',
}

const quickOrderHoverStyle = {
  // Animation overrides hover, but keep for fallback
  background: '#ff6e1b',
  boxShadow: '0 6px 16px rgba(255, 152, 0, 0.6)',
  transform: 'scale(1.1)', // Slightly bigger on hover
  animationPlayState: 'paused', // Pause animation on hover to see hover effect
}

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const logoStyle = {
  height: '50px',               
  width: '50px',              
  borderRadius: '50%',          
  objectFit: 'cover',           // Zoom and fill the circle
  border: '3px solid #FF9800',  // Visible border
  backgroundColor: '#fff',      // Optional background
  overflow: 'hidden' 
};

const navListStyle = {
  display: 'flex',
  alignItems: 'center',
  listStyle: 'none',
  gap: '1rem',
  padding: 0,
  margin: 0,
};

const navItemStyle = {
  borderRadius: '30px',
  overflow: 'visible',
  transition: 'all 0.3s ease',
  fontsize: '1rem',
};

const navLinkStyle = {
  color: '#ffffff',
  textDecoration: 'none', // Remove any default underline
 fontWeight: 'bold',
  fontSize: '1rem',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  transition: 'color 0.3s ease',
  outline: 'none', // Remove focus outline
};

const loginnavLinkStyle = {
 padding: '0.5rem 1rem',
  background: 'linear-gradient(135deg, #ff512f, #dd2476)',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '10px',
  fontWeight: 'bold',
  fontSize: '1rem',
  transition: 'all 0.4s ease',
  boxShadow: '0 0 10px #ff512f88',
  animation: 'pulseGlow 2s infinite',
  margin: '10px 0',
};


const hamburgerButtonStyle = {
  display: 'none',
  background: 'rgb(26, 35, 126)',
  color: 'white',
  border: 'none',
  padding: '0.5rem',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};
const priceListLinkStyle = {
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  transition: 'color 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
};
// Mobile CSS with consistent desktop styling
const mobileCSS = `
@keyframes quickOrderBlink {
  0% {
    opacity: 0.8;
    transform: scale(1) translateY(0px);
    box-shadow: 0 4px 10px rgba(255, 152, 0, 0.4), 0 0 20px rgba(255, 152, 0, 0.3);
    background: linear-gradient(135deg, #ff9800, #f57c00);
  }
  25% {
    opacity: 1;
    transform: scale(1.08) translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 152, 0, 0.9), 0 0 50px rgba(255, 152, 0, 0.7);
    background: linear-gradient(135deg, #ffb74d, #ff8f00);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.98) translateY(1px);
    box-shadow: 0 3px 8px rgba(255, 152, 0, 0.3), 0 0 15px rgba(255, 152, 0, 0.2);
    background: linear-gradient(135deg, #ff6f00, #e65100);
  }
  75% {
    opacity: 1;
    transform: scale(1.05) translateY(-1px);
    box-shadow: 0 6px 18px rgba(255, 152, 0, 0.7), 0 0 35px rgba(255, 152, 0, 0.5);
  background: 'linear-gradient(135deg, #ffd54f, #ffb74d)', // Lighter orange shades

  }
  100% {
    opacity: 0.8;
    transform: scale(1) translateY(0px);
    box-shadow: 0 4px 10px rgba(255, 152, 0, 0.4), 0 0 20px rgba(255, 152, 0, 0.3);
    background: 'linear-gradient(135deg, #ffd54f, #ffb74d)', // Lighter orange shades

  }
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 12px #ff512f88, 0 0 24px #ff512f44;
  }
  50% {
    box-shadow: 0 0 20px #ff512fcc, 0 0 36px #ff512f88;
  }
  100% {
    box-shadow: 0 0 12px #ff512f88, 0 0 24px #ff512f44;
  }
}

/* Desktop - hide hamburger */
@media (min-width: 769px) {
  .hamburger-button {
    display: none !important;
  }
}

/* Mobile Layout - Same styling as desktop */
@media (max-width: 768px) {
  .header-mobile {
    flex-direction: row;
    padding: 0.5rem 1rem; /* Reduced padding for mobile */
    justify-content: space-between;
    align-items: center;
    background: rgb(26, 35, 126); /* Same as desktop */
    position: sticky;
    top: 0;
    z-index: 1000;
    color: #ffffff;
  }

  .hamburger-button {
    display: flex !important;
    align-items: center;
    justify-content: center;
    background: rgb(26, 35, 126); /* Same as desktop header background */
    border: 2px solid #FF9800; /* Orange border like logo */
    color: #FF9800;
    border-radius: 8px;
    padding: 0.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .hamburger-button:hover {
    background-color: rgba(255, 152, 0, 0.1);
    transform: scale(1.1);
  }

  /* Nav positioned below header with desktop styling */
  .nav-mobile {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgb(26, 35, 126); /* Same as desktop header */
    border-top: 1px solid rgba(255, 152, 0, 0.3);
    opacity: 0;
    visibility: hidden;
    transform: scaleY(0);
    transform-origin: top;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .nav-mobile.nav-open {
    opacity: 1;
    visibility: visible;
    transform: scaleY(1);
  }

  .nav-list-mobile {
    flex-direction: column;
    align-items: center;
    gap: 1rem; /* Same as desktop */
    padding: 2rem 1rem;
    margin: 0;
    list-style: none;
  }

  .nav-list-mobile li {
    border-radius: 30px; /* Same as desktop */
    overflow: visible;
    transition: all 0.3s ease;
  }

.nav-list-mobile a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: color 0.3s ease;
  display: block;
  text-align: center;
  outline: none; /* ✅ Remove focus outline */
}

.nav-list-mobile a:focus,
.nav-list-mobile a:active {
  outline: none !important; /* Remove focus outline */
  box-shadow: none !important; /* Remove any shadow effects */
  text-decoration: none !important; /* Remove any underline */
}
 .nav-list-mobile a:hover {
  /* No visual change on hover */
  color: #ffffff;
  text-decoration: none;
  transform: none;
}

  /* Quick Order button styling - same as desktop */
  .nav-list-mobile a[href="/quick-purchase"] {
    padding: 0.7rem 1.3rem;
    background: background: linear-gradient(135deg, #ffd54f, #ffb74d); /* Light orange */
    color: #fff;
    border-radius: 20px;
    font-weight: 600;
    border: 2px solid #ff9800;
    box-shadow: 0 4px 10px rgba(255, 152, 0, 0.4);
    margin: 0;
    animation: quickOrderBlink 2s infinite ease-in-out;
    animation-fill-mode: forwards;
  }

  .nav-list-mobile a[href="/quick-purchase"]:hover {
    animation-play-state: paused; /* Pause animation on hover */
    background: #ff6e1b;
    box-shadow: 0 6px 16px rgba(255, 152, 0, 0.6);
    transform: scale(1.1);
    color: #fff; /* Override the yellow hover */
    text-decoration: none; /* Remove underline for button */
  }

  /* Login button styling - same as desktop */
  .nav-list-mobile a[href="/AdminLogin"] {
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #ff512f, #dd2476);
    color: #fff;
    border-radius: 10px;
    font-weight: bold;
    box-shadow: 0 0 10px #ff512f88;
    animation: pulseGlow 2s infinite;
    margin: 10px 0;
  }

  .nav-list-mobile a[href="/AdminLogin"]:hover {
    color: #fff; /* Keep white text on login button */
    text-decoration: none; /* Remove underline for button */
  }

  /* Logo sizing for mobile */
  .header-mobile img {
    height: 60px; /* Slightly smaller than desktop */
    width: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #FF9800;
    box-shadow: 0 0 15px rgba(255, 152, 0, 0.7);
  }
}

@media (max-width: 480px) {
  .nav-list-mobile a {
    font-size: 1.1rem; /* Slightly smaller on very small devices */
  }
}
  
  .nav-list-mobile {
    padding: 1.5rem 0.5rem;
    gap: 0.8rem;
  }

  .nav-list-mobile a {
    font-size: 0.95rem;
    padding: 0.5rem 1rem;
  }

  .header-mobile img {
    height: 50px;
    width: 50px;
  }
}
`;

export default Header;