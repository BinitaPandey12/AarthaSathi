import React, { useState, useEffect } from "react";
import "./LandingPage.css";
// Import your images
import image1 from "../assets/women.jpg";
import image2 from "../assets/women1.jpg";
import image3 from "../assets/women2.jpg";
import image4 from "../assets/women3.jpg";

const LandingPage = () => {
  const images = [image1, image2, image3, image4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="nav-container">
        <h1 className="logo">AarthaSathi</h1>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/how-it-works">How It Works</a>
          <a href="/about">About</a>
          <a href="/faq">FAQ</a>
          <a href="/login">Login</a>
          <a href="/signup" className="signup-btn">
            Sign Up
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Empowering Women Through Microloans</h1>
          <p className="hero-description">
            Join AarthaSathi to support or receive financial assistance in a
            safe, women-only community built on trust.
          </p>
          <div className="cta-buttons">
            <a href="/lend" className="cta-btn lender-btn">
              I want to lend →
            </a>
            <a href="/borrow" className="cta-btn borrower-btn">
              I need a loan →
            </a>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="image-carousel">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${
                index === currentImageIndex ? "active" : ""
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          <div className="carousel-dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentImageIndex ? "active" : ""}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
