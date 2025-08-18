// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiChevronRight,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={footerContainerStyle}>
        {/* Company Info */}
        <div style={footerColumnStyle}>
          <h3 style={companyNameStyle}>SRI GOKILAA CRACKERS</h3>
          <p style={footerTextStyle}>
            Firecracker specialists with over a decade of excellence in manufacturing, retailing, and wholesale distribution.
          </p>
        </div>

        {/* Quick Links */}
        <div style={footerColumnStyle}>
          <h4 style={footerHeadingStyle}>Quick Links</h4>
          <ul style={footerListStyle}>
            <li style={footerListItemStyle}>
              <FiChevronRight style={listIconStyle} />
              <Link to="/" style={footerLinkStyle}>Home</Link>
            </li>
            <li style={footerListItemStyle}>
              <FiChevronRight style={listIconStyle} />
              <Link to="/about" style={footerLinkStyle}>About Us</Link>
            </li>
            <li style={footerListItemStyle}>
              <FiChevronRight style={listIconStyle} />
              <Link to="/products" style={footerLinkStyle}>Products</Link>
            </li>
            <li style={footerListItemStyle}>
              <FiChevronRight style={listIconStyle} />
              <Link to="/safety" style={footerLinkStyle}>Safety Tips</Link>
            </li>
            <li style={footerListItemStyle}>
              <FiChevronRight style={listIconStyle} />
              <Link to="/quick-purchase" style={footerLinkStyle}>Quick Purchase</Link>
            </li>
            <li style={footerListItemStyle}>
              <FiChevronRight style={listIconStyle} />
              <Link to="/contact" style={footerLinkStyle}>Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div style={footerColumnStyle}>
          <h4 style={footerHeadingStyle}>Contact Us</h4>
          <ul style={footerListStyle}>
            <li style={{ ...footerListItemStyle, alignItems: 'flex-start' }}>
              <FiMapPin style={contactIconStyle} />
              <span style={footerTextStyle}>
                4/1C Rajamuthu Nagar, Naranapuram Puthur, Naranapuram, Virudhunagar, Tamil Nadu 626189
              </span>
            </li>
            <li style={footerListItemStyle}>
              <FiPhone style={contactIconStyle} />
              <span style={footerTextStyle}>+91 9787009888</span>
            </li>
            <li style={footerListItemStyle}>
              <FiMail style={contactIconStyle} />
              <span style={footerTextStyle}>srigokilaacrackers0@gmail.com</span>
            </li>
            <li style={footerListItemStyle}>
              <FiClock style={contactIconStyle} />
              <span style={footerTextStyle}>Mon-Sat: 9AM - 8PM</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div style={footerColumnStyle}>
          <h4 style={footerHeadingStyle}>Newsletter</h4>
          <p style={footerTextStyle}>Subscribe to get updates on new products and offers</p>
          <form style={newsletterFormStyle}>
            <input
              type="email"
              placeholder="Your Email Address"
              style={newsletterInputStyle}
              required
            />
            <button type="submit" style={newsletterButtonStyle}>
              <FiSend style={sendIconStyle} /> Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright & Developer Credit */}
      <div style={copyrightStyle}>
        <p style={copyrightTextStyle}>
          © {new Date().getFullYear()} Sri Gokilaa Crackers. All Rights Reserved.
          {` | Developed by `}
          <a
            href="https://vivifysoft.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#FF9800', textDecoration: 'none', fontWeight: '500' }}
          >
            Vivify Soft
          </a>
        </p>

        {/* Footer Links (Privacy, Terms, etc.) */}
        <div style={footerLinksStyle}>
          <Link to="/privacy" style={footerBottomLinkStyle}>
            Privacy Policy
          </Link>
          <span style={dividerStyle}>|</span>
          <Link to="/terms" style={footerBottomLinkStyle}>
            Terms of Service
          </Link>
          <span style={dividerStyle}>|</span>
          <Link to="/shipping" style={footerBottomLinkStyle}>
            Shipping Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

// === Footer Styles ===
const footerStyle = {
  backgroundColor: '#1a237e',
  color: 'white',
  padding: '3rem 2rem 1rem',
};

const footerContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
  paddingBottom: '2rem',
};

const footerColumnStyle = {
  marginBottom: '2rem',
};

const companyNameStyle = {
  fontSize: '1.25rem',
  margin: '0.5rem 0',
  color: 'white',
};

const footerTextStyle = {
  fontSize: '0.9rem',
  lineHeight: '1.6',
  color: '#e0e0e0',
  margin: '0.5rem 0',
};

const footerHeadingStyle = {
  fontSize: '1.2rem',
  marginBottom: '1.5rem',
  color: 'white',
};

const footerListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const footerListItemStyle = {
  marginBottom: '0.8rem',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.5rem',
};

const footerLinkStyle = {
  color: '#e0e0e0',
  textDecoration: 'none',
  fontSize: '0.9rem',
  transition: 'color 0.3s ease',
};

 

// Update the contactIconStyle in your styles section to:
const contactIconStyle = {
  fontSize: '1.1rem',  // Increased from 1rem to 1.1rem
  color: '#FF9800',
  minWidth: '1.1rem',  // Added to ensure consistent spacing
  marginTop: '3px',
};

const listIconStyle = {
  fontSize: '1.1rem',  // Increased from 0.8rem to match contact icons
  color: '#FF9800',
  minWidth: '1.1rem',  // Added for consistent spacing
  marginTop: '2px',    // Slightly adjusted alignment
};

const newsletterFormStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const newsletterInputStyle = {
  padding: '0.8rem',
  borderRadius: '5px',
  border: 'none',
  fontSize: '0.9rem',
};

const newsletterButtonStyle = {
  padding: '0.8rem',
  backgroundColor: '#FF9800',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const sendIconStyle = {
  fontSize: '1rem',
};

const copyrightStyle = {
  borderTop: '1px solid #3949AB',
  padding: '1.5rem 0',
  textAlign: 'center',
 
};

const copyrightTextStyle = {
  fontSize: '0.9rem',
  color: '#e0e0e0',
  margin: '0 0 0.5rem',
  lineHeight: '1.6',
};

const footerLinksStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
};

const footerBottomLinkStyle = {
  color: '#e0e0e0',
  textDecoration: 'none',
  fontSize: '0.8rem',
  transition: 'color 0.3s ease',
};

const dividerStyle = {
  color: '#3949AB',
};

// Add hover effects using external CSS (recommended) or emotion/styled-components for full :hover support
// Inline styles don't support :hover well in React, so consider moving to CSS modules or styled-components for production.

export default Footer;