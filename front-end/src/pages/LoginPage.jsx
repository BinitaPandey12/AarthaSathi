import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Create this CSS file

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = new FormData();
      data.append("email", email);
      data.append("password", password);
      // If your backend expects a file for login, add a file input and append here as data.append('file', file)
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        const resData = await response.json();
        setError(resData.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }
      // Success
      navigate("/");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to AarthaSathi</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && (
            <div style={{ color: "red", marginBottom: 8 }}>{error}</div>
          )}
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* Signup Options Box */}
      <div className="signup-options">
        <h3>New to AarthaSathi?</h3>
        <p>Choose how you want to participate:</p>
        <div className="signup-buttons">
          <Link to="/lend" className="signup-option lender-option">
            <div className="option-icon">💰</div>
            <div className="option-content">
              <h4>Become a Lender</h4>
              <p>Support women entrepreneurs by providing microloans</p>
            </div>
          </Link>
          <Link to="/borrow" className="signup-option borrower-option">
            <div className="option-icon">🤝</div>
            <div className="option-content">
              <h4>Apply for a Loan</h4>
              <p>Get financial support for your business or personal needs</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
