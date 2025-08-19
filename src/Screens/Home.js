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
   
 {/* Hero Section */}
      <section style={heroSectionStyle}>
        <div style={heroContainerStyle}>
          <h2 style={heroTitleStyle}>Ignite the Night with Sky Blaze Fireworks</h2>
          <p style={heroSubtitleStyle}>
            Premium, eco-conscious firecrackers crafted for unforgettable celebrations — safe, brilliant, and legally compliant.
          </p>
          <div style={heroButtonGroup}>
            <Link to="/product" style={primaryButtonStyle}>
              Shop Now
            </Link>
          </div>
        </div>
      </section>


{/* About Us Section */}
<section style={aboutSectionStyle}>
  <div style={aboutContainerStyle}>
    {/* Left Content */}
    <div style={aboutContentStyle}>
      <h2 style={aboutTitleStyle}>Sky Blaze Crackers</h2>
      <div style={aboutTextContainer}>
        <p style={aboutTextStyle}>
          At <b>Sky Blaze Crackers</b>, celebrations begin with a spark! 🎆  
          Based in Virudhunagar, the heart of India’s fireworks hub, we bring you  
          a wide range of safe, vibrant, and eco-friendly crackers that light up  
          every occasion with joy.
        </p>
        <p style={aboutTextStyle}>
          With over a decade of experience, we’ve grown to become one of the most  
          trusted manufacturers, retailers, and wholesalers of fireworks. Every  
          product we sell is carefully sourced and tested to ensure premium quality  
          and safety for your celebrations.
        </p>
        <p style={aboutTextStyle}>
          Whether it’s <b>Diwali, Weddings, Festivals, or Grand Events</b>,  
          we guarantee the <span style={{ color: "#ff6a00", fontWeight: "600" }}>
          best prices</span> and a wide variety that suits every need.
        </p>
        <div style={{ textAlign: "center" }}>
          <Link to="/about" style={learnMoreButtonStyle}>
            Explore More
          </Link>
        </div>
      </div>
    </div>

    {/* Right Image & Stats */}
    <div style={aboutImageContainer}>
      <img
        src={about_img}
        alt="Sri Gokilaa Crackers Store"
        style={aboutImageStyle}
      />
      <div style={aboutStatsContainer}>
        <div style={aboutStatItem}>
          <FiCalendar style={aboutStatIcon} />
          <div>
            <h3 style={aboutStatNumber}>10+</h3>
            <p style={aboutStatText}>Years of Trust</p>
          </div>
        </div>
        <div style={aboutStatItem}>
          <FiAward style={aboutStatIcon} />
          <div>
            <h3 style={aboutStatNumber}>5000+</h3>
            <p style={aboutStatText}>Festivals Celebrated</p>
          </div>
        </div>
        <div style={aboutStatItem}>
          <FiDollarSign style={aboutStatIcon} />
          <div>
            <h3 style={aboutStatNumber}>Best</h3>
            <p style={aboutStatText}>Value for Money</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


 

{/* Products Section */}
<section style={productsSectionStyle}>
  <div style={productsContainerStyle}>
    <h2 style={productsTitleStyle}>Nightfall Fire Crackers</h2>
    <p style={productsSubtitleStyle}>Big booms, bright lights, and breathtaking effects — fireworks that own the night!</p>
    
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


 {/* Features Section */}
      <section style={featuresSectionStyle}>
        <div style={featuresContainerStyle}>
          <FeatureCard
            icon={<FiShield size={28} />}
            title="100% Legal & Safe"
            desc="Fully compliant with Indian Explosives Act and Supreme Court guidelines."
          />
          <FeatureCard
            icon={<FiTruck size={28} />}
            title="Fast Delivery"
            desc="Reliable shipping across Tamil Nadu and beyond via registered carriers."
          />
          <FeatureCard
            icon={<FiStar size={28} />}
            title="Premium Quality"
            desc="Hand-tested, vibrant, and long-lasting fireworks for every occasion."
          />
          <FeatureCard
            icon={<FiZap size={28} />}
            title="Eco-Friendly Options"
            desc="Low-smoke, noise-reduced crackers for a cleaner, greener celebration."
          />
        </div>
      </section>

