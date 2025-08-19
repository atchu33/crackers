import React from "react";
import aboutImg from "../assets/fire-cracker.png";
import bgImg from "../assets/crackers2.jpg";
import happyClient from "../assets/happyClient.png";
import customer from "../assets/Customer.png";
import Header from './HeaderLayouts';
import Footer from './FooterLayouts';

const styles = {
  pageWrapper: {
    width: "100%",
    overflowX: "hidden", // Prevent horizontal scroll
  },

  // ✅ Only vertical padding here — horizontal handled by .content
  section: {
    position: "relative",
    width: "100%",
    padding: "50px 0", // ← Top/bottom only
    color: "#fff",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    zIndex: 1,
  },

  // ✅ Central container with consistent max-width and padding
  content: {
    position: "relative",
    zIndex: 2,
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto", // Center the container
    paddingLeft: "20px",
    paddingRight: "20px", // ← Consistent horizontal gutters
    boxSizing: "border-box", // Prevents padding from expanding width
  },

  heading1: {
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "40px",
    color: "#fff",
    marginTop: "0px",
  },
  heading: {
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "40px",
    color: "#C30E59",
    marginTop: "0px",
  },

  // Flex layout (e.g., text + image)
  flexRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    boxSizing: "border-box",
  },

  textBox: {
    flex: 1,
    minWidth: "280px",
    background: "rgba(255,255,255,0.08)",
    padding: "25px",
    borderRadius: "12px",
    backdropFilter: "blur(5px)",
    transition: "transform 0.3s ease",
    boxSizing: "border-box",
  },

  imgBox: {
    flex: 1,
    minWidth: "280px",
    textAlign: "center",
  },

  img: {
    width: "100%",
    maxWidth: "400px",
    borderRadius: "15px",
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
    cursor: "pointer",
    display: "block",
    margin: "0 auto",
  },

  // Grid for cards
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
    width: "100%",
    boxSizing: "border-box",
  },

  card: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(8px)",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
    boxSizing: "border-box",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  card2: {
    background: "#fff",
    color: "#333",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
    boxSizing: "border-box",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  cardTitle: {
    fontSize: "1.3rem",
    marginBottom: "10px",
    color: "#ffdd00",
  },

  cardText: {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#333", // Fixed: was #000, but card2 has white bg
  },

  clientBox: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    boxSizing: "border-box",
  },

  clientCard: {
    width: "250px",
    maxWidth: "100%",
    padding: "20px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "12px",
    textAlign: "center",
    transition: "transform 0.3s ease",
    boxSizing: "border-box",
  },

  clientImg: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
  },

  highlight: {
    color: "#ff6600",
    fontWeight: "bold",
  },
};

const AboutUs = () => {
  return (
    <>
      <Header />

      <div style={styles.pageWrapper}>
        {/* Section 1: Who We Are */}
        <section style={{ ...styles.section, backgroundImage: `url(${bgImg})` }}>
          <div style={styles.overlay}></div>
          <div style={styles.content}>
            <h2 style={styles.heading1}>Who We Are</h2>
            <div style={styles.flexRow}>
              <div
                style={styles.textBox}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <p>
                  At <span style={styles.highlight}>Sky blaze Crackers</span>, we
                  believe in lighting up every celebration with joy and safety.
                  With over a decade of experience, we craft premium-quality
                  crackers that bring unforgettable sparkle to your events. We take pride in being more than just a supplier — we are a <strong>celebration partner</strong>. Whether it's Diwali, New Year, weddings, or temple festivals, our mission is to make every spark count.
                </p>
              </div>
            </div>
          </div>
        </section>

{/* Section 2: Mission & Vision */}
<section
  style={{
    ...styles.section,
    background: "linear-gradient(135deg, #f8e5e5, #fce0e0)",
    paddingTop: "40px",
    paddingBottom: "60px",
  }}
>
  <div style={styles.content}>
    <h2 style={styles.heading}>Our Mission & Vision</h2>
    <div style={styles.cardContainer}>
      {/* Mission Card */}
      <div
        style={{
          ...styles.card2,
          position: "relative",
          padding: "30px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
        }}
      >
        <span
          style={{
            fontSize: "3rem",
            color: "#C30E59",
            marginBottom: "16px",
            display: "block",
          }}
        >
          🎯
        </span>
        <h3 style={{ ...styles.cardTitle, color: "#C30E59", fontSize: "1.5rem" }}>Mission</h3>
        <p style={styles.cardText}>
          To deliver the <span style={styles.highlight}>safest</span> and most{" "}
          <span style={styles.highlight}>exciting</span> fireworks that make every
          celebration magical.
        </p>
      </div>

      {/* Vision Card */}
      <div
        style={{
          ...styles.card2,
          position: "relative",
          padding: "30px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
        }}
      >
        <span
          style={{
            fontSize: "3rem",
            color: "#C30E59",
            marginBottom: "16px",
            display: "block",
          }}
        >
          🌟
        </span>
        <h3 style={{ ...styles.cardTitle, color: "#C30E59", fontSize: "1.5rem" }}>Vision</h3>
        <p style={styles.cardText}>
          To be the most <span style={styles.highlight}>trusted brand</span> in
          fireworks, blending tradition with modern creativity for a brighter
          tomorrow.
        </p>
      </div>
    </div>
  </div>
</section>

        {/* Section 3: Why Choose Us */}
        <section
          style={{
            ...styles.section,
            background: "linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)",
          }}
        >
          <div style={styles.content}>
            <h2 style={styles.heading1}>Why Choose Us?</h2>
            <div style={styles.cardContainer}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>🎇 Premium Quality</h3>
                <p style={styles.cardText}>
                  Crackers designed with safety & brilliance.
                </p>
              </div>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>⚡ Innovation</h3>
                <p style={styles.cardText}>
                  Blending tradition with new-age firework designs.
                </p>
              </div>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>❤️ Trusted by Many</h3>
                <p style={styles.cardText}>
                  Thousands of happy clients who celebrate with us every year.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Happy Clients */}
        <section
          style={{
            ...styles.section,
            background: "linear-gradient(135deg, #fff7f7, #ffeaea)",
          }}
        >
          <div style={styles.content}>
            <h2 style={styles.heading}>Happy Clients</h2>
            <div style={styles.cardContainer}>
              {/* Card 1 */}
              <div
                style={styles.card2}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <span style={{ fontSize: "48px", marginBottom: "15px", display: "block" }}>🎇</span>
                <p style={styles.cardText}>
                  “Best crackers ever! Safe and beautiful.”
                </p>
              </div>

              {/* Card 2 */}
              <div
                style={styles.card2}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <span style={{ fontSize: "48px", marginBottom: "15px", display: "block" }}>✨</span>
                <p style={styles.cardText}>
                  “They made our Diwali so special!”
                </p>
              </div>

              {/* Card 3 */}
              <div
                style={styles.card2}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <span style={{ fontSize: "48px", marginBottom: "15px", display: "block" }}>🎆</span>
                <p style={styles.cardText}>
                  “Every festival feels brighter with Spark Fireworks!”
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;