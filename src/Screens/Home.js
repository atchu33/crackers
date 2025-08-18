import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import logo from "../assets/logo.jpg";
import axios from "axios";
import localforage from "localforage";
import API_BASE_URL from "./apiConfig";
import hero_bg from "../assets/pro_bg.jpg";
import pro_img from "../assets/firecracker_img.webp";
import new_img from  "../assets/fire crackers image2.png";
import new_img2 from  "../assets/fireworks.png";
import new_img3 from "../assets/fire racker image4.png";
import new_img4 from "../assets/fire cracker img 5.jpg";
import about_img from "../assets/about_img.png";
import Header from './HeaderLayouts';
import Footer from './FooterLayouts';
import pro_img2 from"../assets/fire_gif.gif";
import { FiCalendar, FiDollarSign, FiAward,FiCheck,FiX } from 'react-icons/fi';
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

   

 
 
  } from 'react-icons/fi';
 
function Home() {
 // State for controlling the popup
 const [showPopup, setShowPopup] = useState(true); 
  const [isVisible, setIsVisible] = useState(false);
  const [isRenderPopup, setIsRenderPopup] = useState(false);
// const pro_img2 = `${process.env.PUBLIC_URL}/Img/fire_gif.webp`;

  // Check on component mount if popup has been shown before
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    if (!hasSeenPopup) {
      setShowPopup(true); // Show only if not seen before
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

  // Close handler - also mark as seen
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowPopup(false);
      localStorage.setItem('hasSeenPopup', 'true'); // Remember user saw it
    }, 300);
  };
// Add this state at the top of your component with other state declarations
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  companyId: 1 // Default company ID as per your requirements
});

const [isSubmittingContact, setIsSubmittingContact] = useState(false);
const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

