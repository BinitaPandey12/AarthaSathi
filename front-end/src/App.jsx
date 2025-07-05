import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import BorrowerSignup from "./pages/signup/BorrowerSignup";
import LenderSignup from "./pages/signup/LenderSignup";
import LenderDashboard from "./pages/LenderDashboard";
import BorrowerDashboard from "./pages/BorrowerDashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/borrow" element={<BorrowerSignup />} />
        <Route path="/lend" element={<LenderSignup />} />
        <Route path="/lender-dashboard" element={<LenderDashboard />} />
        <Route path="/borrower-dashboard" element={<BorrowerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
