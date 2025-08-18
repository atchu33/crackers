import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import localforage from "localforage";
import API_BASE_URL from "./apiConfig";
import backgroundImage from "../assets/LoginBG1.jpg";
import { FaUser, FaLock } from "react-icons/fa";
import Layout from "./HeaderLayouts";
const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved credentials
    const savedCredentials = localStorage.getItem("savedCredentials");
    if (savedCredentials) {
      const { empNo, pwd } = JSON.parse(savedCredentials);
      setEmail(empNo);
      setPassword(pwd);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const storeData = async (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  };
const handleLogin = async () => {
  setIsLoading(true);
  setErrorMessage("");
  const requestBody = {
    Userid: email.trim(),
    Pwd: password,
  };

  try {
    const authResponse = await axios.post(
      `${API_BASE_URL}api/Security/VerifyAuthentication`,
      requestBody,
      { headers: { "Content-Type": "application/json" } }
    );

    const authData = authResponse.data;

    if (authResponse.status === 200 && authData.statusCode === 200) {
      // Store the JWT token
      await localforage.setItem("jwtToken", authData.result);

      // Decode the JWT token properly
      const token = authData.result; // Use the fresh token, no need to get from storage
      const tokenParts = token.split('.');
      
      if (tokenParts.length !== 3) {
        throw new Error("Invalid JWT token format");
      }
      
      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        const role = parseInt(payload.Role) || 3;
        
        console.log("Decoded JWT payload:", payload);
        console.log("User role:", role);
        
        // Store role
        await localforage.setItem("userRole", role.toString());

        // Validate role before navigation
        if (typeof role !== 'number') {
          throw new Error("Invalid role in token");
        }

        // Navigate based on role
        if (role === 1) {
          navigate("/Dashboard");
        } else if (role === 2 || role === 3) {
          navigate("/Dashboard");
        } else {
          throw new Error("Unknown user role");
        }
      } catch (decodeError) {
        console.error("Token decoding error:", decodeError);
        throw new Error("Failed to decode user information");
      }
    } else {
      setErrorMessage(authData.statusDesc || "Authentication failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    // Clear invalid credentials
    await localforage.removeItem("jwtToken");
    await localforage.removeItem("userRole");
    
    setErrorMessage(
      error.response?.data?.statusDesc || 
      error.message || 
      "Unable to log in. Please try again later."
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
    <Layout />
    <div style={styles.container}>
      {/* Full-screen background with login form */}
      <div style={styles.background}>
        <div style={styles.formContainer}>
          <h1 style={styles.header}>Sign In</h1>

          {/* Email Input */}
          <div style={styles.inputGroup}>
            <FaUser style={styles.icon} />
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={styles.optionsContainer}>
            <label style={styles.rememberMe}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                style={styles.checkbox}
              />
              Remember me
            </label>
            <span onClick={() => navigate("/ForgotPwd")} style={styles.forgotLink}>
              Forgot password?
            </span>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              ...styles.loginButton,
              opacity: isLoading ? 0.8 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Logging in..." : "Login Now"}
          </button>

          {/* Error Message */}
          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        </div>
      </div>
    </div>
    </>
  );
};

// ✅ CSS-in-JS Styles (Fixed: Prevents Scroll)
const styles = {
  container: {
    position: "fixed", // 👈 Keeps it locked to viewport
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    overflow: "hidden", // 🔥 This disables scrolling
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
  },
  background: {
    width: "100%",
    height: "100%",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
  },
  formContainer: {
    width: "100%",
    maxWidth: "300px",
    backgroundColor: "rgba(255, 255, 255, 0.42)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    animation: "fadeIn 0.6s ease-out",
    marginTop: "40px",
  },
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  header: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1a237e",
    marginBottom: "25px",
    fontFamily: "'Poppins', sans-serif",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: "18px",
    background: "rgba(255, 255, 255, 0.7)",
    borderRadius: "10px",
    padding: "12px 15px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(26, 35, 126, 0.1)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    ":focus-within": {
      borderColor: "#1a237e",
      boxShadow: "0 0 0 1px #1a237e, 0 4px 12px rgba(26, 35, 126, 0.15)",
      transform: "translateY(-2px)",
      background: "#fff",
    },
  },
  icon: {
    color: "#1a237e",
    fontSize: "16px",
    marginRight: "10px",
    transition: "color 0.3s ease",
    opacity: 0.8,
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "transparent",
    padding: "2px 0",
    fontFamily: "'Poppins', sans-serif",
    color: "#333",
    "::placeholder": {
      color: "#888",
      opacity: 1,
      fontWeight: "400",
    },
  },
  optionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "10px 0 20px",
    fontSize: "13px",
  },
  rememberMe: {
    display: "flex",
    alignItems: "center",
    color: "black",
    cursor: "pointer",
  },
  checkbox: {
    marginRight: "8px",
    accentColor: "#1a237e",
  },
  loginButton: {
    width: "100%",
    borderRadius: "8px",
    color: "#fff",
    padding: "14px",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    border: "none",
    background: "linear-gradient(to right, #1a237e, #303f9f)",
    boxShadow: "0 4px 12px rgba(26, 35, 126, 0.25)",
    marginBottom: "10px",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(26, 35, 126, 0.3)",
    },
    ":active": {
      transform: "translateY(0)",
    },
  },
  errorMessage: {
    color: "#d32f2f",
    fontSize: "13px",
    margin: "10px 0",
    padding: "10px 14px",
    backgroundColor: "rgba(211, 47, 47, 0.1)",
    borderRadius: "8px",
    textAlign: "center",
    border: "1px solid rgba(211, 47, 47, 0.2)",
    fontWeight: "500",
  },
  forgotLink: {
    color: "#1a237e",
    fontWeight: "600",
    cursor: "pointer",
    transition: "color 0.2s ease",
    ":hover": {
      textDecoration: "underline",
      color: "#0d1b50",
    },
  },
};

export default AdminLogin;