// Add this handler function
const handleContactSubmit = async (e) => {
  e.preventDefault();
  
  // Enhanced validation
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

    // Prepare FormData
    const formDataToSend = new FormData();
    formDataToSend.append('Name', formData.name);
    formDataToSend.append('Email', formData.email);
    formDataToSend.append('Phone', formData.phone || ''); // Make optional
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
      
      // Clear success message after 3 seconds
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
// Update the form input change handler
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
 {/*
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
  '@media (max-width: 480px)': {
    width: '95%',
    maxHeight: '90vh'
  }
}}>
            
            <div style={{
              background: 'linear-gradient(to right, #ff5e62, #ff9966)',
              color: 'white',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '15px'
              }}>
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
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '1.25rem', 
                  fontWeight: '600',
                  lineHeight: '1.4'
                }}>
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
                  ':hover': {
                    transform: 'rotate(90deg)'
                  }
                }}
              >
                <FiX />
              </button>
            </div>

           
            <div style={{ 
              padding: '25px',
              maxHeight: '60vh', 
              overflowY: 'auto',
              opacity: isVisible ? 1 : 0.7,
              transform: isVisible ? 'scale(1)' : 'scale(0.95)',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}>
                <p style={{
                  margin: 0,
                  color: '#333',
                  lineHeight: '1.6',
                  fontSize: '1rem',
                }}>
                  As per 2018 Supreme Court Order, online sale of firecrackers is NOT permitted. 
                  We value our customers and at the same time, we respect the jurisdiction.
                </p>
                
                <p style={{
                  margin: 0,
                  color: '#333',
                  lineHeight: '1.6',
                  fontSize: '1rem',
                }}>
                  We request our customers to:
                </p>
                
                <ul style={{
                  margin: 0,
                  paddingLeft: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}>
                  <li>Select your products in the Estimate Page to see your estimation</li>
                  <li>Submit the required crackers through the Get Estimate Button</li>
                </ul>
                
                <p style={{
                  margin: 0,
                  color: '#333',
                  lineHeight: '1.6',
                  fontSize: '1rem',
                }}>
                  We will contact you within 2 hours and confirm the order through phone call. 
                  Please add and submit your enquiries and enjoy your Diwali with SRI GOKILAA CRACKERS.
                </p>
                
                <p style={{
                  margin: 0,
                  color: '#333',
                  lineHeight: '1.6',
                  fontSize: '1rem',
                }}>
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
                  ':hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(255, 94, 98, 0.4)'
                  }
                }}
              >
                <FiCheck />
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
*/}
   {/* Hero Section */}
   
<section style={{...heroSectionStyle, backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${hero_bg})`}}>
 <div style={{
  position: 'absolute',
  left: '0%',
  top: '70%',
  transform: 'translateY(-50%)',
  zIndex: 1,
  '@media (max-width: 768px)': {
    display: 'none' // Hide on mobile to save space
  }
}}>
   
      <img 
        src={pro_img2} 
        alt="Animated fireworks" 
        style={{
          width: '250px',
          height: '250px',
          objectFit: 'contain',
          borderRadius: '15px',
         
          '@media (max-width: 768px)': {
            width: '150px',
            height: '150px'
          }
        }} 
      />
    </div>
  <div style={{
    position: 'absolute',
    right: '0%',
    top: '15%',
    transform: 'translateY(-50%)',
    zIndex: 1,
    '@media (max-width: 768px)': {
      right: '5%',
      width: '150px'
    }
  }}>
   
      <img 
        src={pro_img2} 
        alt="Animated fireworks" 
        style={{
          width: '250px',
          height: '250px',
          objectFit: 'contain',
          borderRadius: '15px',
         
          '@media (max-width: 768px)': {
            width: '150px',
            height: '150px'
          }
        }} 
      />
    </div>
  <div style={heroContentStyle}>
    <h1 style={heroTitleStyle}>SRI GOKILAA CRACKERS</h1>
    <p style={heroSubtitleStyle}>
       firecracker specialists with over a decade of excellence in manufacturing, retailing, and wholesale distribution
    </p>
   
    <div style={heroButtonContainer}>
      <Link to="/product" style={heroButtonStyle}>
        Explore Products
      </Link>
     
    </div>
  </div>
</section>


{/* About Us Section */}
<section style={aboutSectionStyle}>
  <div style={aboutContainerStyle}>
    <div style={aboutContentStyle}>
      <h2 style={aboutTitleStyle}>About Sri Gokilaa Crackers</h2>
      <div style={aboutTextContainer}>
        <p style={aboutTextStyle}>
          We,Sri Gokilaa Crackers, based in Virudhunagar, the Cracker City of Tamilnadu. We are the agency to sell all fireworks crackers based upon the customer orders.
        </p>
        <p style={aboutTextStyle}>
          We are in the field of crackers for more than a decade. We are one of the Largest Manufacturer, Retailer & Wholesalers of crackers in Virudhunagar. We procure the crackers well in advance during the best sun drying months of March, April and May to serve the customers with high quality products at the most competitive price.
        </p>
        <p style={aboutTextStyle}>
          At Sri Gokilaa Crackers, we're committed to offering quality products, unparalleled service and the most competitive prices in town. Great service begins with great people and industry experience, which is why our staff is made up of the best and most qualified in the business.
        </p>
        <div style={{ textAlign: 'center' }}>
        <Link to="/about" style={learnMoreButtonStyle}>
          Learn More
        </Link>
        </div>
      </div>
    </div>
    <div style={aboutImageContainer}>
      <img 
        src={about_img} 
        alt="Vivify Traders  " 
        style={aboutImageStyle}
      />
      <div style={aboutStatsContainer}>
        <div style={aboutStatItem}>
          <FiCalendar style={aboutStatIcon} />
          <div>
            <h3 style={aboutStatNumber}>10+</h3>
            <p style={aboutStatText}>Years Experience</p>
          </div>
        </div>
        <div style={aboutStatItem}>
          <FiAward style={aboutStatIcon} />
          <div>
            <h3 style={aboutStatNumber}>1000+</h3>
            <p style={aboutStatText}>Happy Customers</p>
          </div>
        </div>
        <div style={aboutStatItem}>
          <FiDollarSign style={aboutStatIcon} />
          <div>
            <h3 style={aboutStatNumber}>Best</h3>
            <p style={aboutStatText}>Prices in Town</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

 

{/* Products Section */}
<section style={productsSectionStyle}>
  <div style={productsContainerStyle}>
    <h2 style={productsTitleStyle}>FireWorks Crackers</h2>
    <p style={productsSubtitleStyle}>Premium quality crackers loved by customers</p>
    
    <div style={productsGridStyle}>
      {/* Product Card 1 */}
      <div style={productCardStyle}>
       <div style={{...productImageStyle}}><img src={new_img} alt="Test" style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}  /></div>
        <h3 style={productNameStyle}>Sparkling Fountain</h3>
        <p style={productDescStyle}>Beautiful ground spinner with colorful sparks</p>
      </div>

      {/* Product Card 2 */}
      <div style={productCardStyle}>
          <div style={{...productImageStyle}}><img src={new_img2} alt="Test" style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}  /></div>
        <h3 style={productNameStyle}>Sky Palace</h3>
        <p style={productDescStyle}>100-shot aerial repeater with stunning effects</p>
      </div>

      {/* Product Card 3 */}
      <div style={productCardStyle}>
        <div style={{...productImageStyle}}><img src={new_img3} alt="Test" style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}  /></div>
        <h3 style={productNameStyle}>Rainbow Wheels</h3>
        <p style={productDescStyle}>Colorful spinning wheels with whistling sound</p>
      </div>
    
     {/* Product Card*/}
      <div style={productCardStyle}>
       <div style={{...productImageStyle}}><img src={new_img4} alt="Test" style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}  /></div>
        <h3 style={productNameStyle}>Silver Fountain</h3>
        <p style={productDescStyle}>Colorful fountain with silver sparks</p>
      </div>
    </div>


    <div style={viewMoreContainerStyle}>
      <Link to="/product" style={viewMoreButtonStyle}>
        View All Products
      </Link>
    </div>
  </div>
</section>


{/* Safety Tips Section */}
<section style={safetySectionStyle}>
  <div style={safetyContainerStyle}>
    <h2 style={safetyTitleStyle}>Firecracker Safety Tips</h2>
    <p style={safetySubtitleStyle}>Enjoy festivals safely with these important precautions</p>
    
    <div style={safetyGridStyle}>
      {/* Safety Tip 1 */}
      <div style={safetyCardStyle}>
        <div style={safetyIconContainer}>
          <FiAlertTriangle style={safetyIconStyle} />
        </div>
        <h3 style={safetyTipTitle}>Purchase Quality Products</h3>
        <p style={safetyTipText}>
          Always buy fireworks from licensed manufacturers like Vivify Traders. 
          Check for ISI mark and manufacturer details.
        </p>
      </div>

      {/* Safety Tip 2 */}
      <div style={safetyCardStyle}>
        <div style={safetyIconContainer}>
          <FiUser style={safetyIconStyle} />
        </div>
        <h3 style={safetyTipTitle}>Adult Supervision</h3>
        <p style={safetyTipText}>
          Never allow children to handle fireworks unsupervised. 
          Adults should light all fireworks.
        </p>
      </div>

      {/* Safety Tip 3 */}
      <div style={safetyCardStyle}>
        <div style={safetyIconContainer}>
          <FiWind style={safetyIconStyle} />
        </div>
        <h3 style={safetyTipTitle}>Open Space</h3>
        <p style={safetyTipText}>
          Use fireworks only in open areas away from buildings, 
          dry leaves or flammable materials.
        </p>
      </div>
</div>
 <div style={safetyGridStyle}>
      {/* Safety Tip 4 */}
      <div style={safetyCardStyle}>
        <div style={safetyIconContainer}>
        <FiDroplet style={safetyIconStyle} />
        </div>
        <h3 style={safetyTipTitle}>Water Source</h3>
        <p style={safetyTipText}>
          Keep buckets of water and sand ready for emergencies. 
          Soak used fireworks before disposal.
        </p>
      </div>

      {/* Safety Tip 5 */}
      <div style={safetyCardStyle}>
        <div style={safetyIconContainer}>
          <FiShield style={safetyIconStyle} />
        </div>
        <h3 style={safetyTipTitle}>Protective Gear</h3>
        <p style={safetyTipText}>
          Wear cotton clothes, eye protection, and keep hair tied back. 
          Avoid loose synthetic fabrics.
        </p>
      </div>

      {/* Safety Tip 6 */}
      <div style={safetyCardStyle}>
        <div style={safetyIconContainer}>
          <FiAlertCircle style={safetyIconStyle} />
        </div>
        <h3 style={safetyTipTitle}>Emergency Preparedness</h3>
        <p style={safetyTipText}>
          Keep first aid kit and fire extinguisher nearby. 
          Know emergency contact numbers.
        </p>
      </div>
    </div>

    <div style={safetyButtonContainer}>
      <Link to="/safety" style={safetyButtonStyle}>
        <FiBookOpen style={buttonIconStyle} />
        View Complete Safety Guide
      </Link>
    </div>
  </div>
</section>

{/* Contact Us Section */}
<section style={contactSectionStyle}>
  <div style={contactContainerStyle}>
    <div style={contactHeaderStyle}>
      <h2 style={contactTitleStyle}>Get In Touch</h2>
      <p style={contactSubtitleStyle}>We'd love to hear from you! Reach out for inquiries, orders, or partnerships.</p>
    </div>

    <div style={contactContentStyle}>
      {/* Contact Info Cards */}
      <div style={contactInfoStyle}>
        {/* Contact Card 1 */}
        <div style={contactCardStyle}>
          <div style={contactIconWrapper}>
            <FiMapPin style={contactIconStyle} />
          </div>
          <h3 style={contactCardTitle}>  Location</h3>
          <p style={contactCardText}>
            4/1C Rajamuthu Nagar, Naranapuram Puthur, Naranapuram,Virudhunagar, Tamil Nadu 626189 <br />
           
          </p>
        </div>

        {/* Contact Card 2 */}
        <div style={contactCardStyle}>
          <div style={contactIconWrapper}>
            <FiMail style={contactIconStyle} />
          </div>
          <h3 style={contactCardTitle}>Email Us</h3>
          <p style={contactCardText}>
          srigokilaacrackers0@gmail.com
          </p>
        </div>

        {/* Contact Card 3 */}
        <div style={contactCardStyle}>
          <div style={contactIconWrapper}>
            <FiPhone style={contactIconStyle} />
          </div>
          <h3 style={contactCardTitle}>Call Us</h3>
          <p style={contactCardText}>
            +91 9787009888
          </p>
        </div>

        {/* Contact Card 4 */}
        <div style={contactCardStyle}>
          <div style={contactIconWrapper}>
            <FiClock style={contactIconStyle} />
          </div>
          <h3 style={contactCardTitle}>Working Hours</h3>
          <p style={contactCardText}>
            Monday - Saturday: 9AM - 8PM<br />
            Sunday: Closed
          </p>
        </div>
      </div>

      {/* Contact Form */}
 {/* Contact Form Section - Updated */}
<div style={contactFormStyle}>
  <form style={formStyle} onSubmit={handleContactSubmit}>
    <div style={formGroupStyle}>
      <input 
        type="text" 
        name="name"
        placeholder="Your Name" 
        style={inputStyle}
        value={formData.name}
        onChange={handleInputChange}
        required
      />
    </div>
    <div style={formGroupStyle}>
      <input 
        type="email" 
        name="email"
        placeholder="Your Email" 
        style={inputStyle}
        value={formData.email}
        onChange={handleInputChange}
        required
      />
    </div>
    <div style={formGroupStyle}>
      <input 
        type="tel" 
        name="phone"
        placeholder="Phone Number" 
        style={inputStyle}
        value={formData.phone}
        onChange={handleInputChange}
      />
    </div>
    <div style={formGroupStyle}>
      <select 
        name="subject"
        style={inputStyle}
        value={formData.subject}
        onChange={handleInputChange}
      >
        <option value="">Select Subject</option>
        <option value="sales">Sales Inquiry</option>
        <option value="wholesale">Wholesale Orders</option>
        <option value="support">Customer Support</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div style={formGroupStyle}>
      <textarea 
        name="message"
        placeholder="Your Message" 
        rows="5" 
        style={textareaStyle}
        value={formData.message}
        onChange={handleInputChange}
        required
      ></textarea>
    </div>
    
    {/* Hidden companyId field */}
    <input type="hidden" name="companyId" value={formData.companyId} />
    
    {/* Submission status message */}
    {submitStatus === 'success' && (
      <div style={{ 
        color: 'green', 
        textAlign: 'center',
        margin: '10px 0',
        fontSize: '0.9rem'
      }}>
        Message sent successfully!
      </div>
    )}
    {submitStatus === 'error' && (
      <div style={{ 
        color: 'red', 
        textAlign: 'center',
        margin: '10px 0',
        fontSize: '0.9rem'
      }}>
        Failed to send message. Please try again.
      </div>
    )}
    
    <button 
      type="submit" 
      style={submitButtonStyle}
      disabled={isSubmittingContact}
    >
      {isSubmittingContact ? (
        'Sending...'
      ) : (
        <>
          <FiSend style={submitIconStyle} />
          Send Message
        </>
      )}
    </button>
  </form>
</div>
    </div>
  </div>

 
</section>



{/* Footer Section */}
 <Footer />
    </>
  );
}

// NavLink component with enhanced hover effects
function NavLink({ to, children }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Link 
      to={to} 
      style={isHovered ? {...navLinkStyle, ...navLinkHoverStyle} : navLinkStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}

// Existing styles (unchanged)
const headerStyle = {
  background: 'linear-gradient(135deg, #1a237e 0%, #3949AB 50%, #5c6bc0 100%)',
  padding: '0.5rem 2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  
  position: 'sticky',
  top: 0,
  zIndex: 1000,
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
};

const logoStyle = {
  height: '70px',
  width: '70px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid #FF9800',
  boxShadow: '0 0 15px rgba(255, 152, 0, 0.7)'
};

const navListStyle = {
  display: 'flex',
  listStyle: 'none',
  gap: '1.5rem',
  margin: 0,
  padding: 0
};

const navItemStyle = {
  borderRadius: '30px',
  transition: 'all 0.3s ease'
};

const navLinkStyle = {
  display: 'inline-block',
  padding: '0.5rem 1rem',
  backgroundColor: 'white',
  color: '#3949AB',
  textDecoration: 'none',
  borderRadius: '10px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

const loginnavLinkStyle={
    display: 'inline-block',
  padding: '0.5rem 1rem',
  backgroundColor: '#FF9800',
    color: 'white',
  textDecoration: 'none',
  borderRadius: '10px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  ':hover': {
      backgroundColor: '#F57C00',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(255, 152, 0, 0.6)'
    }
}


const navLinkHoverStyle = {
  border: 'none'
};

const heroSectionStyle = {
  position: 'relative',
  height: '60vh',
  
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  textAlign: 'center',
  padding: '1rem 2rem',
  '@media (max-width: 768px)': {
    height: '80vh',
    padding: '1rem'
  },
  '@media (max-width: 480px)': {
    height: '90vh',
    padding: '0.5rem'
  }
};

const heroContentStyle = {
  zIndex: 2,
  maxWidth: '800px'
};

// Update heroTitleStyle for mobile
const heroTitleStyle = {
  fontSize: 'clamp(2.5rem, 8vw, 4rem)',
  color: '#fff',
  marginBottom: '1.5rem',
  position: 'relative',
  textAlign: 'center',
  '@media (max-width: 480px)': {
    fontSize: 'clamp(2rem, 6vw, 3rem)'
  }
};

const heroSubtitleStyle = {
  fontSize: 'clamp(1rem, 2vw, 1.5rem)',
  color: '#fff',
  marginBottom: '2rem',
  '@media (max-width: 480px)': {
    fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)'
  }
};

// Update the heroButtonContainer style to remove the line
const heroButtonContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '1rem', // Reduced from 2rem to bring button closer to text
  padding: '0', // Ensure no padding is causing extra space
  border: 'none', // Explicitly remove any borders
  outline: 'none' // Remove any outlines
};

// Update the heroButtonStyle to ensure no borders
const heroButtonStyle = {
  padding: '12px 30px',
  backgroundColor: '#3949AB',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '30px',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  transition: 'all 0.3s ease',
  border: 'none', // Explicitly remove any borders
  outline: 'none', // Remove any outlines
  boxShadow: 'none', // Remove any shadows that might look like lines
  '@media (max-width: 768px)': {
    fontSize: '1rem',
    padding: '10px 25px'
  }
};

const secondaryButtonStyle = {
  padding: '12px 30px',
  backgroundColor: 'transparent',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '30px',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  transition: 'all 0.3s ease',
 
  border: '2px solid white'
};

const heroOverlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.3)'
};

const heroInfoBox = {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: '20px',
    margin: '2rem 0',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    backdropFilter: 'blur(5px)'
  };
  
  const heroInfoItem = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    maxWidth: '250px'
  };
  
  const heroInfoIcon = {
    fontSize: '1.5rem',
    color: '#FF9800',
    flexShrink: 0
  };
  
  const heroInfoText = {
    margin: 0,
    fontSize: '0.9rem',
    textAlign: 'left',
    textShadow: 'none'
  };

  // About Us Section Styles
const aboutSectionStyle = {
  padding: '1rem',
  backgroundColor: '#f9f9f9',
  '@media (max-width: 480px)': {
    padding: '1rem 0.5rem'
  }
};
  
const aboutContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3rem',
  alignItems: 'center',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    gap: '2rem',
    padding: '0 1rem'
  },
  '@media (max-width: 480px)': {
    gap: '1.5rem',
    padding: '0'
  }
};
  
  const aboutContentStyle = {
  flex: '1 1 45%',
  minWidth: '300px',
  '@media (max-width: 480px)': {
    minWidth: '100%',
    padding: '0 1rem'
  }
};
  const aboutTitleStyle = {
  fontSize: '2.5rem',
  color: '#1a237e',
  marginBottom: '1.5rem',
  position: 'relative',
  textAlign: 'center', // Center the title on all screens
  '@media (max-width: 480px)': {
    fontSize: '2rem', // Reduce font size slightly for mobile
  }
};
  
  const aboutTextContainer = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };
  
  const aboutTextStyle = {
  fontSize: '1rem',
  lineHeight: '1.5',
  color: '#333',
  marginBottom: '0px',
  textAlign: 'justify', // Justify text for better readability
  '@media (max-width: 480px)': {
    fontSize: '0.9rem', // Slightly reduce font size for mobile
    lineHeight: '1.6',  // Increase line height for better spacing
  }
};
// Update the aboutImageContainer style
const aboutImageContainer = {
  flex: '1 1 45%',
  minWidth: '300px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  '@media (max-width: 480px)': {
    minWidth: '100%',
    padding: '0',
    margin: '0 auto',
    maxWidth: '100%',
    display: 'flex',
    justifyContent: 'center' // Center the image horizontally
  }
};

// Update the aboutImageStyle
const aboutImageStyle = {
  height: '400px',
  width: '100%',
  maxWidth: '500px',
  borderRadius: '10px',
  marginTop: '40px',
  objectFit: 'cover',
  objectPosition: 'center',
  '@media (max-width: 768px)': {
    height: '350px',
    marginTop: '20px'
  },
  '@media (max-width: 480px)': {
    height: '250px',
    width: '100%',
    maxWidth: '100%',
    margin: '10px 0 0', // Remove auto margin to fill container
    borderRadius: '10px',
    padding: '0',
    display: 'block',
    objectFit: 'cover' // Ensure image covers the container
  }
};
const aboutStatsContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '1rem',
  marginTop: '2rem',
  width: '100%', // Ensure stats take full width
  '@media (max-width: 480px)': {
    gap: '0.8rem',
    marginTop: '1.5rem',
    padding: '0 1rem' // Match image padding
  }
};

  
  const aboutStatItem = {
  flex: '1 1 150px',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
  '@media (max-width: 480px)': {
    flex: '1 1 120px',
    padding: '1rem',
    gap: '0.8rem'
  }
};
  
  const aboutStatIcon = {
    fontSize: '2rem',
    color: '#FF9800',
  };
  
  const aboutStatNumber = {
    fontSize: '1.8rem',
    margin: '0',
    color: '#1a237e',
  };
  
  const aboutStatText = {
    fontSize: '1rem',
    margin: '0',
    color: '#666',
  };

  const learnMoreButtonStyle = {
  display: 'block', // Change to block to enable margin auto
  margin: '1rem auto 0', // Auto horizontally, 1rem top margin
  padding: '12px 30px',
  backgroundColor: '#FF9800',
  color: 'white',
  width: "100px",
  textDecoration: 'none',
  borderRadius: '30px',
  fontWeight: 'bold',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(255, 152, 0, 0.4)',
  border: '2px solid #FF9800',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#F57C00',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(255, 152, 0, 0.6)'
  },
};


  // Products Section Styles
const productsSectionStyle = {
  padding: '2rem 1rem',
  backgroundColor: '#fff',
};
  
 const productsContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
};
  
 const productsTitleStyle = {
  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', // Responsive font size
  color: '#1a237e',
  textAlign: 'center',
  marginBottom: '0.5rem',
};
  
 const productsSubtitleStyle = {
  fontSize: 'clamp(1rem, 2vw, 1.1rem)', // Responsive font size
  color: '#666',
  textAlign: 'center',
  marginBottom: '2rem',
};
  
const productsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '1.5rem',
  justifyContent: 'center', /* Centers the grid items */
  marginBottom: '2rem',
  '@media (max-width: 768px)': {
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
  },
  '@media (max-width: 480px)': {
    gridTemplateColumns: '1fr', /* Single column on mobile */
    maxWidth: '300px',
    margin: '0 auto' /* Center the grid container */
  }
};
const productCardStyle = {
  backgroundColor: '#fff',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  ':hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%', // Make card take full width of grid cell
  '@media (max-width: 768px)': {
    maxWidth: '100%'
  },
  '@media (max-width: 480px)': {
    maxWidth: '100%'
  }
};
const productImageStyle = {
  width: '100%',
  height: '120px',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  '@media (max-width: 480px)': {
    height: '140px'
  }
};
// Keep these existing styles as they are
const productContentStyle = {
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%'
};

  const productNameStyle = {
    fontSize: '1rem',
    color: '#1a237e',
     margin: '0.5rem 1rem',
  };
  
  const productDescStyle = {
     fontSize: '0.8rem',
    color: '#666',
      margin: '0 1rem 0.5rem', 
  minHeight: '30px', 
  };
  
  const productPriceStyle = {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#FF9800',
    margin: '0 1rem 1rem',
  };
  
  const productButtonStyle = {
    display: 'block',
    padding: '0.5rem',
    backgroundColor: '#1a237e',
    color: 'white',
    textAlign: 'center',
    textDecoration: 'none',
    margin: '0 1rem 1rem',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
    ':hover': {
      backgroundColor: '#3949AB'
    }
  };
  
 const viewMoreContainerStyle = {
    textAlign: 'center',
    marginTop: '0.5rem',
    marginBottom: '2rem',
};
  
  const viewMoreButtonStyle = {
    display: 'inline-block',
    padding: '12px 30px',
    backgroundColor: '#FF9800',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '30px',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 152, 0, 0.4)',
    border: '2px solid #FF9800',
    ':hover': {
      backgroundColor: '#F57C00',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(255, 152, 0, 0.6)'
    }
  };

  // Footer Styles
const footerStyle = {
    backgroundColor: '#1a237e',
    color: 'white',
    padding: '4rem 2rem 0',
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
  
  const footerLogoStyle = {
    height: '50px',
    width: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #FF9800',
  };
  
  const companyNameStyle = {
    fontSize: '1.5rem',
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
    position: 'relative',
    paddingBottom: '0.5rem',
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
    ':hover': {
      color: '#FF9800',
    }
  };
  
  const socialIconsStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  };
  
  const socialIconLinkStyle = {
    color: 'white',
    backgroundColor: '#3949AB',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#FF9800',
      transform: 'translateY(-3px)',
    }
  };
  
  const socialIconStyle = {
    fontSize: '1rem',
  };
  
  const contactIconStyle = {
     fontSize: '1.3rem',
    color: '#FF9800',
  };
  
  const listIconStyle = {
    fontSize: '0.8rem',
    color: '#FF9800',
    marginTop: '4px',
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
    ':hover': {
      backgroundColor: '#F57C00',
    }
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
    margin: '0 0 1rem',
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
    ':hover': {
      color: '#FF9800',
    }
  };
  
  const dividerStyle = {
    color: '#3949AB',
  };

  // Safety Tips Section Styles
const safetySectionStyle = {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#f8f9fa',
  };
  
  const safetyContainerStyle = {
    maxWidth: '1200px',
    height:'75%',
    margin: '0 auto',
  };
  
  const safetyTitleStyle = {
    fontSize: '2.5rem',
    color: '#1a237e',
    textAlign: 'center',
    marginBottom: '0.5rem',
  };
  
  const safetySubtitleStyle = {
    fontSize: '1.1rem',
    color: '#666',
    textAlign: 'center',
    marginBottom: '3rem',
  };
  
  const safetyGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '1.5rem',
  rowGap: '1rem',
  margin: '0 auto 2rem',
  maxWidth: '1200px',
  padding: '0 1rem',
  '@media (max-width: 768px)': {
    gridTemplateColumns: 'repeat(2, 1fr))'
  },
  '@media (max-width: 480px)': {
    gridTemplateColumns: '1fr',
    gap: '1rem'
  }
};
 
  
  const safetyCardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    },
     height: '85%', 
      display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  };
  
  const safetyIconContainer = {
    justifyContent:'center',
    backgroundColor: '#FF980020',
      width: '40px',
  height: '40px', 
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.8rem',
  };
  
  const safetyIconStyle = {
    fontSize: '1.3rem',
    color: '#FF9800',
  };
  
  const safetyTipTitle = {
    fontSize: '1rem',
    color: '#1a237e',
    marginBottom: '1rem',

  };
  
  const safetyTipText = {
    fontSize: '0.85rem',
    color: '#555',
    lineHeight: '1.6',
      textAlign: 'center', // This centers the text horizontally
  width: '100%'
  };
  
  const safetyButtonContainer = {
    textAlign: 'center',
    marginTop: '0.5rem',
    marginBottom: '2rem', 
  };
  
  const safetyButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '12px 30px',
    backgroundColor: '#FF9800',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '30px',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 152, 0, 0.4)',
    border: '2px solid #FF9800',
    ':hover': {
      backgroundColor: '#F57C00',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(255, 152, 0, 0.6)'
    }
  };
  
  const buttonIconStyle = {
    fontSize: '1.2rem',
  };

  // Contact Us Section Styles
const contactSectionStyle = {
    padding: '1rem,1rem',
    backgroundColor: '#fff',
    
    
  };
  
  const contactContainerStyle = {
    maxWidth: '1200px',
    height: '50%',
    margin: '0 auto',
  };
  
  const contactHeaderStyle = {
    textAlign: 'center',
    marginBottom: '3rem',
  };
  
  const contactTitleStyle = {
    fontSize: '2.5rem',
    color: '#1a237e',
    marginBottom: '0.5rem',
    marginTop: '0.5rem',
  };
  
  const contactSubtitleStyle = {
    fontSize: '1.1rem',
    color: '#666',
    maxWidth: '600px',
    margin: '0 auto',
    
  };
  
  
 const contactContentStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '2rem',
  margin: '0 auto',
  maxWidth: '1200px',
  padding: '0 1rem',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
    gap: '1.5rem'
  }
};

const contactInfoStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.5rem',
  alignContent: 'start',
  '@media (max-width: 500px)': {
    gridTemplateColumns: '1fr'
  }
};

const contactCardStyle = {
  backgroundColor: 'white',
  borderRadius: '10px',
  padding: '1.5rem',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  height: '70%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  ':hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)'
  }
};

const contactIconWrapper = {
   justifyContent:'center',
    backgroundColor: '#FF980020',
      width: '40px',
  height: '40px', 
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.8rem',
};

const contactCardTitle = {
  fontSize: '1.1rem',
  color: '#1a237e',
  marginBottom: '0.8rem',
  fontWeight: '600'
};

const contactCardText = {
  fontSize: '0.85rem',
  color: '#555',
  lineHeight: '1.6',
  margin: 0
};
  
  const contactFormStyle = {
  backgroundColor: 'white',
  borderRadius: '10px',
  padding: '1.5rem', // Increased from 0.5rem for better spacing
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
  height: 'auto', // Changed from fixed 91.75% to auto
  display: 'flex',
  flexDirection: 'column',
  '@media (max-width: 480px)': {
    padding: '1rem'
  }
};
  
  
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
  width: '100%', // Ensure form takes full width
};
  
  const formGroupStyle = {
    marginBottom: '0.2rem',
  };
  
  const inputStyle = {
  width: '100%', // Changed from 80% to 100%
  padding: '0.5rem 0.8rem',
  borderRadius: '5px',
  border: '1px solid #ddd',
  fontSize: '0.85rem',
  transition: 'all 0.3s ease',
  boxSizing: 'border-box', // Ensure padding doesn't affect width
  ':focus': {
    outline: 'none',
    borderColor: '#1a237e',
    boxShadow: '0 0 0 2px rgba(26, 35, 126, 0.1)',
  }
};
  
  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,<svg width=\'12\' height=\'12\' viewBox=\'0 0 4 5\' xmlns=\'http://www.w3.org/2000/svg\'><path fill=\'%23333\' d=\'M2 0L0 2h4zm0 5L0 3h4z\'/></svg>")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    backgroundSize: '8px 10px',
  };
  
 const textareaStyle = {
  width: '100%', // Ensure full width
  padding: '0.5rem 0.8rem',
  borderRadius: '5px',
  border: '1px solid #ddd',
  fontSize: '0.85rem',
  transition: 'all 0.3s ease',
  boxSizing: 'border-box',
  resize: 'vertical',
  ':focus': {
    outline: 'none',
    borderColor: '#1a237e',
    boxShadow: '0 0 0 2px rgba(26, 35, 126, 0.1)',
  }
};
  
const submitButtonStyle = {
  width: '100%', // Changed from fixed 500px to 100%
  maxWidth: '500px', // Add max-width to prevent it from getting too wide
  margin: '0 auto', // Center the button
  padding: '0.8rem 1.5rem',
  backgroundColor: '#1a237e',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.3s ease',
  ':hover': {
    backgroundColor: '#3949AB',
    transform: 'translateY(-2px)',
  },
  '@media (max-width: 768px)': {
    width: '100%',
    maxWidth: '100%' // Allow full width on tablets
  },
  '@media (max-width: 480px)': {
    width: '100%',
    maxWidth: '100%', // Full width on mobile
    margin: '0 auto',
    padding: '0.7rem 1rem'
  }
};
  
  const submitIconStyle = {
    fontSize: '1rem',
    '@media (max-width: 768px)': {
  width: '100%'
},
'@media (max-width: 480px)': {
  width: '100%',
  maxWidth: '200px',
  margin: '0 auto',
  padding: '0.7rem 1rem'
}
  };
  
  const mapContainerStyle = {
    marginTop: '4rem',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  };
  
  const mapStyle = {
    width: '100%',
    height: '400px',
    border: 'none',
  };

  const popupOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
    padding: '20px',
  };
  
  const popupContainerStyle = {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 5px 25px rgba(0, 0, 0, 0.3)',
    maxWidth: '600px',
    width: '100%',
    overflow: 'hidden',
  };
  
  const popupHeaderStyle = {
    backgroundColor: '#1a237e',
    color: '#fff',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };
  
  const popupTitleStyle = {
    margin: 0,
    fontSize: '1.2rem',
  };
  
  const popupCloseButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0 5px',
  };
  
  const popupContentStyle = {
    padding: '20px',
    maxHeight: '60vh',
    overflowY: 'auto',
  };
  
  const popupTextStyle = {
    marginBottom: '15px',
    lineHeight: '1.5',
    color: '#333',
  };
  
  const popupFooterStyle = {
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: '1px solid #eee',
  };
  
  const popupAcceptButtonStyle = {
    backgroundColor: '#1a237e',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 20px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#3949AB',
    }
  };
  
export default Home;