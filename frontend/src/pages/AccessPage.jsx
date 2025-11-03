import React from "react";
import { useNavigate } from "react-router-dom";

const AccessPage = ({ setShowNavbar, setLoggedInUser }) => {
  const navigate = useNavigate();

  const handleGuest = () => {
    setLoggedInUser({ name: "Guest" }); // optional placeholder
    setShowNavbar(true);
    navigate("/guest/home");
  };

  return (
    <div className="access-container">
      <h1>Welcome to React Recipes 🍽️</h1>
      <p>Select how you’d like to access:</p>

      <div className="access-buttons">
        <button className="guest-btn" onClick={() => navigate("/guest/home")}>
          Continue as Guest
        </button>
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="signup-btn" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default AccessPage;
