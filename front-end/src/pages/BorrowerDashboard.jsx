import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./BorrowerDashboard.css";

const initialLenderOffers = [
  {
    id: 1,
    lender: "Meena Patel",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    location: "Tailor, Mumbai",
    amount: 15000,
    interest: 18,
    repayment: "15 Dec 2023",
    trustScore: 7.2,
  },
  {
    id: 2,
    lender: "Sunita Devi",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
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
    lender: "Kavita Singh",
    location: "Beauty Salon, Bangalore",
    amount: 20000,
    interest: 18,
    repayment: "15 Feb 2024",
    status: "Active Loan",
    contract: true,
    disbursedDate: "15 Nov 2023",
  },
  {
    id: 4,
    lender: "Sita Devi",
    location: "Tailor, Mumbai",
    amount: 10000,
    interest: 15,
    repayment: "10 Mar 2024",
    status: "Active Loan",
    contract: true,
    disbursedDate: "20 Nov 2023",
  },
];

export default function BorrowerDashboard() {
  const [lenderOffers, setLenderOffers] = useState(initialLenderOffers);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [activeLoans, setActiveLoans] = useState(initialActiveLoans);
  const [showOffer, setShowOffer] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [popup, setPopup] = useState({ show: false, message: "" });
  const [newLoanForm, setNewLoanForm] = useState({
    amount: "",
    maxInterest: "",
    repaymentDate: "",
    description: "",
  });

  // View Offer Modal logic
  const openOffer = (offer) => {
    setSelectedOffer(offer);
    setShowOffer(true);
  };
  const closeOffer = () => {
    setShowOffer(false);
    setSelectedOffer(null);
  };
  // Accept Offer logic
  const acceptOffer = () => {
    setShowOffer(false);
    setPopup({
      show: true,
      message: "Offer accepted! Waiting for lender payment.",
    });
    setTimeout(() => {
      setPopup({ show: false, message: "" });
      setLenderOffers(lenderOffers.filter((o) => o.id !== selectedOffer.id));
      setPendingLoans([
        ...pendingLoans,
        {
          ...selectedOffer,
          status: "Waiting for Lender Payment",
          acceptedDate: new Date().toLocaleDateString("en-GB"),
        },
      ]);
      setSelectedOffer(null);
    }, 1500);
  };
  // Simulate lender payment for demo
  const handleLenderPayment = (loan) => {
    setPopup({
      show: true,
      message: "Lender payment received! Loan is now active.",
    });
    setTimeout(() => {
      setPopup({ show: false, message: "" });
      setPendingLoans(pendingLoans.filter((l) => l.id !== loan.id));
      setActiveLoans([
        ...activeLoans,
        {
          ...loan,
          status: "Active Loan",
          disbursedDate: new Date().toLocaleDateString("en-GB"),
        },
      ]);
    }, 1500);
  };

  // const createLoanRequest = () => {
  //   if (!newLoanForm.amount || !newLoanForm.maxInterest || !newLoanForm.repaymentDate) {
  //     alert('Please fill all required fields');
  //     return;
  //   }
  //   setShowOffer(true);
  // };
  // const confirmCreate = () => {
  //   // Here you would typically make an API call
  //   alert('Loan request created successfully!');
  //   setShowOffer(false);
  //   setNewLoanForm({ amount: '', maxInterest: '', repaymentDate: '', description: '' });
  // };

  return (
    <>
      {/* Navbar */}
      <nav className="borrower-navbar">
        <div className="navbar-title">Borrower Dashboard</div>
        <button className="navbar-logout-btn">Logout</button>
      </nav>
      <div className="borrower-dashboard-root">
        {/* Header */}
        <header className="borrower-header">
          <img src={logo} alt="AarthaSathi Logo" className="borrower-logo" />
          <div className="borrower-welcome">
            <div className="borrower-title">Welcome back, Meena Patel!</div>
            <div className="borrower-desc">
              Here's your borrowing dashboard where you can request loans and
              manage your active loans.
            </div>
          </div>
          <div className="borrower-cards">
            <div className="borrower-card trust">
              <div className="card-label">Your Trust Score</div>
              <div className="card-value">8.7/10</div>
              <div className="card-desc">Very Trusted Borrower</div>
            </div>
            <div className="borrower-card safety">
              <div className="card-label">Safety Pool</div>
              <div className="card-value">₹25,450</div>
              <div className="card-desc">5% of your loans</div>
            </div>
          </div>
        </header>

        {/* Loan Offers from Lenders */}
        <section className="borrower-section">
          <div className="section-title">Loan Offers from Lenders</div>
          <div className="section-desc">
            These are loan offers matching your requirements.
          </div>
          <div className="borrower-table-wrapper">
            <table className="borrower-table">
              <thead>
                <tr>
                  <th>Lender</th>
                  <th>Amount</th>
                  <th>Interest</th>
                  <th>Repayment</th>
                  <th>Trust Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lenderOffers.map((offer) => (
                  <tr key={offer.id}>
                    <td>
                      <div
                        className="lender-info"
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
                          <div className="lender-name">{offer.lender}</div>
                          <div className="lender-location">
                            {offer.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>₹{offer.amount.toLocaleString()}</td>
                    <td>{offer.interest}%</td>
                    <td>{offer.repayment}</td>
                    <td>{offer.trustScore}/10</td>
                    <td>
                      <button
                        className="view-offer-btn"
                        onClick={() => openOffer(offer)}
                      >
                        View Offer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pending Loans */}
        <section className="borrower-section pending-section smart-pending-section">
          <div className="section-title">Pending Loans</div>
          <div className="section-desc">
            Loans you've accepted, waiting for lender payment.
          </div>
          <div className="pending-loans-grid smart-pending-grid">
            {pendingLoans.length === 0 ? (
              <div className="pending-empty">
                No pending loans at the moment.
              </div>
            ) : (
              pendingLoans.map((loan) => (
                <div
                  className="pending-loan-card smart-pending-card"
                  key={loan.id}
                >
                  <div className="loan-header">
                    <div className="loan-lender">{loan.lender}</div>
                    <div className="loan-location">{loan.location}</div>
                    <span className="loan-status pending">Pending</span>
                  </div>
                  <div className="loan-details">
                    <div>
                      Amount <b>₹{loan.amount.toLocaleString()}</b>
                    </div>
                    <div>
                      Interest <b>{loan.interest}%</b>
                    </div>
                    <div>
                      Repays <b>{loan.repayment}</b>
                    </div>
                  </div>
                  <div className="loan-info">
                    <div>Accepted: {loan.acceptedDate}</div>
                    <div>Status: {loan.status}</div>
                  </div>
                  {/* For demo: simulate lender payment */}
                  <div className="loan-actions">
                    <button
                      className="make-offer-btn"
                      onClick={() => handleLenderPayment(loan)}
                    >
                      Simulate Lender Payment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Two-column layout: left = My Active Loans, right = Create New Loan Offer */}
        <div className="borrower-main-columns smart-ui">
          {/* My Active Loans - Left Side */}
          <section className="borrower-section active-loans-section smart-active-section">
            <div className="section-title">My Active Loans</div>
            <div className="active-loans-grid smart-active-grid">
              {activeLoans.map((loan) => (
                <div
                  className="active-loan-card smart-active-card"
                  key={loan.id}
                >
                  <div className="loan-header">
                    <div className="loan-lender">{loan.lender}</div>
                    <div className="loan-location">{loan.location}</div>
                    <span className="loan-status active">Active</span>
                  </div>
                  <div className="loan-details">
                    <div>
                      Amount <b>₹{loan.amount.toLocaleString()}</b>
                    </div>
                    <div>
                      Interest <b>{loan.interest}%</b>
                    </div>
                    <div>
                      Repays <b>{loan.repayment}</b>
                    </div>
                  </div>
                  <div className="loan-info">
                    <div>Disbursed: {loan.disbursedDate}</div>
                    <div>Status: {loan.status}</div>
                  </div>
                  <div className="loan-actions">
                    {loan.contract && (
                      <button className="contract-btn">View Contract</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* Create New Loan Request - Right Side */}
          <section className="borrower-section create-loan-section smart-offer-section">
            <div className="section-title">Create New Loan Request</div>
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
                value={newLoanForm.maxInterest}
                onChange={(e) =>
                  setNewLoanForm({
                    ...newLoanForm,
                    maxInterest: e.target.value,
                  })
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
                placeholder="Brief Description"
                value={newLoanForm.description}
                onChange={(e) =>
                  setNewLoanForm({
                    ...newLoanForm,
                    description: e.target.value,
                  })
                }
              />
              <button className="post-loan-btn">Post Loan Request</button>
            </div>
          </section>
        </div>

        {/* Offer Modal */}
        {showOffer && selectedOffer && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-title">Loan Offer Details</div>
              <div className="modal-content">
                <div>
                  <b>Lender:</b> {selectedOffer.lender}
                </div>
                <div>
                  <b>Location:</b> {selectedOffer.location}
                </div>
                <div>
                  <b>Amount:</b> ₹{selectedOffer.amount.toLocaleString()}
                </div>
                <div>
                  <b>Interest:</b> {selectedOffer.interest}%
                </div>
                <div>
                  <b>Repayment:</b> {selectedOffer.repayment}
                </div>
                <div>
                  <b>Trust Score:</b> {selectedOffer.trustScore}/10
                </div>
              </div>
              <div className="modal-actions">
                <button className="make-offer-btn" onClick={acceptOffer}>
                  Accept Offer
                </button>
                <button className="view-contract-btn" onClick={closeOffer}>
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

        {/* Things to Know Before Borrowing */}
        <section className="learn-section">
          <div className="learn-title">Things to Know Before Borrowing</div>
          <div className="learn-content">
            <div className="learn-item">
              <div className="learn-item-title">Safety Pool</div>
              <div className="learn-item-desc">
                A small portion of each loan goes into a safety pool to protect
                lenders in case of fraud. This ensures the platform remains safe
                for all users.
              </div>
            </div>
            <div className="learn-item">
              <div className="learn-item-title">Digital Contracts</div>
              <div className="learn-item-desc">
                All loans are backed by digital contracts that clearly outline
                terms, interest rates, and repayment schedules.
              </div>
            </div>
            <div className="learn-item">
              <div className="learn-item-title">Trust Scores</div>
              <div className="learn-item-desc">
                Your trust score is based on your borrowing history and
                repayment behavior. Higher scores help you get better loan
                terms.
              </div>
            </div>
            <div className="learn-item">
              <div className="learn-item-title">Escrow System</div>
              <div className="learn-item-desc">
                Funds are held securely in escrow until both parties agree on
                the loan terms, ensuring safe and transparent transactions.
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
