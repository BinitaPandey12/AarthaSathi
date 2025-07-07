import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "./LenderDashboard.css";
import { loanRequestAPI } from "../services/api";
import LoanOfferForm from "../components/LoanOfferForm";

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
  const [loanRequests, setLoanRequests] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [activeLoans, setActiveLoans] = useState(initialActiveLoans);
  const [showLoanOfferForm, setShowLoanOfferForm] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "" });
  const [loading, setLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestDetails, setRequestDetails] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load loan requests summary for lender dashboard
      const requests = await loanRequestAPI.getLoanRequestsSummary();
      setLoanRequests(requests);
    } catch (error) {
      console.error("Error loading data:", error);
      setPopup({
        show: true,
        message: "Error loading data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoanOfferSuccess = () => {
    setPopup({ show: true, message: "Loan offer created successfully!" });
    loadData(); // Reload data
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

  // Handler for View Request button
  const handleViewRequest = async (requestId) => {
    setLoading(true);
    try {
      // Fetch all details (assuming the API returns an array, find the right one)
      const allDetails = await loanRequestAPI.getMyLoanRequests();
      const details = allDetails.find((r) => r.id === requestId);
      setRequestDetails(details);
      setShowRequestModal(true);
    } catch {
      setPopup({ show: true, message: "Failed to load request details." });
    } finally {
      setLoading(false);
    }
  };

  // Handler for Approve/Reject (just move to pending section in state)
  const handleApprove = () => {
    setShowRequestModal(false);
    // Optionally update state to move to pending
  };
  const handleReject = () => {
    setShowRequestModal(false);
    // Optionally update state to move to pending
  };

  return (
    <>
      {/* Navbar */}
      <nav className="lender-navbar">
        <div className="navbar-title">Lender Dashboard</div>
        <button className="navbar-logout-btn">Logout</button>
      </nav>
      <div
        className="lender-dashboard-root"
        style={{ background: "#f7f8fc", minHeight: "100vh" }}
      >
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
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        Loading loan requests...
                      </td>
                    </tr>
                  ) : loanRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          color: "#888",
                        }}
                      >
                        No loan requests available.
                      </td>
                    </tr>
                  ) : (
                    loanRequests.map((req) => (
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
                                {req.borrowerName || "Anonymous"}
                              </div>
                              <div
                                style={{ fontSize: "0.95rem", color: "#555" }}
                              >
                                {req.purpose || "Not specified"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>₹{req.amount?.toLocaleString()}</td>
                        <td>{req.maxInterestRate}%</td>
                        <td>
                          {new Date(req.repaymentDate).toLocaleDateString()}
                        </td>
                        <td>8.5/10</td>
                        <td>
                          <button
                            className="make-offer-btn"
                            onClick={() => handleViewRequest(req.id)}
                          >
                            View Request
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

        {/* Loan Offer Form Modal */}
        {showLoanOfferForm && requestDetails && (
          <LoanOfferForm
            loanRequest={requestDetails}
            onClose={() => setShowLoanOfferForm(false)}
            onSuccess={handleLoanOfferSuccess}
          />
        )}

        {/* Popup */}
        {popup.show && (
          <div className="popup-overlay">
            <div className="popup-card">{popup.message}</div>
          </div>
        )}

        {/* Request Details Modal */}
        {showRequestModal && requestDetails && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-title">Loan Request Details</div>
              <div className="modal-content">
                <div>
                  <b>Borrower:</b> {requestDetails.borrowerName || "N/A"}
                </div>
                <div>
                  <b>Amount:</b> ₹{requestDetails.amount?.toLocaleString()}
                </div>
                <div>
                  <b>Interest:</b> {requestDetails.maxInterestRate}%
                </div>
                <div>
                  <b>Repayment:</b> {requestDetails.repaymentDate}
                </div>
                <div>
                  <b>Description:</b> {requestDetails.description}
                </div>
              </div>
              <div className="modal-actions">
                <button className="approve-btn" onClick={handleApprove}>
                  Approve
                </button>
                <button className="reject-btn" onClick={handleReject}>
                  Reject
                </button>
                <button
                  className="close-btn"
                  onClick={() => setShowRequestModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
