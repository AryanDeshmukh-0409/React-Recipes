import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    
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
if (foundUser) {
  setSuccess("Login successful! Redirecting...");
  localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
  setTimeout(() => navigate("/home"), 2000); // ✅ redirect to home
} else {
  setError("Invalid email or password. Please try again.");
}
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
      {/* Inline CSS inside the component so no external import needed */}
      <style>{`
        :root{
          --bg1: #f6f8ff;
          --bg2: #eef6ff;
          --card-bg: #ffffff;
          --accent: #ff6b6b;
          --muted: #6b7280;
          --success: #16a34a;
          --danger: #dc2626;
          --glass: rgba(255,255,255,0.6);
        }

        * { box-sizing: border-box; }
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px;
          background: linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 100%);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        .login-container {
          width: 100%;
          max-width: 420px;
          background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.85));
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          padding: 28px;
          backdrop-filter: blur(6px);
          border: 1px solid rgba(16,24,40,0.04);
        }

        .login-title {
          margin: 0 0 6px 0;
          font-size: 22px;
          letter-spacing: -0.2px;
          color: #0f172a;
        }

        .login-subtitle {
          margin: 0 0 18px 0;
          color: var(--muted);
          font-size: 13px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        input[type="email"],
        input[type="password"]{
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(15,23,42,0.06);
          background: linear-gradient(180deg, #fff, var(--glass));
          outline: none;
          font-size: 14px;
          transition: box-shadow .12s ease, transform .08s ease;
        }

        input::placeholder { color: #9aa3b2; }

        input:focus {
          box-shadow: 0 6px 18px rgba(99,102,241,0.08);
          transform: translateY(-1px);
          border-color: rgba(99,102,241,0.65);
        }

        .login-btn {
          margin-top: 6px;
          padding: 12px 14px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 15px;
          background: linear-gradient(90deg, #6d28d9, #9333ea);
          color: #fff;
          box-shadow: 0 8px 20px rgba(99,102,241,0.12);
          transition: transform .12s ease, box-shadow .12s ease, opacity .12s ease;
        }

        .login-btn:active { transform: translateY(1px) scale(.997); }
        .login-btn:hover { box-shadow: 0 12px 30px rgba(99,102,241,0.14); }

        .error-msg {
          margin: 6px 0 0 0;
          color: var(--danger);
          font-size: 13px;
          background: rgba(220,38,38,0.06);
          padding: 8px 10px;
          border-radius: 8px;
        }

        .success-msg {
          margin: 6px 0 0 0;
          color: var(--success);
          font-size: 13px;
          background: rgba(16,185,129,0.06);
          padding: 8px 10px;
          border-radius: 8px;
        }

        .login-footer, .guest-access {
          margin-top: 14px;
          font-size: 13px;
          color: var(--muted);
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
          opacity: 0.95;
        }

        /* smaller screens */
        @media (max-width: 480px) {
          .login-container { padding: 20px; border-radius: 12px; }
          .login-title { font-size: 20px; }
        }
      `}</style>

      <div className="login-container">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">Log in to explore your favorite recipes</p>

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

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="login-footer">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up here</span>
        </p>

        <p className="guest-access">
          or continue as{" "}
          <span onClick={() => navigate("/home")}>Guest</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
