import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import logo from "../assets/logo.jpg";
import axios from "axios";
import localforage from "localforage";
import API_BASE_URL from "./apiConfig";
import hero_bg from "../assets/pro_bg.jpg";
import pro_img from "../assets/crack.jpg";
import bomb from "../assets/bombabt.jpg";
import celeb from "../assets/celeb.jpg";
import new_img from "../assets/fire crackers image2.png";
import new_img2 from "../assets/fireworks.png";
import new_img3 from "../assets/fire racker image4.png";
import new_img4 from "../assets/fire cracker img 5.jpg";
import about_img from "../assets/about_img.png";
import Header from './HeaderLayouts';
import Footer from './FooterLayouts';
import pro_img2 from "../assets/fire_gif.gif";
import { 
  FiCalendar, FiDollarSign, FiAward, FiCheck, FiX, FiZap, FiStar, FiTruck,
  FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiChevronRight, FiMapPin,
  FiPhone, FiMail, FiClock, FiSend, FiAlertTriangle, FiUser, FiWind, FiDroplet,
  FiShield, FiAlertCircle, FiBookOpen, FiEye, FiHeart, FiGift
} from 'react-icons/fi';

function Home() {
  const [showPopup, setShowPopup] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isRenderPopup, setIsRenderPopup] = useState(false);

useEffect(() => {
  setShowPopup(true); // Always show on page load
}, []);

useEffect(() => {
  if (showPopup) {
    setIsRenderPopup(true);
    setTimeout(() => setIsVisible(true), 10);
  } else {
    setIsVisible(false);
    const timer = setTimeout(() => setIsRenderPopup(false), 300);
    return () => clearTimeout(timer);
  }
}, [showPopup]);

