import React, { useState } from "react";
import "./BorrowerSignup.css";
import { useNavigate } from "react-router-dom";

const BorrowerSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    idNumber: "",
    idPhoto: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (name === "email") setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.endsWith("@gmail.com")) {
      setError("Email must be a @gmail.com address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("address", formData.address);
      data.append("idNumber", formData.idNumber);
      data.append("idPhoto", formData.idPhoto);

      const response = await fetch(
        "http://localhost:8080/api/auth/signup/borrower",
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        const resData = await response.json();
        setError(resData.message || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }
      // Success
      navigate("/borrower-dashboard");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="borrower-signup-container">
      <form onSubmit={handleSubmit} className="borrower-signup-form">
        <h2>Apply for a Loan</h2>
        <p className="form-subtitle">
          Join AarthaSathi to get financial support for your needs
        </p>

        <div className="form-section">
          <h3>Personal Information</h3>

          <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          {error && (
            <div style={{ color: "red", marginBottom: 8 }}>{error}</div>
          )}

          <textarea
            name="address"
            placeholder="Full Address"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="idNumber"
            placeholder="Government ID Number"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-section">
          <h3>Government Photo</h3>
          <div className="file-uploads">
            <label>
              Upload Government Photo:
              <input
                type="file"
                name="idPhoto"
                onChange={handleChange}
                accept=".jpg,.png,.pdf"
                required
              />
            </label>
          </div>
        </div>

        <div className="terms-checkbox">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms" className="checkbox-label">
            I agree to the <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>
          </label>
        </div>

        <button className="create-account-btn" disabled={loading}>
          {loading ? "Signing up..." : "Apply for Loan"}
        </button>

        <p className="login-redirect">
          Have an Account?{" "}
          <span onClick={() => navigate("/login")}>Login Here</span>
        </p>
      </form>
    </div>
  );
};

export default BorrowerSignup;
