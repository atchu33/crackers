import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import logo from "../assets/logo.jpg";
import axios from "axios";
import localforage from "localforage";
import API_BASE_URL from "./apiConfig";
import hero_bg from "../assets/pro_bg.jpg";
import pro_img from "../assets/crack.jpg";
import bomb from "../assets/bombabt.jpg";
import celeb from "../assets/celeb.jpg";
import new_img from  "../assets/fire crackers image2.png";
import new_img2 from  "../assets/fireworks.png";
import new_img3 from "../assets/fire racker image4.png";
import new_img4 from "../assets/fire cracker img 5.jpg";
import about_img from "../assets/about_img.png";
import Header from './HeaderLayouts';
import Footer from './FooterLayouts';
import pro_img2 from"../assets/fire_gif.gif";
import { FiCalendar, FiDollarSign, FiAward,FiCheck,FiX,FiZap,FiStar,FiTruck } from 'react-icons/fi';
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
    FiAlertTriangle,
    FiUser,
    FiWind,
    FiDroplet,
    FiShield,
    FiAlertCircle,
    FiBookOpen,
    FiEye,
    FiHeart,
    FiGift
  } from 'react-icons/fi';

function Home() {
  // State for controlling the popup
  const [showPopup, setShowPopup] = useState(true); 
  const [isVisible, setIsVisible] = useState(false);
  const [isRenderPopup, setIsRenderPopup] = useState(false);

  // Check on component mount if popup has been shown before
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    if (!hasSeenPopup) {
      setShowPopup(true);
    }
  }, []);

  // Handle animation states
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

  // Close handler
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowPopup(false);
      localStorage.setItem('hasSeenPopup', 'true');
    }, 300);
  };

  // Contact form state
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

  // Contact form handler
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
      if (!token) {
        throw new Error("No authentication token found");
      }

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
        
        setTimeout(() => {
          setSubmitStatus(null);
        }, 1000);
      } else {
        throw new Error(response.data.statusDesc || "Failed to send message");
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      setSubmitStatus('error');
      alert(`Failed to send message: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Header />
      
      {/* Main Hero Section with Side-by-Side Layout */}
      <section style={mainHeroStyle}>
        <div style={heroGridContainer}>
          {/* Left: Text Content */}
          <div style={heroTextSection}>
            <div style={heroContentWrapper}>
              
              <h1 style={heroMainTitle}>
                Light Up Your 
                <span style={heroAccentText}> Celebrations</span>
              </h1>
              <p style={heroDescription}>
                Experience the magic of traditional Indian fireworks with Sky Blaze Crackers. 
                From intimate family gatherings to grand festivals, we bring color, joy, 
                and spectacular moments to every celebration.
              </p>
              
              <div style={heroStatsGrid}>
                <div style={heroStatItem}>
                  <h3 style={heroStatNumber}>10+</h3>
                  <p style={heroStatLabel}>Years Experience</p>
                </div>
                <div style={heroStatItem}>
                  <h3 style={heroStatNumber}>5000+</h3>
                  <p style={heroStatLabel}>Happy Customers</p>
                </div>
                <div style={heroStatItem}>
                  <h3 style={heroStatNumber}>100%</h3>
                  <p style={heroStatLabel}>Legal & Safe</p>
                </div>
              </div>

             
            </div>
          </div>

          {/* Right: Image Gallery */}
          <div style={heroImageSection}>
            <div style={heroImageGrid}>
              <div style={heroMainImageContainer}>
                <img src={about_img} alt="Sky Blaze Store" style={heroMainImage} />
                <div style={heroImageOverlay}>
                  <span style={heroBadgeStyle}> <FiShield style={{ marginRight: '5px' }} /> Trusted</span>
                  <span style={heroBadgeStyle}>🎆 Premium</span>
                </div>
              </div>
               <div style={heroActionButtons}>
                <Link to="/product" style={heroCtaButton}>
                  <FiGift style={heroButtonIcon} />
                  Explore Products
                </Link>
                <Link to="/about" style={heroSecondaryButton}>
                  <FiEye style={heroButtonIcon} />
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase with Cards Layout */}
      <section style={showcaseSection}>
        <div style={showcaseContainer}>
          <div style={showcaseHeader}>
            <h2 style={showcaseTitle}>Spectacular Fireworks Collection</h2>
            <p style={showcaseSubtitle}>
              Discover our handpicked selection of premium crackers designed to create unforgettable moments
            </p>
          </div>

          <div style={showcaseGrid}>
            <ProductShowcaseCard
              image={new_img}
              category="Ground Effects"
              title="Dancing Fountains"
              description="Mesmerizing ground displays with cascading sparks and vibrant colors that dance across the night sky."
              features={["5-10 minute duration", "Safe for home use", "Multiple color options"]}
            />
            
            <ProductShowcaseCard
              image={new_img2}
              category="Aerial Display"
              title="Sky Blooms"
              description="Breathtaking aerial fireworks that paint the sky with spectacular bursts and patterns."
              features={["High altitude reach", "Professional grade", "Synchronized effects"]}
            />
            
            <ProductShowcaseCard
              image={new_img3}
              category="Spinning Wonders"
              title="Galaxy Wheels"
              description="Hypnotic spinning crackers with whistling sounds and rainbow color transitions."
              features={["360° rotation", "Musical whistles", "Long-lasting effect"]}
            />
            
            <ProductShowcaseCard
              image={new_img4}
              category="Silver Collection"
              title="Moonlight Magic"
              description="Elegant silver fountains perfect for sophisticated celebrations and intimate gatherings."
              features={["Eco-friendly formula", "Low noise level", "Extended burn time"]}
            />
            
            <ProductShowcaseCard
              image={pro_img}
              category="Premium Collection"
              title="Golden Thunder"
              description="Powerful crackers with golden sparks and thunderous sounds for grand celebrations."
              features={["Professional grade", "15-second display", "Weather resistant"]}
            />
            
<ProductShowcaseCard
  image={bomb}
  category="Classic Collection"
  title="Bomb Collection"
  description="Powerful, traditional Indian bombs that deliver loud cracks and thrilling bursts."
  features={[
    "Loud sound bursts (120+ dB)",
    "Available in small & large packs",
    "Ideal for Diwali and New Year",
    "Safe when used responsibly"
  ]}
/>
          </div>

          <div style={showcaseFooter}>
            <Link to="/product" style={showcaseCtaButton}>
              Discover Full Collection
              <FiChevronRight style={showcaseCtaIcon} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with Horizontal Layout */}
      <section style={whyChooseSection}>
        <div style={whyChooseContainer}>
          <div style={whyChooseLeft}>
            <h2 style={whyChooseTitle}>Why Sky Blaze Stands Apart</h2>
            <p style={whyChooseDescription}>
              For over a decade, we've been the trusted name in Virudhunagar's fireworks industry. 
            </p>
            
            <div style={whyChooseFeatures}>
              <FeatureHighlight
                icon={<FiAward />}
                title="Quality Guaranteed"
                description="Hand-tested products with consistent performance and brilliant effects"
              />
              <FeatureHighlight
                icon={<FiHeart />}
                title="Customer First"
                description="Personalized service with phone confirmation and expert guidance"
              />
              <FeatureHighlight
                icon={<FiWind />}
                title="Eco-Conscious"
                description="Low-smoke, reduced-noise options for environmentally aware celebrations"
              />
            </div>
          </div>

          <div style={whyChooseRight}>
            <div style={whyChooseImageContainer}>
              <img src={celeb} alt="Fireworks Display" style={whyChooseImage} />
              <div style={whyChooseOverlay}>
                <div style={whyChooseOverlayContent}>
                  <h3 style={whyChooseOverlayTitle}>Celebrating Life's Moments</h3>
                  <p style={whyChooseOverlayText}>Making every festival unforgettable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section with Modern Form */}
      <section style={modernContactSection}>
        <div style={modernContactContainer}>
          <div style={contactLeftPanel}>
            <h2 style={contactPanelTitle}>Let's Create Magic Together</h2>
            
            <div style={contactInfoGrid}>
              <ContactInfoItem
                icon={<FiMapPin />}
                title="Visit Our Store"
                content="4/1C Rajamuthu Nagar, Naranapuram Puthur, Virudhunagar"
              />
              <ContactInfoItem
                icon={<FiPhone />}
                title="Call Us Today"
                content="+91 9787009888"
              />
              <ContactInfoItem
                icon={<FiMail />}
                title="Email Support"
                content="skyblazecrackers0@gmail.com"
              />
              <ContactInfoItem
                icon={<FiClock />}
                title="Business Hours"
                content="Mon-Sat: 9AM-8PM | Sunday: Closed"
              />
            </div>
          </div>

          <div style={contactFormPanel}>
            <div style={formHeaderStyle}>
              <h3 style={formTitleStyle}>Send us a Message</h3>
              <p style={formSubtitleStyle}>We'll respond within 2 hours</p>
            </div>
            
            <form style={modernFormStyle} onSubmit={handleContactSubmit}>
              <div style={formRowStyle}>
                <input 
                  type="text" name="name" placeholder="Full Name"
                  style={modernInputStyle} value={formData.name}
                  onChange={handleInputChange} required
                />
                <input 
                  type="email" name="email" placeholder="Email Address"
                  style={modernInputStyle} value={formData.email}
                  onChange={handleInputChange} required
                />
              </div>
              
              <div style={formRowStyle}>
                <input 
                  type="tel" name="phone" placeholder="Phone Number"
                  style={modernInputStyle} value={formData.phone}
                  onChange={handleInputChange}
                />
                <select 
                  name="subject" style={modernSelectStyle}
                  value={formData.subject} onChange={handleInputChange}
                >
                  <option value="">Select Topic</option>
                  <option value="sales">Product Inquiry</option>
                  <option value="wholesale">Bulk Orders</option>
                  <option value="support">Customer Support</option>
                  <option value="other">General Question</option>
                </select>
              </div>
              
              <textarea 
                name="message" placeholder="Tell us about your celebration plans..." rows="4"
                style={modernTextareaStyle} value={formData.message}
                onChange={handleInputChange} required
              ></textarea>

              {submitStatus === 'success' && (
                <div style={modernSuccessStyle}>
                  <FiCheck /> Message sent successfully! We'll contact you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div style={modernErrorStyle}>
                  <FiX /> Failed to send message. Please try again.
                </div>
              )}

              <button type="submit" style={modernSubmitButton} disabled={isSubmittingContact}>
                {isSubmittingContact ? 'Sending...' : (
                  <>
                    <FiSend />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

// Product Showcase Card Component
function ProductShowcaseCard({ image, category, title, description, features }) {
  return (
    <div style={showcaseCardStyle}>
      <div style={showcaseCardImageContainer}>
        <img src={image} alt={title} style={showcaseCardImage} />
        <div style={showcaseCardBadge}>{category}</div>
      </div>
      <div style={showcaseCardContent}>
        <h3 style={showcaseCardTitle}>{title}</h3>
        <p style={showcaseCardDescription}>{description}</p>
        <ul style={showcaseCardFeatures}>
          {features.map((feature, index) => (
            <li key={index} style={showcaseFeatureItem}>
              <FiCheck style={showcaseFeatureIcon} />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Feature Highlight Component
function FeatureHighlight({ icon, title, description }) {
  return (
    <div style={featureHighlightStyle}>
      <div style={featureHighlightIcon}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div style={featureHighlightContent}>
        <h4 style={featureHighlightTitle}>{title}</h4>
        <p style={featureHighlightDescription}>{description}</p>
      </div>
    </div>
  );
}

// Contact Info Item Component
function ContactInfoItem({ icon, title, content }) {
  return (
    <div style={contactInfoItemStyle}>
      <div style={contactInfoIcon}>
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div>
        <h4 style={contactInfoTitle}>{title}</h4>
        <p style={contactInfoContent}>{content}</p>
      </div>
    </div>
  );
}

// STYLES

// Main Hero Section
const mainHeroStyle = {
  minHeight: '50vh',
  background: `linear-gradient(45deg, rgba(255, 107, 0, 0.95), rgba(199, 14, 89, 0.85)), url(${hero_bg}) center/cover fixed`,
  display: 'flex',
  alignItems: 'center',
  padding: '2rem',
};

const heroGridContainer = {
  maxWidth: '1400px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '1.2fr 1fr',
  gap: '4rem',
  alignItems: 'center',
  '@media (max-width: 968px)': {
    gridTemplateColumns: '1fr',
    gap: '3rem',
    textAlign: 'center'
  }
};

const heroTextSection = {
  color: 'white',
};

const heroContentWrapper = {
  maxWidth: '600px',
};

const heroBadgeStyle = {
  display: 'inline-block',
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  padding: '0.5rem 1.5rem',
  borderRadius: '50px',
  fontSize: '0.9rem',
  fontWeight: '600',
  marginBottom: '1.5rem',
  border: '1px solid rgba(255, 255, 255, 0.3)',
};

const heroMainTitle = {
  fontSize: 'clamp(3rem, 6vw, 5rem)',
  fontWeight: '800',
  lineHeight: '1.1',
  marginBottom: '1.5rem',
  marginTop: '0px',
  textShadow: '0 4px 20px rgba(0,0,0,0.5)',
};

const heroAccentText = {
  color: '#FFD54F',
  textShadow: '0 0 30px rgba(255, 213, 79, 0.6)',
};

const heroDescription = {
  fontSize: '1.2rem',
  lineHeight: '1.6',
  marginBottom: '2.5rem',
  opacity: 0.95,
};

const heroStatsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1.5rem',
  marginBottom: '2.5rem',
};

const heroStatItem = {
  textAlign: 'center',
  padding: '1rem',
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
};

const heroStatNumber = {
  fontSize: '2rem',
  fontWeight: '700',
  margin: '0 0 0.5rem 0',
  color: '#FFD54F',
};

const heroStatLabel = {
  fontSize: '0.9rem',
  margin: '0',
  opacity: 0.9,
};

const heroActionButtons = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
  paddingTop: '20px',
};

const heroCtaButton = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.5rem', // Reduced padding for compact look
  background: 'linear-gradient(45deg, #FFD54F, #FFC107)',
  color: '#333',
  textDecoration: 'none',
  borderRadius: '50px',
  fontWeight: '700',
  fontSize: '1rem', // Slightly smaller for balance
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(255, 213, 79, 0.4)',
  lineHeight: '1.2',
};

const heroSecondaryButton = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.5rem', // Match height with primary
  background: 'transparent',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '50px',
  fontWeight: '600',
  fontSize: '1rem',
  border: '2px solid rgba(255, 255, 255, 0.8)',
  transition: 'all 0.3s ease',
  lineHeight: '1.2',
};


const heroButtonIcon = {
  fontSize: '1.2rem',
};

// Hero Image Section
const heroImageSection = {
  position: 'relative',
};

const heroImageGrid = {
  // display: 'grid',
  // gap: '1rem',
  // gridTemplateRows: '2fr 1fr',
};

const heroMainImageContainer = {
  position: 'relative',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
};

const heroMainImage = {
  width: '100%',
  height: '350px',
  objectFit: 'cover',
};

const heroImageOverlay = {
  position: 'absolute',
  top: '1rem',
  left: '1rem',
  right: '1rem',
  display: 'flex',
  justifyContent: 'space-between'
};

const heroImageBadge = {
  background: 'rgba(255, 213, 79, 0.95)',
  color: '#333',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: '600',
};

const heroSmallImagesContainer = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
};

const heroSmallImage = {
  width: '100%',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '15px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
};

// Product Showcase Section
const showcaseSection = {
  padding: '2rem 2rem',
  background: 'linear-gradient(135deg, #f8f9fa, #e3f2fd)',
};

const showcaseContainer = {
  maxWidth: '1400px',
  margin: '0 auto',
};

const showcaseHeader = {
  textAlign: 'center',
  marginBottom: '4rem',
};

const showcaseTitle = {
  fontSize: '3rem',
  fontWeight: '800',
  color: '#C30E59',
  marginBottom: '1rem',
  marginTop: '0',
};

const showcaseSubtitle = {
  fontSize: '1.2rem',
  color: '#666',
  maxWidth: '600px',
  margin: '0 auto',
  lineHeight: '1.6',
};

const showcaseGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '2rem',
  marginBottom: '3rem',
};

const showcaseCardStyle = {
  background: 'white',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  ':hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  }
};

const showcaseCardImageContainer = {
  position: 'relative',
  height: '250px',
  overflow: 'hidden',
};

const showcaseCardImage = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
};

const showcaseCardBadge = {
  position: 'absolute',
  top: '1rem',
  left: '1rem',
  background: 'linear-gradient(45deg, #ff6a00, #ff3d00)',
  color: 'white',
  padding: '0.3rem 0.8rem',
  borderRadius: '15px',
  fontSize: '0.8rem',
  fontWeight: '600',
};

const showcaseCardContent = {
  padding: '2rem',
};

const showcaseCardTitle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: '#C30E59',
  marginBottom: '1rem',
};

const showcaseCardDescription = {
  fontSize: '1rem',
  color: '#666',
  lineHeight: '1.6',
  marginBottom: '1.5rem',
};

const showcaseCardFeatures = {
  listStyle: 'none',
  padding: '0',
  margin: '0',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const showcaseFeatureItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.9rem',
  color: '#555',
};

const showcaseFeatureIcon = {
  color: '#4CAF50',
  fontSize: '1rem',
};

const showcaseFooter = {
  textAlign: 'center',
};

const showcaseCtaButton = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '1rem 2.5rem',
  background: 'linear-gradient(45deg, #C30E59, #E91E63)',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '50px',
  fontWeight: '700',
  fontSize: '1.1rem',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 25px rgba(199, 14, 89, 0.4)',
};

const showcaseCtaIcon = {
  fontSize: '1.2rem',
};

// Why Choose Us Section
const whyChooseSection = {
  padding: '2rem 2rem',
  background: '#fff',
};

const whyChooseContainer = {
  maxWidth: '1400px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '1.2fr 1fr',
  gap: '4rem',
  alignItems: 'center',
  '@media (max-width: 968px)': {
    gridTemplateColumns: '1fr',
    gap: '3rem',
  }
};

const whyChooseLeft = {
  padding: '2rem 0',
};

const whyChooseTitle = {
  fontSize: '3rem',
  fontWeight: '800',
  color: '#C30E59',
  marginBottom: '1.5rem',
  lineHeight: '1.2',
  marginTop: '0',
};

const whyChooseDescription = {
  fontSize: '1.2rem',
  color: '#666',
  lineHeight: '1.7',
  marginBottom: '1rem',
};

const whyChooseFeatures = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
};

const featureHighlightStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
  padding: '1.5rem',
  background: 'linear-gradient(135deg, #fff5f5, #f0f8ff)',
  borderRadius: '15px',
  border: '1px solid rgba(199, 14, 89, 0.1)',
};

const featureHighlightIcon = {
  width: '50px',
  height: '50px',
  borderRadius: '12px',
  background: 'linear-gradient(45deg, #C30E59, #E91E63)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '1.2rem',
  flexShrink: 0,
};

const featureHighlightContent = {
  flex: 1,
};

const featureHighlightTitle = {
  fontSize: '1.2rem',
  fontWeight: '700',
  color: '#C30E59',
  marginBottom: '0.5rem',
  margin: '0 0 0.5rem 0',
};

const featureHighlightDescription = {
  fontSize: '1rem',
  color: '#666',
  lineHeight: '1.5',
  margin: '0',
};

const whyChooseRight = {
  position: 'relative',
};

const whyChooseImageContainer = {
  position: 'relative',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
};

const whyChooseImage = {
  width: '100%',
  height: '400px',
  objectFit: 'cover',
};

const whyChooseOverlay = {
  position: 'absolute',
  bottom: '0',
  left: '0',
  right: '0',
  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
  padding: '2rem',
  color: 'white',
};

const whyChooseOverlayContent = {
  textAlign: 'center',
};

const whyChooseOverlayTitle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  marginBottom: '0.5rem',
  margin: '0 0 0.5rem 0',
};

const whyChooseOverlayText = {
  fontSize: '1rem',
  opacity: 0.9,
  margin: '0',
};

// Modern Contact Section
const modernContactSection = {
  padding: '2rem 2rem',
 background: "linear-gradient(135deg, #fff7f7, #ffeaea)",
};

const modernContactContainer = {
  maxWidth: '1400px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '4rem',
  alignItems: 'stretch',
  '@media (max-width: 968px)': {
    gridTemplateColumns: '1fr',
    gap: '3rem',
  }
};

const contactLeftPanel = {
  color: 'white',
  padding: '2rem',
};

const contactPanelTitle = {
  fontSize: '2rem',
  fontWeight: '800',
  marginBottom: '1rem',
  marginTop: '0',
  color: '#C30E59',
};


const contactInfoGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1rem',
};

const contactInfoItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
  padding: '1.5rem',
  background: '#fff',
  borderRadius: '15px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

const contactInfoIcon = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  background: 'rgba(255, 213, 79, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#FFD54F',
  flexShrink: 0,
};

const contactInfoTitle = {
  fontSize: '1.1rem',
  fontWeight: '600',
  marginBottom: '0.5rem',
  margin: '0 0 0.5rem 0',
  color: '#FFD54F',
};

const contactInfoContent = {
  fontSize: '0.95rem',
  lineHeight: '1.5',
  opacity: 0.9,
  margin: '0',
  color: '#000'
};

// Contact Form Panel
const contactFormPanel = {
  background: 'white',
  borderRadius: '20px',
  padding: '3rem',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
};

const formHeaderStyle = {
  textAlign: 'center',
  marginBottom: '2.5rem',
};

const formTitleStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#C30E59',
  marginBottom: '0.5rem',
  marginTop: '0',
};

const formSubtitleStyle = {
  fontSize: '1rem',
  color: '#666',
  margin: '0',
};

const modernFormStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const formRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
  '@media (max-width: 640px)': {
    gridTemplateColumns: '1fr',
  }
};

const modernInputStyle = {
  padding: '1rem 1.5rem',
  borderRadius: '12px',
  border: '2px solid #e0e0e0',
  fontSize: '1rem',
  outline: 'none',
  transition: 'all 0.3s ease',
  background: '#fafafa',
  ':focus': {
    borderColor: '#C30E59',
    background: 'white',
    boxShadow: '0 0 0 3px rgba(199, 14, 89, 0.1)',
  }
};

const modernSelectStyle = {
  ...modernInputStyle,
  cursor: 'pointer',
};

const modernTextareaStyle = {
  ...modernInputStyle,
  resize: 'vertical',
  minHeight: '120px',
  fontFamily: 'inherit',
};

const modernSubmitButton = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '1.2rem 2rem',
  background: 'linear-gradient(45deg, #C30E59, #E91E63)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '1.1rem',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 25px rgba(199, 14, 89, 0.3)',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 30px rgba(199, 14, 89, 0.4)',
  }
};

const modernSuccessStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '1rem',
  background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
  color: 'white',
  borderRadius: '12px',
  fontSize: '1rem',
  fontWeight: '600',
};

const modernErrorStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '1rem',
  background: 'linear-gradient(45deg, #f44336, #ef5350)',
  color: 'white',
  borderRadius: '12px',
  fontSize: '1rem',
  fontWeight: '600',
};

export default Home;