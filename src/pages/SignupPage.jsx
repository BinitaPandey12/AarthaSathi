import React, { useState } from "react";
import "./SignupPage.css";
import { useNavigate } from "react-router-dom";


const SignupPage = () => {
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
      governmentId: "",
    idType: "",
    idNumber: "",
    idPhoto: null,
    passportPhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Form submitted!");
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Create Your Account</h2>

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
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}

        />

        {/* Replaced Address */}
        <textarea
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />

<input
  type="text"
  name="governmentId"
  placeholder="Government ID"
  onChange={handleChange}
  required
/>

        <div className="file-uploads">
          <label>
            Upload ID Document:
            <input
              type="file"
              name="idPhoto"
              onChange={handleChange}
              accept=".jpg,.png"
              required
            />
          </label>
          
        </div>

<div className="terms-checkbox">
  <input type="checkbox" id="terms" required />
  <label htmlFor="terms" className="checkbox-label">
    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
  </label>
</div>

<button className="create-account-btn">Create Account</button>

<p className="login-redirect">
  Have an Account? <span onClick={() => navigate('/login')}>Login Here</span>
</p>


      </form>
    </div>
  );
};

export default SignupPage;