{/* Contact Us Section */}
<section style={contactSectionStyle}>
  <div style={contactContainerStyle}>
    <div style={contactHeaderStyle}>
      <h2 style={contactTitleStyle}>Get In Touch</h2>
      <p style={contactSubtitleStyle}>
        We'd love to hear from you! Reach out for inquiries, orders, or partnerships.
      </p>
    </div>

    <div style={contactContentStyle}>
      {/* Contact Info */}
      <div style={contactInfoStyle}>
        <div style={contactCardStyle}>
          <div style={contactIconWrapper}>
            <FiMapPin style={contactIconStyle} />
          </div>
          <h3 style={contactCardTitle}>Location</h3>
          <p style={contactCardText}>
            4/1C Rajamuthu Nagar, Naranapuram Puthur,  
            Naranapuram, Virudhunagar, Tamil Nadu 626189
          </p>
        </div>

        <div style={contactCardStyle}>
          <div style={contactIconWrapper}>
            <FiMail style={contactIconStyle} />
          </div>
          <h3 style={contactCardTitle}>Email Us</h3>
          <p style={contactCardText}>srigokilaacrackers0@gmail.com</p>
        </div>

        <div style={contactCardStyle}>
          <div style={contactIconWrapper}>
            <FiPhone style={contactIconStyle} />
          </div>
          <h3 style={contactCardTitle}>Call Us</h3>
          <p style={contactCardText}>+91 9787009888</p>
        </div>

        <div style={contactCardStyle}>
          <div style={contactIconWrapper}>
            <FiClock style={contactIconStyle} />
          </div>
          <h3 style={contactCardTitle}>Working Hours</h3>
          <p style={contactCardText}>
            Mon - Sat: 9AM - 8PM <br />
            Sunday: Closed
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div style={contactFormStyle}>
        <form style={formStyle} onSubmit={handleContactSubmit}>
          <input 
            type="text" name="name" placeholder="Your Name"
            style={inputStyle} value={formData.name}
            onChange={handleInputChange} required
          />
          <input 
            type="email" name="email" placeholder="Your Email"
            style={inputStyle} value={formData.email}
            onChange={handleInputChange} required
          />
          <input 
            type="tel" name="phone" placeholder="Phone Number"
            style={inputStyle} value={formData.phone}
            onChange={handleInputChange}
          />
          <select 
            name="subject" style={inputStyle}
            value={formData.subject} onChange={handleInputChange}
          >
            <option value="">Select Subject</option>
            <option value="sales">Sales Inquiry</option>
            <option value="wholesale">Wholesale Orders</option>
            <option value="support">Customer Support</option>
            <option value="other">Other</option>
          </select>
          <textarea 
            name="message" placeholder="Your Message" rows="5"
            style={textareaStyle} value={formData.message}
            onChange={handleInputChange} required
          ></textarea>

          {submitStatus === 'success' && (
            <div style={successMessageStyle}>Message sent successfully!</div>
          )}
          {submitStatus === 'error' && (
            <div style={errorMessageStyle}>Failed to send message. Please try again.</div>
          )}

          <button type="submit" style={submitButtonStyle} disabled={isSubmittingContact}>
            {isSubmittingContact ? 'Sending...' : <> <FiSend style={submitIconStyle}/> Send Message </>}
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
function FeatureCard({ icon, title, desc }) {
  return (
    <div style={featureCardStyle}>
      <div style={featureIconWrapper}>{icon}</div>
      <h3 style={featureTitleStyle}>{title}</h3>
      <p style={featureDescStyle}>{desc}</p>
    </div>
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
  padding: '50px 20px',
  background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${hero_bg}) center/cover no-repeat`,
  textAlign: 'center',
  color: '#fff',
};

const heroContainerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
};

const heroTitleStyle = {
  fontSize: 'clamp(2.5rem, 4vw, 4rem)',
  fontWeight: '700',
  marginBottom: '1rem',
  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
  marginTop: '0px'
};

const heroSubtitleStyle = {
  fontSize: '1.2rem',
  marginBottom: '2rem',
  opacity: 0.9,
};

const heroButtonGroup = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
};

const primaryButtonStyle = {
  padding: '12px 30px',
  backgroundColor: '#D81B60',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '30px',
  fontWeight: '600',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(216, 27, 96, 0.4)',
};

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  backgroundColor: 'transparent',
  border: '2px solid white',
  boxShadow: 'none',
};
  // About Us Section Styles
// Section Container
const aboutSectionStyle = {
  padding: '3rem 1rem',
  background: 'linear-gradient(135deg, #fff7f7, #ffeaea)',
};

// Main Flex Container
const aboutContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3rem',
  alignItems: 'center',
  justifyContent: 'center',
};

// Left Content
const aboutContentStyle = {
  flex: '1 1 45%',
  minWidth: '300px',
  textAlign: 'center',
};

const aboutTitleStyle = {
  fontSize: '2.5rem',
  color: '#C30E59',
  marginBottom: '1.5rem',
  fontWeight: '700',
  position: 'relative',
};

const aboutTextContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  textAlign: 'justify',
};

const aboutTextStyle = {
  fontSize: '1rem',
  lineHeight: '1.7',
  color: '#444',
  margin: '5px 0'
};

// Right Side Image
const aboutImageContainer = {
  flex: '1 1 45%',
  minWidth: '300px',
  position: 'relative',
  textAlign: 'center',
};

const aboutImageStyle = {
  height: '200px',
  width: '100%',
  maxWidth: '600px',
  borderRadius: '20px',
  objectFit: 'cover',
  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
};

// Stats Section
const aboutStatsContainer = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '1.5rem',
  marginTop: '1rem',
};

const aboutStatItem = {
  flex: '1 1 150px',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '15px',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
};

const aboutStatIcon = {
  fontSize: '2rem',
  color: '#ff6a00',
};

const aboutStatNumber = {
  fontSize: '2rem',
  margin: '0',
  fontWeight: '700',
  color: '#C30E59',
};

const aboutStatText = {
  fontSize: '1rem',
  margin: '0',
  color: '#777',
};

// Button
const learnMoreButtonStyle = {
  display: 'inline-block',
  marginTop: '1.5rem',
  padding: '12px 30px',
  background: 'linear-gradient(45deg, #ff6a00, #ff3d00)',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '30px',
  fontWeight: 'bold',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  boxShadow: '0 6px 18px rgba(255, 90, 0, 0.5)',
  border: 'none',
  cursor: 'pointer',
};

const featuresSectionStyle = {
  padding: '5rem 1rem',
  background: '#f9f9f9',
};

const featuresContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
};

const featureCardStyle = {
  backgroundColor: '#fff',
  padding: '2rem 1.5rem',
  borderRadius: '12px',
  textAlign: 'center',
  boxShadow: '0 6px 15px rgba(0,0,0,0.05)',
};

const featureIconWrapper = {
  backgroundColor: '#D81B60',
  color: 'white',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1rem',
};

const featureTitleStyle = {
  fontSize: '1.3rem',
  fontWeight: '600',
  color: '#333',
  marginBottom: '0.5rem',
};

const featureDescStyle = {
  fontSize: '0.95rem',
  color: '#666',
  lineHeight: '1.5',
};

  // Products Section Styles
// Section Container
const productsSectionStyle = {
  padding: "2rem 1rem",
  background: "#fff",
};

// Wrapper
const productsContainerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  textAlign: "center",
};

// Title
const productsTitleStyle = {
  fontSize: "2.5rem",
  fontWeight: "700",
  marginBottom: "0.5rem",
  color: "#C30E59",
  marginTop: "0px",
};

const productsSubtitleStyle = {
  fontSize: "1.1rem",
  color: "#666",
  marginBottom: "3rem",
};

// Product Grid
const productsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "2rem",
  justifyContent: "center",
  alignItems: "stretch",
};

// Card Style
const productCardStyle = {
  background: "#fff",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
};

const productImageStyle = {
  width: "100%",
  height: "200px",
  overflow: "hidden",
};

const productNameStyle = {
  fontSize: "1.3rem",
  fontWeight: "600",
  margin: "0.5rem 0 0.5rem",
  color: "#C30E59",
};

const productDescStyle = {
  fontSize: "0.95rem",
  color: "#555",
  padding: "0 1rem 1rem",
  lineHeight: "1.5",
};

// View More
const viewMoreContainerStyle = {
  marginTop: "2rem",
};

const viewMoreButtonStyle = {
  padding: "12px 30px",
  background: "linear-gradient(45deg, #ff6a00, #ff3d00)",
  color: "#fff",
  fontWeight: "600",
  fontSize: "1rem",
  borderRadius: "30px",
  textDecoration: "none",
  transition: "all 0.3s ease",
  boxShadow: "0 6px 18px rgba(255, 90, 0, 0.5)",
  cursor: "pointer",
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

// Section
const safetySectionStyle = {
  padding: "4rem 1rem",
  background: "linear-gradient(135deg, #fff8f5, #f0f7ff)", // warm + calm
};

// Container
const safetyContainerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  textAlign: "center",
};

// Title + Subtitle
const safetyTitleStyle = {
  fontSize: "2.5rem",
  fontWeight: "700",
  marginBottom: "0.5rem",
  color: "#C30E59",
};

const safetySubtitleStyle = {
  fontSize: "1.1rem",
  color: "#555",
  marginBottom: "3rem",
};

// Grid
const safetyGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "2rem",
  marginBottom: "2rem",
};

// Card
const safetyCardStyle = {
  background: "#fff",
  padding: "2rem 1.5rem",
  borderRadius: "15px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "default",
  textAlign: "center",
};

// Icon Container
const safetyIconContainer = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "linear-gradient(45deg, #ff6a00, #ff3d00)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto 1rem",
  boxShadow: "0 4px 12px rgba(255, 90, 0, 0.4)",
};

const safetyIconStyle = {
  fontSize: "1.8rem",
  color: "#fff",
};

// Tip Title + Text
const safetyTipTitle = {
  fontSize: "1.2rem",
  fontWeight: "600",
  marginBottom: "0.5rem",
  color: "#C30E59",
};

const safetyTipText = {
  fontSize: "0.95rem",
  color: "#444",
  lineHeight: "1.6",
};

// Button
const safetyButtonContainer = {
  marginTop: "2.5rem",
};

const safetyButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "12px 28px",
  background: "linear-gradient(45deg, #ff6a00, #ff3d00)",
  color: "#fff",
  fontWeight: "600",
  fontSize: "1rem",
  borderRadius: "30px",
  textDecoration: "none",
  transition: "all 0.3s ease",
  boxShadow: "0 6px 18px rgba(255, 90, 0, 0.5)",
  cursor: "pointer",
};

const buttonIconStyle = {
  fontSize: "1.2rem",
};


  // Contact Us Section Styles
// Section
const contactSectionStyle = {
  padding: '2rem 1rem',
   background: 'linear-gradient(135deg, #fff7f7, #ffeaea)',
};

// Container
const contactContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
};

// Header
const contactHeaderStyle = {
  textAlign: 'center',
  marginBottom: '3rem',
};

const contactTitleStyle = {
  fontSize: '2.8rem',
  fontWeight: '700',
  color: '#C30E59',
  marginBottom: '0.5rem',
  marginTop: '0px',
};

const contactSubtitleStyle = {
  fontSize: '1.1rem',
  color: '#666',
  maxWidth: '600px',
  margin: '0 auto',
};

// Grid Layout
const contactContentStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '2rem',
  '@media (max-width: 768px)': { gridTemplateColumns: '1fr' }
};

// Info Cards
const contactInfoStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.5rem',
  '@media (max-width: 768px)': { gridTemplateColumns: '1fr' }
};

const contactCardStyle = {
  background: '#fff',
  borderRadius: '12px',
  padding: '1.5rem',
  boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
  transition: 'all 0.3s ease',
};

const contactIconWrapper = {
  width: '50px',
  height: '50px',
  borderRadius: '12px',
  background: '#C30E5920',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1rem',
};

const contactIconStyle = { fontSize: '1.4rem', color: '#C30E59' };

const contactCardTitle = { fontSize: '1.2rem', fontWeight: '600', color: '#C30E59' };
const contactCardText = { fontSize: '0.95rem', color: '#444', lineHeight: '1.6' };

// Form
const contactFormStyle = {
  background: '#fff',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };

const inputStyle = {
  padding: '0.9rem 1rem',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '0.95rem',
  outline: 'none',
  transition: '0.3s',
};

const textareaStyle = { ...inputStyle, resize: 'vertical' };

const submitButtonStyle = {
  padding: '1rem',
  background: '#C30E59',
  color: '#fff',
  fontSize: '1rem',
  fontWeight: '600',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: '0.3s',
};

const submitIconStyle = { marginRight: '0.5rem' };

const successMessageStyle = { color: 'green', textAlign: 'center', fontSize: '0.9rem' };
const errorMessageStyle = { color: 'red', textAlign: 'center', fontSize: '0.9rem' };

  
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