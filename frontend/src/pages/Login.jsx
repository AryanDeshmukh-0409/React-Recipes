import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setLoggedInUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users");
      const users = await res.json();

      const foundUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (foundUser) {
        setSuccess("Login successful! Redirecting...");
        localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
        setLoggedInUser(foundUser); // ✅ Update Navbar immediately
        setTimeout(() => navigate("/guest/home"), 2000);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server. Try again later.");
    }
  };

  return (
    <div className="login-page">
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f6f8ff, #eef6ff);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial;
        }

        .login-container {
          background: rgba(255,255,255,0.9);
          border-radius: 16px;
          padding: 2rem;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          backdrop-filter: blur(6px);
        }

        .login-title {
          margin-bottom: 0.5rem;
          font-size: 1.8rem;
          color: #0f172a;
          text-align: center;
        }

        .login-subtitle {
          font-size: 0.95rem;
          color: #6b7280;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        input[type="email"],
        input[type="password"] {
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(15,23,42,0.06);
          font-size: 0.95rem;
          outline: none;
          transition: box-shadow 0.2s ease;
        }

        input:focus {
          box-shadow: 0 6px 18px rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.65);
        }

        .login-btn {
          padding: 0.75rem;
          border-radius: 10px;
          border: none;
          background: linear-gradient(90deg, #6d28d9, #9333ea);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 0.5rem;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99,102,241,0.12);
        }

        .error-msg {
          color: #dc2626;
          background: rgba(220,38,38,0.06);
          padding: 0.5rem;
          border-radius: 8px;
          font-size: 0.85rem;
        }

        .success-msg {
          color: #16a34a;
          background: rgba(16,185,129,0.06);
          padding: 0.5rem;
          border-radius: 8px;
          font-size: 0.85rem;
        }

        .login-footer, .guest-access {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.85rem;
          color: #6b7280;
        }

        .login-footer span,
        .guest-access span {
          color: #3730a3;
          cursor: pointer;
          font-weight: 600;
        }

        .login-footer span:hover,
        .guest-access span:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="login-container">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">
          Log in to explore your favorite recipes
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up here</span>
        </p>

        <p className="guest-access">
          or continue as{" "}
          <span onClick={() => navigate("/guest/home")}>Guest</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
