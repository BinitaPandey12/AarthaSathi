import React, { useState } from "react";
import "./SignupPage.css";
import { useNavigate } from "react-router-dom";


const SignupPage = () => {
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
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

        <div className="name-fields">
          <input
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
        </div>

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
<div className="id-fields">
  <select name="idType" onChange={handleChange} required>
    <option value="">Select ID Type</option>
    <option value="citizenship">Citizenship</option>
    <option value="passport">Passport</option>
  </select>

  {/* Show ID Number input only if ID Type is selected */}
  {formData.idType && (
    <input
      name="idNumber"
      placeholder="ID Number"
      onChange={handleChange}
      required
    />
  )}
</div>

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
  <button
  type="button"
  className="back-home-btn"
  onClick={() => navigate("/")}
>
  Back to Home
</button>


      </form>
    </div>
  );
};

export default SignupPage;