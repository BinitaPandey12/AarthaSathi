import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./LenderDashboard.css";

const initialLoanOffers = [
  {
    id: 1,
    borrower: "Meena Patel",
    location: "Tailor, Mumbai",
    amount: 15000,
    interest: 18,
    repayment: "15 Dec 2023",
    trustScore: 7.2,
  },
  {
    id: 2,
    borrower: "Sunita Devi",
    location: "Food Stall, Delhi",
    amount: 8000,
    interest: 15,
    repayment: "30 Nov 2023",
    trustScore: 8.1,
  },
];

const initialActiveLoans = [
  {
    id: 3,
    borrower: "Anjali Gupta",
    location: "Handicrafts, Jaipur",
    amount: 12000,
    interest: 16,
    repayment: "20 Jan 2024",
    status: "Default Loan",
    contract: true,
    disbursedDate: "10 Nov 2023",
    badge: "default",
  },
  {
    id: 4,
    borrower: "Kavita Singh",
    location: "Beauty Salon, Bangalore",
    amount: 20000,
    interest: 18,
    repayment: "15 Feb 2024",
    status: "Escrow Held",
    contract: true,
    disbursedDate: "15 Nov 2023",
    badge: "escrow",
  },
];

export default function LenderDashboard() {
  const [loanOffers, setLoanOffers] = useState(initialLoanOffers);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [activeLoans, setActiveLoans] = useState(initialActiveLoans);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [editedInterest, setEditedInterest] = useState("");
  const [popup, setPopup] = useState({ show: false, message: "" });

  // Accept Offer Modal logic
  const handleAcceptOffer = (offer) => {
    setSelectedOffer(offer);
    setEditedInterest(offer.interest);
    setShowAcceptModal(true);
  };
  const handleConfirmAccept = () => {
    setShowAcceptModal(false);
    setPopup({
      show: true,
      message: "Offer accepted! Please make payment to proceed.",
    });
    // Move offer to pending payments after popup
    setTimeout(() => {
      setPopup({ show: false, message: "" });
      setLoanOffers(loanOffers.filter((o) => o.id !== selectedOffer.id));
      setPendingPayments([
        ...pendingPayments,
        {
          ...selectedOffer,
          interest: Number(editedInterest),
          status: "Pending",
        },
      ]);
      setSelectedOffer(null);
    }, 1500);
  };
  // Make Payment logic
  const handleMakePayment = (pay) => {
    setPopup({
      show: true,
      message: "Payment successful! Loan is now active.",
    });
    setTimeout(() => {
      setPopup({ show: false, message: "" });
      setPendingPayments(pendingPayments.filter((p) => p.id !== pay.id));
      setActiveLoans([
        ...activeLoans,
        {
          ...pay,
          status: "Active",
          badge: "active",
        },
      ]);
    }, 1500);
  };

  const [newLoanForm, setNewLoanForm] = useState({
    amount: "",
    minInterest: "",
    repaymentDate: "",
    description: "",
  });

  return (
    <>
      {/* Navbar */}
      <nav className="lender-navbar">
        <div className="navbar-title">Lender Dashboard</div>
        <button className="navbar-logout-btn">Logout</button>
      </nav>
      <div className="lender-dashboard-root" style={{ minHeight: "100vh" }}>
        {/* Header */}
        <div className="dashboard-header-card">
          <div className="header-left">
            <img src={logo} alt="AarthaSathi Logo" className="lender-logo" />
            <div>
              <div className="lender-title">Welcome back, Priya Sharma!</div>
              <div className="lender-desc">
                Here's your lending dashboard where you can find loan requests
                and manage your active loans.
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="score-card trust-card">
              <div className="score-label">Your Trust Score</div>
              <div className="score-value">8.7/10</div>
              <div className="score-desc">Very Trusted Lender</div>
            </div>
            <div className="score-card safety-card">
              <div className="score-label">Safety Pool</div>
              <div className="score-value">₹25,450</div>
              <div className="score-desc">5% of your loans</div>
            </div>
          </div>
        </div>
        {/* Loan Requests from Borrowers */}
        <div className="dashboard-card">
          <div className="section-title">Loan Requests from Borrowers</div>
          <div className="section-desc">
            These are loan requests matching your preferences.
          </div>
          <div className="lender-table-wrapper">
            <div className="lender-table">
              <table>
                <thead>
                  <tr>
                    <th>Borrower</th>
                    <th>Amount</th>
                    <th>Interest</th>
                    <th>Repayment</th>
                    <th>Trust Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loanOffers.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {/* SVG Profile Icon */}
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ display: "inline-block" }}
                          >
                            <circle cx="12" cy="12" r="12" fill="#e3eaf6" />
                            <circle cx="12" cy="10" r="4" fill="#b6c4d6" />
                            <ellipse
                              cx="12"
                              cy="18"
                              rx="6"
                              ry="4"
                              fill="#b6c4d6"
                            />
                          </svg>
                          <div>
                            <div style={{ fontWeight: 600, color: "#222" }}>
                              {req.borrower}
                            </div>
                            <div style={{ fontSize: "0.95rem", color: "#555" }}>
                              {req.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>₹{req.amount.toLocaleString()}</td>
                      <td>{req.interest}%</td>
                      <td>{req.repayment}</td>
                      <td>{req.trustScore}/10</td>
                      <td>
                        <button
                          className="make-offer-btn"
                          onClick={() => handleAcceptOffer(req)}
                        >
                          Accept Offer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Pending Payments */}
        <div className="dashboard-card">
          <div className="section-title">Pending Payments</div>
          <div className="section-desc">
            Payments you need to make to borrowers.
          </div>
          <div className="lender-table-wrapper">
            <div className="lender-table">
              <table>
                <thead>
                  <tr>
                    <th>Borrower</th>
                    <th>Amount</th>
                    <th>Interest</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          height: "64px",
                          background: "transparent",
                          textAlign: "center",
                          color: "#888",
                          fontStyle: "italic",
                          fontSize: "1.05rem",
                          padding: "24px 0",
                        }}
                      >
                        No pending payments.
                      </td>
                    </tr>
                  ) : (
                    pendingPayments.map((pay) => (
                      <tr key={pay.id}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            {/* SVG Profile Icon */}
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ display: "inline-block" }}
                            >
                              <circle cx="12" cy="12" r="12" fill="#e3eaf6" />
                              <circle cx="12" cy="10" r="4" fill="#b6c4d6" />
                              <ellipse
                                cx="12"
                                cy="18"
                                rx="6"
                                ry="4"
                                fill="#b6c4d6"
                              />
                            </svg>
                            <div>
                              <div style={{ fontWeight: 600, color: "#222" }}>
                                {pay.borrower}
                              </div>
                              <div
                                style={{ fontSize: "0.95rem", color: "#555" }}
                              >
                                {pay.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>₹{pay.amount.toLocaleString()}</td>
                        <td>{pay.interest}%</td>
                        <td>{pay.repayment || pay.dueDate}</td>
                        <td>
                          <span className="loan-badge default">
                            {pay.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <button
                            className="make-offer-btn"
                            onClick={() => handleMakePayment(pay)}
                          >
                            Make Payment
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Active Loans */}
        <div className="dashboard-card">
          <div className="section-title">My Active Loans</div>
          <div className="section-desc">
            Loans that are currently active or in progress.
          </div>
          {activeLoans.map((loan) => (
            <div className="active-loan-row" key={loan.id}>
              <div className="active-loan-main">
                <div style={{ fontWeight: 600 }}>{loan.borrower}</div>
                <div style={{ color: "#888", fontSize: "0.97rem" }}>
                  {loan.location}
                </div>
                <div style={{ marginTop: 4, fontSize: "0.98rem" }}>
                  Amount <b>₹{loan.amount.toLocaleString()}</b> Interest{" "}
                  <b>{loan.interest}%</b> Repays <b>{loan.repayment}</b>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Create New Loan Offer */}
        <div className="dashboard-card sidebar-card">
          <div className="section-title">Create New Loan Offer</div>
          <div className="section-desc">
            Create a loan offer that borrowers can accept directly.
          </div>
          <div className="create-loan-form">
            <input
              type="number"
              placeholder="Loan Amount (₹)"
              value={newLoanForm.amount}
              onChange={(e) =>
                setNewLoanForm({ ...newLoanForm, amount: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max Interest Rate (%)"
              value={newLoanForm.minInterest}
              onChange={(e) =>
                setNewLoanForm({ ...newLoanForm, minInterest: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Repayment Date (dd/mm/yyyy)"
              value={newLoanForm.repaymentDate}
              onChange={(e) =>
                setNewLoanForm({
                  ...newLoanForm,
                  repaymentDate: e.target.value,
                })
              }
            />
            <textarea
              placeholder="Description"
              value={newLoanForm.description}
              onChange={(e) =>
                setNewLoanForm({ ...newLoanForm, description: e.target.value })
              }
            />
            <button className="post-loan-btn">Post Loan Offer</button>
          </div>
        </div>
        {/* Accept Offer Modal */}
        {showAcceptModal && selectedOffer && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-title">Accept Loan Offer</div>
              <div className="modal-content">
                <div>
                  <b>Borrower:</b> {selectedOffer.borrower}
                </div>
                <div>
                  <b>Location:</b> {selectedOffer.location}
                </div>
                <div>
                  <b>Amount:</b> ₹{selectedOffer.amount.toLocaleString()}
                </div>
                <div style={{ margin: "10px 0" }}>
                  <b>Interest Rate (%):</b>{" "}
                  <input
                    type="number"
                    value={editedInterest}
                    onChange={(e) => setEditedInterest(e.target.value)}
                    style={{
                      width: 60,
                      marginLeft: 8,
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      padding: "2px 6px",
                    }}
                  />
                </div>
                <div>
                  <b>Repayment:</b> {selectedOffer.repayment}
                </div>
                <div>
                  <b>Trust Score:</b> {selectedOffer.trustScore}/10
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="make-offer-btn"
                  onClick={handleConfirmAccept}
                >
                  Confirm Accept
                </button>
                <button
                  className="view-contract-btn"
                  onClick={() => setShowAcceptModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Popup */}
        {popup.show && (
          <div className="popup-overlay">
            <div className="popup-card">{popup.message}</div>
          </div>
        )}
      </div>
    </>
  );
}
