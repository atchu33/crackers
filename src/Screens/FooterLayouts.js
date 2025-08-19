// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import {
  FiChevronRight,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
} from "react-icons/fi";

const Footer = () => {
  return (
    <>
      {/* Inject minimal CSS for hover effects */}
      <style>
        {`
          .footer-link:hover {
            color: #ff6a00 !important;
          }
          .newsletter-btn:hover {
            background-color: #e55b00;
            transform: translateY(-1px);
          }
          @media (max-width: 768px) {
            .footer-container {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }
            .newsletter-form {
              flex-direction: column;
            }
          }
        `}
      </style>

      <footer style={footerStyle}>
        <div style={footerContainerStyle} className="footer-container">
          {/* Company Info */}
          <div style={footerColumnStyle}>
            <h3 style={companyNameStyle}>SKY BLAZE CRACKERS</h3>
            <p style={footerTextStyle}>
              Firecracker specialists with over a decade of excellence in manufacturing, retailing, and wholesale distribution.
            </p>
          </div>

          {/* Quick Links */}
          <div style={footerColumnStyle}>
            <h4 style={footerHeadingStyle}>Quick Links</h4>
            <ul style={footerListStyle}>
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Products", path: "/products" },
                { name: "Safety Tips", path: "/safety" },
                { name: "Quick Purchase", path: "/quick-purchase" },
                { name: "Contact Us", path: "/contact" },
              ].map((item) => (
                <li key={item.path} style={footerListItemStyle}>
                  <FiChevronRight style={listIconStyle} />
                  <Link to={item.path} style={{ ...footerLinkStyle, className: "footer-link" }}>
                    {item.name}
                  </Link>
                </li>
              ))}
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
                <span style={footerTextStyle}>skyblazecrackers0@gmail.com</span>
              </li>
              <li style={footerListItemStyle}>
                <FiClock style={contactIconStyle} />
                <span style={footerTextStyle}>Mon-Sat: 9AM - 8PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div style={footerColumnStyle}>
            <h4 style={footerHeadingStyle}>Stay Updated</h4>
            <p style={footerTextStyle}>Subscribe for new arrivals and festive offers.</p>
            <form style={newsletterFormStyle} className="newsletter-form">
              <input
                type="email"
                placeholder="Your Email Address"
                style={newsletterInputStyle}
                required
              />
              <button type="submit" style={newsletterButtonStyle} className="newsletter-btn">
                <FiSend style={sendIconStyle} /> Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright & Developer Credit */}
        <div style={copyrightStyle}>
          <p style={copyrightTextStyle}>
            © {new Date().getFullYear()} Sky Blaze Crackers. All Rights Reserved.
            {` | Developed by `}
            <a
              href="https://vivifysoft.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#ff6a00', textDecoration: 'none', fontWeight: '600' }}
            >
              Vivify Soft
            </a>
          </p>

          <div style={footerLinksStyle}>
            <Link to="/privacy" style={footerBottomLinkStyle} className="footer-link">
              Privacy Policy
            </Link>
            <span style={dividerStyle}>|</span>
            <Link to="/terms" style={footerBottomLinkStyle} className="footer-link">
              Terms of Service
            </Link>
            <span style={dividerStyle}>|</span>
            <Link to="/shipping" style={footerBottomLinkStyle} className="footer-link">
              Shipping Policy
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

// === Enhanced Footer Styles ===
const footerStyle = {
  backgroundColor: '#C30E59',
  color: 'white',
  fontFamily: "'Poppins', sans-serif",
  borderTop: '3px solid #fff'
};

const footerContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2.5rem',
  padding: '2.5rem 2rem',
};

const footerColumnStyle = {
  marginBottom: '1rem',
};

const companyNameStyle = {
  fontSize: '1.4rem',
  fontWeight: '700',
  margin: '0 0 1rem',
  color: '#fff',
  letterSpacing: '0.5px',
};

const footerTextStyle = {
  fontSize: '0.9rem',
  lineHeight: '1.7',
  color: '#f0f0f0',
  margin: '0.5rem 0',
};

const footerHeadingStyle = {
  fontSize: '1.2rem',
  fontWeight: '600',
  marginBottom: '1.2rem',
  color: '#fff',
  position: 'relative',
  display: 'inline-block',
};

// Add a small bottom border or dot under heading (optional via pseudo-element in CSS)
footerHeadingStyle['::after'] = {
  content: '""',
  display: 'block',
  width: '40px',
  height: '2px',
  backgroundColor: '#ff6a00',
  marginTop: '0.5rem',
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
  gap: '0.7rem',
};

const footerLinkStyle = {
  color: '#f0f0f0',
  textDecoration: 'none',
  fontSize: '0.9rem',
  transition: 'color 0.3s ease',
};

const contactIconStyle = {
  fontSize: '1.2rem',
  color: '#ff6a00',
  minWidth: '1.2rem',
  marginTop: '3px',
};

const listIconStyle = {
  fontSize: '1.2rem',
  color: '#ff6a00',
  minWidth: '1.2rem',
  marginTop: '2px',
};

const newsletterFormStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.7rem',
  marginTop: '0.5rem',
};

const newsletterInputStyle = {
  padding: '0.9rem',
  borderRadius: '6px',
  border: 'none',
  fontSize: '0.9rem',
  outline: 'none',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const newsletterButtonStyle = {
  padding: '0.9rem',
  backgroundColor: '#ff6a00',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.6rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
};

const sendIconStyle = {
  fontSize: '1.1rem',
};

const copyrightStyle = {
  borderTop: '1px solid #ff6a00',
  padding: '1rem 2rem',
  textAlign: 'center',
  backgroundColor: '#b00c4d',
  marginTop: '1rem',
};

const copyrightTextStyle = {
  fontSize: '0.9rem',
  color: '#f8f8f8',
  margin: '0 0 0.5rem',
  lineHeight: '1.6',
};

const footerLinksStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1.2rem',
  flexWrap: 'wrap',
  fontSize: '0.85rem',
};

const footerBottomLinkStyle = {
  color: '#f0f0f0',
  textDecoration: 'none',
  transition: 'color 0.3s ease',
};

const dividerStyle = {
  color: '#ff6a00',
};

// === Social Icons ===
const socialIconsStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',
};

const socialIconLinkStyle = {
  color: '#fff',
  fontSize: '1.3rem',
  transition: 'color 0.3s ease, transform 0.3s ease',
};

// Add hover effect via CSS (see <style> tag)
// :hover handled via injected CSS

export default Footer;