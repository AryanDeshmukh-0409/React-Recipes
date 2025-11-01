import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const AccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="access-container">
      <h1>Welcome to React Recipes 🍽️</h1>
      <p>Select how you’d like to access:</p>

      <div className="access-buttons">
        <button onClick={() => navigate("/guest/home")} className="guest-btn">
          Continue as Guest
        </button>
        <button onClick={() => alert("Login functionality coming soon!")}>
          Login
        </button>
        <button onClick={() => navigate("/Signup")} className="signup-btn"> 
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default AccessPage;