const handleClose = () => {
  setIsVisible(false);
  setTimeout(() => {
    setShowPopup(false);
    // Removed localStorage to allow popup on next refresh
  }, 300);
};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    companyId: 1
  });

  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Please fill in all required fields (Name, Email, Message)');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSubmittingContact(true);
    setSubmitStatus(null);

    try {
      const token = await localforage.getItem("jwtToken");
      if (!token) throw new Error("No authentication token found");

      const formDataToSend = new FormData();
      formDataToSend.append('Name', formData.name);
      formDataToSend.append('Email', formData.email);
      formDataToSend.append('Phone', formData.phone || '');
      formDataToSend.append('Subject', formData.subject || 'General Inquiry');
      formDataToSend.append('Message', formData.message);
      formDataToSend.append('CompanyId', formData.companyId);

      const response = await axios.post(
        `${API_BASE_URL}api/Crackers/SendContactEmail`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.statusCode === 200) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          companyId: 1
        });
        setTimeout(() => setSubmitStatus(null), 1000);
      } else {
        throw new Error(response.data.statusDesc || "Failed to send message");
      }
    } catch (error) {
      console.error("Error details:", error);
      setSubmitStatus('error');
      alert(`Failed to send message: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* Injected CSS */}
      <style>{`
        :root {
          --primary: #C30E59;
          --primary-light: #E91E63;
          --accent: #FFD54F;
          --accent-dark: #FFC107;
          --text: #333;
          --text-light: #666;
          --bg-light: #f8f9fa;
          --white: #fff;
          --success: #4CAF50;
          --error: #f44336;
          --shadow: 0 10px 30px rgba(0,0,0,0.1);
          --shadow-hover: 0 20px 40px rgba(0,0,0,0.15);
          --border-radius: 20px;
          --transition: all 0.3s ease;
        }

        /* === MAIN HERO SECTION (ORIGINAL STYLE RESTORED) === */
        .main-hero {
          min-height: 50vh;
          background: linear-gradient(45deg, rgba(255, 107, 0, 0.95), rgba(199, 14, 89, 0.85)), url(${hero_bg}) center/cover fixed;
          display: flex;
          align-items: center;
          padding: 2rem;
        }

        .hero-grid-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-text-section {
          color: white;
        }

        .hero-content-wrapper {
          max-width: 600px;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .hero-main-title {
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 1.5rem 0;
          text-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .hero-accent-text {
          color: var(--accent);
          text-shadow: 0 0 30px rgba(255, 213, 79, 0.6);
        }

        .hero-description {
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          opacity: 0.95;
        }

        .hero-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .hero-stat-item {
          text-align: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .hero-stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: var(--accent);
        }

        .hero-stat-label {
          font-size: 0.9rem;
          margin: 0;
          opacity: 0.9;
        }

        .hero-action-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          padding-top: 20px;
        }

        .hero-cta-button,
        .hero-secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          transition: var(--transition);
          text-decoration: none;
          line-height: 1.2;
        }

        .hero-cta-button {
          background: linear-gradient(45deg, var(--accent), var(--accent-dark));
          color: #333;
          box-shadow: 0 4px 15px rgba(255, 213, 79, 0.4);
        }

        .hero-secondary-button {
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.8);
        }

        .hero-button-icon {
          font-size: 1.2rem;
        }

        .hero-image-section {
          position: relative;
        }

        .hero-main-image-container {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .hero-main-image {
          width: 100%;
          height: 350px;
          object-fit: cover;
        }

        .hero-image-overlay {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          display: flex;
          justify-content: space-between;
        }

        .hero-badge-style {
          background: rgba(255, 213, 79, 0.95);
          color: #333;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        /* === PRODUCT SHOWCASE === */
        .showcase-section {
          padding: 2rem;
          background: linear-gradient(135deg, var(--bg-light), #e3f2fd);
        }

        .showcase-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .showcase-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .showcase-title {
          font-size: 3rem;
          font-weight: 800;
          color: var(--primary);
          margin: 0 0 1rem 0;
        }

        .showcase-subtitle {
          font-size: 1.2rem;
          color: var(--text-light);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .showcase-card {
          background: var(--white);
          border-radius: var(--border-radius);
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: var(--transition);
        }

        .showcase-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-hover);
        }

        .showcase-card-image-container {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .showcase-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .showcase-card-image:hover {
          transform: scale(1.05);
        }

        .showcase-card-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(45deg, #ff6a00, #ff3d00);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .showcase-card-content {
          padding: 2rem;
        }

        .showcase-card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0 0 1rem 0;
        }

        .showcase-card-description {
          font-size: 1rem;
          color: var(--text-light);
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
        }

        .showcase-card-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .showcase-feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #555;
        }

        .showcase-feature-icon {
          color: var(--success);
          font-size: 1rem;
        }

        .showcase-footer {
          text-align: center;
        }

        .showcase-cta-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2.5rem;
          background: linear-gradient(45deg, var(--primary), var(--primary-light));
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          transition: var(--transition);
          box-shadow: 0 8px 25px rgba(199, 14, 89, 0.4);
        }

        .showcase-cta-icon {
          font-size: 1.2rem;
        }

        /* === WHY CHOOSE US === */
        .why-choose-section {
          padding: 2rem;
          background: var(--white);
        }

        .why-choose-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .why-choose-left {
          padding: 2rem 0;
        }

        .why-choose-title {
          font-size: 3rem;
          font-weight: 800;
          color: var(--primary);
          margin: 0 0 1.5rem 0;
          line-height: 1.2;
        }

        .why-choose-description {
          font-size: 1.2rem;
          color: var(--text-light);
          line-height: 1.7;
          margin: 0 0 1rem 0;
        }

        .why-choose-features {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .feature-highlight {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #fff5f5, #f0f8ff);
          border-radius: 15px;
          border: 1px solid rgba(199, 14, 89, 0.1);
        }

        .feature-highlight-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: linear-gradient(45deg, var(--primary), var(--primary-light));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .feature-highlight-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0 0 0.5rem 0;
        }

        .feature-highlight-description {
          font-size: 1rem;
          color: var(--text-light);
          line-height: 1.5;
          margin: 0;
        }

        .why-choose-right {
          position: relative;
        }

        .why-choose-image-container {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .why-choose-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }

        .why-choose-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          padding: 2rem;
          color: white;
        }

        .why-choose-overlay-content {
          text-align: center;
        }

        .why-choose-overlay-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .why-choose-overlay-text {
          font-size: 1rem;
          opacity: 0.9;
          margin: 0;
        }

        /* === CONTACT SECTION === */
        .modern-contact-section {
          padding: 2rem;
          background: linear-gradient(135deg, #fff7f7, #ffeaea);
        }

        .modern-contact-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }

        .contact-left-panel {
          color: white;
          padding: 2rem;
        }

        .contact-panel-title {
          font-size: 2rem;
          font-weight: 800;
          margin: 0 0 1rem 0;
          color: var(--primary);
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .contact-info-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--white);
          border-radius: 15px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .contact-info-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 213, 79, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
        }

        .contact-info-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: var(--accent);
        }

        .contact-info-content {
          font-size: 0.95rem;
          line-height: 1.5;
          opacity: 0.9;
          margin: 0;
          color: #000;
        }

        .contact-form-panel {
          background: var(--white);
          border-radius: var(--border-radius);
          padding: 3rem;
          box-shadow: var(--shadow);
        }

        .form-header-style {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .form-title-style {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0 0 0.5rem 0;
        }

        .form-subtitle-style {
          font-size: 1rem;
          color: var(--text-light);
          margin: 0;
        }

        .modern-form-style {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row-style {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .modern-input-style,
        .modern-select-style,
        .modern-textarea-style {
          padding: 1rem 1.5rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          outline: none;
          transition: var(--transition);
          background: #fafafa;
        }

        .modern-input-style:focus,
        .modern-select-style:focus,
        .modern-textarea-style:focus {
          border-color: var(--primary);
          background: var(--white);
          box-shadow: 0 0 0 3px rgba(199, 14, 89, 0.1);
        }

        .modern-select-style {
          cursor: pointer;
        }

        .modern-textarea-style {
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
        }

        .modern-submit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.2rem 2rem;
          background: linear-gradient(45deg, var(--primary), var(--primary-light));
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 8px 25px rgba(199, 14, 89, 0.3);
        }

        .modern-submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(199, 14, 89, 0.4);
        }

        .modern-success-style {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: linear-gradient(45deg, var(--success), #66BB6A);
          color: white;
          border-radius: 12px;
          font-weight: 600;
        }

        .modern-error-style {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: linear-gradient(45deg, var(--error), #ef5350);
          color: white;
          border-radius: 12px;
          font-weight: 600;
        }

        /* === RESPONSIVE FIXES (Mobile Only) === */
        @media (max-width: 968px) {
          .hero-grid-container,
          .why-choose-container,
          .modern-contact-container {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }

          .hero-action-buttons {
            justify-content: center;
          }

          .hero-main-image {
            height: 300px;
          }

          .why-choose-image {
            height: 300px;
          }

          .form-row-style {
            grid-template-columns: 1fr;
          }

          .contact-form-panel {
            padding: 2rem;
          }
        }

        @media (max-width: 640px) {
          .main-hero {
            padding: 1rem;
          }

          .hero-main-title {
            font-size: 2.5rem;
          }

          .showcase-title {
            font-size: 2.3rem;
          }

          .contact-form-panel {
            padding: 2rem;
          }

          .hero-cta-button,
          .hero-secondary-button,
          .showcase-cta-button,
          .modern-submit-button {
            font-size: 0.95rem;
            padding: 0.7rem 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .showcase-section,
          .why-choose-section,
          .modern-contact-section {
            padding: 2rem 1rem;
          }

          .showcase-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .hero-stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
            max-width: 300px;
            margin: 1.5rem auto;
          }

          .contact-info-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .form-row-style {
            grid-template-columns: 1fr;
          }

          .modern-input-style,
          .modern-select-style,
          .modern-textarea-style {
            width: 100%;
            box-sizing: border-box;
          }

          .showcase-footer {
            display: flex;
            justify-content: center;
            padding: 0 1rem;
          }

          .showcase-cta-button {
            width: 100%;
            max-width: 400px;
            justify-content: center;
          }

          .hero-main-image,
          .why-choose-image {
            height: 280px !important;
            object-fit: cover;
          }

          .form-title-style,
          .form-subtitle-style {
            text-align: center;
          }
        }
      `}</style>

      <Header />

      {/* 🔥 POPUP MODAL - Insert Here */}
{isRenderPopup && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: isVisible ? 'auto' : 'none',
  }}>
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      width: '90%',
      maxWidth: '600px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      transform: isVisible ? 'scale(1)' : 'scale(0.95)',
      transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    }}>
      {/* Popup Content */}
      <div style={{
        backgroundColor: '#C30E59',
        color: 'white',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <FiAlertTriangle size={20} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
            Important
          </h2>
        </div>
        <button 
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '5px',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'rotate(90deg)'}
          onMouseLeave={(e) => e.target.style.transform = 'rotate(0deg)'}
        >
          <FiX />
        </button>
      </div>

      <div style={{ 
        padding: '25px',
        maxHeight: '60vh', 
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ margin: 0, color: '#333', lineHeight: '1.6' }}>
            As per 2018 Supreme Court Order, online sale of firecrackers is NOT permitted. 
            We value our customers and at the same time, we respect the jurisdiction.
          </p>
          
          <p style={{ margin: 0, color: '#333', lineHeight: '1.6' }}>
            We request our customers to:
          </p>
          
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>Select your products in the Estimate Page to see your estimation</li>
            <li>Submit the required crackers through the Get Estimate Button</li>
          </ul>
          
          <p style={{ margin: 0, color: '#333', lineHeight: '1.6' }}>
            We will contact you within 2 hours and confirm the order through phone call. 
            Please add and submit your enquiries and enjoy your Diwali with SRI GOKILAA CRACKERS.
          </p>
          
          <p style={{ margin: 0, color: '#333', lineHeight: '1.6' }}>
            SRI GOKILAA CRACKERS is a shop following 100% legal & statutory compliances and 
            all our shops, go-downs are maintained as per the explosive acts. We send 
            the parcels through registered and legal transport service providers as like 
            every other major companies in Sivakasi is doing so.
          </p>
        </div>
      </div>

      <div style={{
        padding: '20px',
        textAlign: 'center',
        borderTop: '1px solid #f0f0f0',
        background: '#f9f9f9',
      }}>
        <button
          onClick={handleClose}
          style={{
            background: 'linear-gradient(to right, #ff5e62, #ff9966)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: '12px 30px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(255, 94, 98, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(255, 94, 98, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(255, 94, 98, 0.3)';
          }}
        >
          <FiCheck /> I Understand
        </button>
      </div>
    </div>
  </div>
)}


      {/* Main Hero Section (Original Style) */}
      <section className="main-hero">
        <div className="hero-grid-container">
          <div className="hero-text-section">
            <div className="hero-content-wrapper">
              
              <h1 className="hero-main-title">
                Light Up Your <span className="hero-accent-text">Celebrations</span>
              </h1>
              <p className="hero-description">
                Experience the magic of traditional Indian fireworks with Sky Blaze Crackers. 
                From intimate family gatherings to grand festivals, we bring color, joy, 
                and spectacular moments to every celebration.
              </p>
              <div className="hero-stats-grid">
                <div className="hero-stat-item">
                  <h3 className="hero-stat-number">10+</h3>
                  <p className="hero-stat-label">Years Experience</p>
                </div>
                <div className="hero-stat-item">
                  <h3 className="hero-stat-number">5000+</h3>
                  <p className="hero-stat-label">Happy Customers</p>
                </div>
                <div className="hero-stat-item">
                  <h3 className="hero-stat-number">100%</h3>
                  <p className="hero-stat-label">Legal & Safe</p>
                </div>
              </div>

            </div>
          </div>

          <div className="hero-image-section">
            <div className="hero-main-image-container">
              <img src={about_img} alt="Sky Blaze Store" className="hero-main-image" />
              <div className="hero-image-overlay">
                <span className="hero-badge"><FiShield style={{ marginRight: '5px' }} /> Trusted</span>
                <span className="hero-badge">🎆 Premium</span>
              </div>
            </div>

                          <div className="hero-action-buttons">
                <Link to="/product" className="hero-cta-button">
                  <FiGift style={{ fontSize: '1.2rem' }} /> Explore Products
                </Link>
                <Link to="/about" className="hero-secondary-button">
                  <FiEye style={{ fontSize: '1.2rem' }} /> Our Story
                </Link>
              </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="showcase-section">
        <div className="showcase-container">
          <div className="showcase-header">
            <h2 className="showcase-title">Spectacular Fireworks Collection</h2>
            <p className="showcase-subtitle">
              Discover our handpicked selection of premium crackers designed to create unforgettable moments
            </p>
          </div>

          <div className="showcase-grid">
            <ProductShowcaseCard image={new_img} category="Ground Effects" title="Dancing Fountains" description="Mesmerizing ground displays with cascading sparks and vibrant colors that dance across the night sky." features={["5-10 minute duration", "Safe for home use", "Multiple color options"]} />
            <ProductShowcaseCard image={new_img2} category="Aerial Display" title="Sky Blooms" description="Breathtaking aerial fireworks that paint the sky with spectacular bursts and patterns." features={["High altitude reach", "Professional grade", "Synchronized effects"]} />
            <ProductShowcaseCard image={new_img3} category="Spinning Wonders" title="Galaxy Wheels" description="Hypnotic spinning crackers with whistling sounds and rainbow color transitions." features={["360° rotation", "Musical whistles", "Long-lasting effect"]} />
            <ProductShowcaseCard image={new_img4} category="Silver Collection" title="Moonlight Magic" description="Elegant silver fountains perfect for sophisticated celebrations and intimate gatherings." features={["Eco-friendly formula", "Low noise level", "Extended burn time"]} />
            <ProductShowcaseCard image={pro_img} category="Premium Collection" title="Golden Thunder" description="Powerful crackers with golden sparks and thunderous sounds for grand celebrations." features={["Professional grade", "15-second display", "Weather resistant"]} />
            <ProductShowcaseCard image={bomb} category="Classic Collection" title="Bomb Collection" description="Powerful, traditional Indian bombs that deliver loud cracks and thrilling bursts." features={["Loud sound bursts (120+ dB)", "Available in small & large packs", "Ideal for Diwali and New Year", "Safe when used responsibly"]} />
          </div>

          <div className="showcase-footer">
            <Link to="/product" className="showcase-cta-button">
              Discover Full Collection <FiChevronRight className="showcase-cta-icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="why-choose-container">
          <div className="why-choose-left">
            <h2 className="why-choose-title">Why Sky Blaze Stands Apart</h2>
            <p className="why-choose-description">
              For over a decade, we've been the trusted name in Virudhunagar's fireworks industry.
            </p>
            <div className="why-choose-features">
              <FeatureHighlight icon={<FiAward />} title="Quality Guaranteed" description="Hand-tested products with consistent performance and brilliant effects" />
              <FeatureHighlight icon={<FiHeart />} title="Customer First" description="Personalized service with phone confirmation and expert guidance" />
              <FeatureHighlight icon={<FiWind />} title="Eco-Conscious" description="Low-smoke, reduced-noise options for environmentally aware celebrations" />
            </div>
          </div>
          <div className="why-choose-right">
            <div className="why-choose-image-container">
              <img src={celeb} alt="Fireworks Display" className="why-choose-image" />
              <div className="why-choose-overlay">
                <div className="why-choose-overlay-content">
                  <h3 className="why-choose-overlay-title">Celebrating Life's Moments</h3>
                  <p className="why-choose-overlay-text">Making every festival unforgettable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="modern-contact-section">
        <div className="modern-contact-container">
          <div className="contact-left-panel">
            <h2 className="contact-panel-title">Let's Create Magic Together</h2>
            <div className="contact-info-grid">
              <ContactInfoItem icon={<FiMapPin />} title="Visit Our Store" content="4/1C Rajamuthu Nagar, Naranapuram Puthur, Virudhunagar" />
              <ContactInfoItem icon={<FiPhone />} title="Call Us Today" content="+91 9787009888" />
              <ContactInfoItem icon={<FiMail />} title="Email Support" content="skyblazecrackers0@gmail.com" />
              <ContactInfoItem icon={<FiClock />} title="Business Hours" content="Mon-Sat: 9AM-8PM | Sunday: Closed" />
            </div>
          </div>

          <div className="contact-form-panel">
            <div className="form-header-style">
              <h3 className="form-title-style">Send us a Message</h3>
              <p className="form-subtitle-style">We'll respond within 2 hours</p>
            </div>
            <form className="modern-form-style" onSubmit={handleContactSubmit}>
              <div className="form-row-style">
                <input type="text" name="name" placeholder="Full Name" className="modern-input-style" value={formData.name} onChange={handleInputChange} required />
                <input type="email" name="email" placeholder="Email Address" className="modern-input-style" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-row-style">
                <input type="tel" name="phone" placeholder="Phone Number" className="modern-input-style" value={formData.phone} onChange={handleInputChange} />
                <select name="subject" className="modern-select-style" value={formData.subject} onChange={handleInputChange}>
                  <option value="">Select Topic</option>
                  <option value="sales">Product Inquiry</option>
                  <option value="wholesale">Bulk Orders</option>
                  <option value="support">Customer Support</option>
                  <option value="other">General Question</option>
                </select>
              </div>
              <textarea name="message" placeholder="Tell us about your celebration plans..." className="modern-textarea-style" value={formData.message} onChange={handleInputChange} required></textarea>
              {submitStatus === 'success' && (
                <div className="modern-success-style">
                  <FiCheck /> Message sent successfully! We'll contact you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="modern-error-style">
                  <FiX /> Failed to send message. Please try again.
                </div>
              )}
              <button type="submit" className="modern-submit-button" disabled={isSubmittingContact}>
                {isSubmittingContact ? 'Sending...' : <> <FiSend /> Send Message </>}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

// Reusable Components
function ProductShowcaseCard({ image, category, title, description, features }) {
  return (
    <div className="showcase-card">
      <div className="showcase-card-image-container">
        <img src={image} alt={title} className="showcase-card-image" />
        <div className="showcase-card-badge">{category}</div>
      </div>
      <div className="showcase-card-content">
        <h3 className="showcase-card-title">{title}</h3>
        <p className="showcase-card-description">{description}</p>
        <ul className="showcase-card-features">
          {features.map((feature, idx) => (
            <li key={idx} className="showcase-feature-item">
              <FiCheck className="showcase-feature-icon" /> {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FeatureHighlight({ icon, title, description }) {
  return (
    <div className="feature-highlight">
      <div className="feature-highlight-icon">{icon}</div>
      <div className="feature-highlight-content">
        <h4 className="feature-highlight-title">{title}</h4>
        <p className="feature-highlight-description">{description}</p>
      </div>
    </div>
  );
}

function ContactInfoItem({ icon, title, content }) {
  return (
    <div className="contact-info-item">
      <div className="contact-info-icon">{icon}</div>
      <div>
        <h4 className="contact-info-title">{title}</h4>
        <p className="contact-info-content">{content}</p>
      </div>
    </div>
  );
}

export default Home;