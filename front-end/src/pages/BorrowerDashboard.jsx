import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "./BorrowerDashboard.css";
import { useNavigate } from "react-router-dom";

export default function BorrowerDashboard() {
  const navigate = useNavigate();
  // Replace initialLenderOffers with empty array
  const [lenderOffers, setLenderOffers] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [showOffer, setShowOffer] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [popup, setPopup] = useState({ show: false, message: "" });
  const [postedLoans, setPostedLoans] = useState([]);
  // Add loading state
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [newLoanForm, setNewLoanForm] = useState({
    amount: "",
    maxInterestRate: "",
    repaymentDate: "",
    description: "",
  });

  // Fetch available loan offers from API
  useEffect(() => {
    const fetchLoanOffers = async () => {
      setIsLoadingOffers(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/loan-offers/available-summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch offers");

        const offers = await response.json();
        setLenderOffers(offers);
      } catch (error) {
        setPopup({ show: true, message: error.message });
      } finally {
        setIsLoadingOffers(false);
      }
    };

    fetchLoanOffers();
  }, []);

  // Fetch detailed offer when clicked
  const fetchOfferDetails = async (offerId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/loan-offers/${offerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch offer details");

      const offerDetails = await response.json();
      setSelectedOffer({
        ...offerDetails,
        lender: offerDetails.lenderName,
        interest: offerDetails.interestRate,
        repayment: offerDetails.repaymentDate,
        trustScore: offerDetails.trustScore || 5,
      });
      setShowOffer(true);
    } catch (error) {
      setPopup({ show: true, message: error.message });
    }
  };

  const userData = JSON.parse(localStorage.getItem("user"));
  const userName = userData?.name || "User";

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to landing page
    navigate("/");
  };
  const createLoanRequest = async () => {
    try {
      // Validation
      if (
        !newLoanForm.amount ||
        !newLoanForm.maxInterestRate ||
        !newLoanForm.repaymentDate
      ) {
        setPopup({ show: true, message: "Please fill all required fields" });
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login again - session expired");
      }

      const loanRequestData = {
        amount: parseFloat(newLoanForm.amount),
        maxInterestRate: parseFloat(newLoanForm.maxInterestRate),
        repaymentDate: newLoanForm.repaymentDate,
        description: newLoanForm.description,
      };

      const response = await fetch("http://localhost:8080/api/loan-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(loanRequestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create loan request");
      }

      const result = await response.json();
<<<<<<< HEAD
      setPostedLoans([
        ...postedLoans,
        {
          id: result.id,
          amount: newLoanForm.amount,
          maxInterestRate: newLoanForm.maxInterestRate,
          repaymentDate: newLoanForm.repaymentDate,
          description: newLoanForm.description,
          status: "Waiting for Lender",
          postedDate: new Date().toLocaleDateString("en-GB"),
        },
      ]);
=======
      setPostedLoans([...postedLoans, {
      id: result.id,
      amount: newLoanForm.amount,
      maxInterestRate: newLoanForm.maxInterestRate,
      repaymentDate: newLoanForm.repaymentDate,
      description: newLoanForm.description,
      status: "Waiting for Lender",
      postedDate: new Date().toLocaleDateString("en-GB")
    }]);
>>>>>>> more update

      // Clear form
      setNewLoanForm({
        amount: "",
        maxInterestRate: "",
        repaymentDate: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating loan request:", error);
      setPopup({
        show: true,
        message: error.message.includes("session expired")
          ? "Session expired. Please login again."
          : error.message || "Failed to create loan request",
      });
    }

    setTimeout(() => setPopup({ show: false, message: "" }), 3000);
  };

  // View Offer Modal logic

  const closeOffer = () => {
    setShowOffer(false);
    setSelectedOffer(null);
  };
  // Accept Offer logic
<<<<<<< HEAD
  const acceptOffer = async () => {
    try {
      const token = localStorage.getItem("token");

      // Show processing popup
      setPopup({
        show: true,
        message: "Accepting the loan offer...",
      });

      const response = await fetch(
        `http://localhost:8080/api/loan-offers/${selectedOffer.id}/accept`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Offer acceptance failed!");

      // Update all states
      setPostedLoans(
        postedLoans.filter(
          (loan) => loan.id !== selectedOffer.loanRequestId // Remove from posted loans
        )
      );

      setLenderOffers(
        lenderOffers.filter((offer) => offer.id !== selectedOffer.id)
      );

      setPendingLoans([
        ...pendingLoans,
        {
          ...selectedOffer,
          status: "Waiting for Lender Payment",
          acceptedDate: new Date().toLocaleDateString("en-GB"),
        },
      ]);

      setShowOffer(false);
      setPopup({
        show: true,
        message: "✓ Offer accepted! Waiting for lender's payment.",
      });
    } catch (err) {
      setPopup({
        show: true,
        message: "✗ " + (err.message || "Failed to accept offer"),
      });
    } finally {
      setTimeout(() => setPopup({ show: false }), 3000);
    }
  };
=======
const acceptOffer = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8080/api/loan-offers/${selectedOffer.id}/accept`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Offer acceptance failed!");

    // Update all relevant states
    setPostedLoans(postedLoans.filter(loan => 
      loan.id !== selectedOffer.loanRequestId // Remove from posted loans
    ));
    
    setLenderOffers(
      lenderOffers.filter(offer => offer.id !== selectedOffer.id)
    );
    
    setPendingLoans([
      ...pendingLoans,
      {
        ...selectedOffer,
        status: "Waiting for Lender Payment",
        acceptedDate: new Date().toLocaleDateString("en-GB"),
      },
    ]);

    setShowOffer(false);
    setPopup({ show: true, message: "Offer accepted successfully!" });

  } catch (err) {
    setPopup({
      show: true,
      message: err.message || "Failed to accept offer",
    });
  }
  setTimeout(() => setPopup({ show: false }), 3000);
};
>>>>>>> more update
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

<<<<<<< HEAD
=======
 
>>>>>>> more update
  // Update your form input to use maxInterestRate
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLoanForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* Navbar */}
      <nav className="borrower-navbar">
        <div className="navbar-title">Borrower Dashboard</div>

        <button className="navbar-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <div className="borrower-dashboard-root">
        {/* Header */}
        <header className="borrower-header">
          <img src={logo} alt="AarthaSathi Logo" className="borrower-logo" />
          <div className="borrower-welcome">
            <div className="borrower-title">
              Welcome back, Welcome,{" "}
              <span className="username">{userName}</span>
            </div>
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
                {isLoadingOffers ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        height: "100px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        fontStyle: "italic",
                        color: "#666",
                      }}
                    >
                      Loading loan offers...
                    </td>
                  </tr>
                ) : lenderOffers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        height: "100px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        fontStyle: "italic",
                        color: "#666",
                      }}
                    >
                      No loan offers available at the moment
                    </td>
                  </tr>
                ) : (
                  lenderOffers.map((offer) => (
                    <tr key={offer.id}>
                      <td>
                        <div className="lender-info">
                          <img
                            src={
                              offer.lenderAvatar ||
                              `https://ui-avatars.com/api/?name=${
                                offer.lenderName?.charAt(0) || "L"
                              }&background=random`
                            }
                            alt="Lender"
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>
                              {offer.lenderName || "Anonymous Lender"}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#555" }}>
                              {offer.lenderLocation || "Location not specified"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>₹{offer.amount.toLocaleString()}</td>
                      <td>{offer.interestRate}%</td>
                      <td>
                        {new Date(offer.repaymentDate).toLocaleDateString()}
                      </td>
                      <td>{offer.trustScore || 5}/10</td>
                      <td>
                        <button
                          className="view-offer-btn"
                          onClick={() => fetchOfferDetails(offer.id)}
                        >
                          View Offer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Posted Loan Requests */}
<<<<<<< HEAD
        <section className="borrower-section posted-section">
          <div className="section-title">Posted Loan Requests</div>
          <div className="section-desc">
            Loans you've requested, waiting for lender acceptance.
          </div>
          <div className="posted-loans-grid">
            {postedLoans.length === 0 ? (
              <div className="posted-empty">No posted loan requests</div>
            ) : (
              postedLoans.map((loan) => (
                <div className="posted-loan-card" key={loan.id}>
                  <div className="loan-header">
                    <div className="loan-amount">₹{loan.amount}</div>
                    <span className="loan-status posted">Posted</span>
                  </div>
                  <div className="loan-details">
                    <div>
                      Max Interest: <b>{loan.maxInterestRate}%</b>
                    </div>
                    <div>
                      Repayment: <b>{loan.repaymentDate}</b>
                    </div>
                    {loan.description && (
                      <div className="loan-desc">{loan.description}</div>
                    )}
                  </div>
                  <div className="loan-info">
                    <div>Posted: {loan.postedDate}</div>
                    <div>Status: {loan.status}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
=======
<section className="borrower-section posted-section">
  <div className="section-title">Posted Loan Requests</div>
  <div className="section-desc">
    Loans you've requested, waiting for lender acceptance.
  </div>
  <div className="posted-loans-grid">
    {postedLoans.length === 0 ? (
      <div className="posted-empty">No posted loan requests</div>
    ) : (
      postedLoans.map((loan) => (
        <div className="posted-loan-card" key={loan.id}>
          <div className="loan-header">
            <div className="loan-amount">₹{loan.amount}</div>
            <span className="loan-status posted">Posted</span>
          </div>
          <div className="loan-details">
            <div>Max Interest: <b>{loan.maxInterestRate}%</b></div>
            <div>Repayment: <b>{loan.repaymentDate}</b></div>
            {loan.description && (
              <div className="loan-desc">{loan.description}</div>
            )}
          </div>
          <div className="loan-info">
            <div>Posted: {loan.postedDate}</div>
            <div>Status: {loan.status}</div>
          </div>
        </div>
      ))
    )}
  </div>
</section>
>>>>>>> more update

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
          {/* Create New Loan Offer - Right Side */}
          <section className="borrower-section create-loan-section smart-offer-section">
            <div className="section-title">Create New Loan Request</div>
            <div className="create-loan-form">
              <input
                type="number"
                name="amount"
                placeholder="Loan Amount (₹)"
                value={newLoanForm.amount}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="maxInterestRate"
                placeholder="Max Interest Rate (%)"
                value={newLoanForm.maxInterestRate}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="repaymentDate"
                placeholder="Repayment Date (YYYY-MM-DD)"
                value={newLoanForm.repaymentDate}
                onChange={handleInputChange}
              />
              <textarea
                name="description"
                placeholder="Brief Description"
                value={newLoanForm.description}
                onChange={handleInputChange}
              />
              <button
                className="post-loan-btn"
                onClick={createLoanRequest}
                disabled={
                  !newLoanForm.amount ||
                  !newLoanForm.maxInterestRate ||
                  !newLoanForm.repaymentDate
                }
              >
                Post Loan Request
              </button>
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
                  <b>Lender:</b>{" "}
                  {selectedOffer.lenderName || selectedOffer.lender}
                </div>
                {selectedOffer.lenderEmail && (
                  <div>
                    <b>Email:</b> {selectedOffer.lenderEmail}
                  </div>
                )}
                <div>
                  <b>Amount:</b> ₹{selectedOffer.amount.toLocaleString()}
                </div>
                <div>
                  <b>Interest:</b>{" "}
                  {selectedOffer.interestRate || selectedOffer.interest}%
                </div>
                <div>
                  <b>Repayment:</b>{" "}
                  {new Date(
                    selectedOffer.repaymentDate || selectedOffer.repayment
                  ).toLocaleDateString()}
                </div>
                {selectedOffer.description && (
                  <div>
                    <b>Description:</b> {selectedOffer.description}
                  </div>
                )}
                <div>
                  <b>Status:</b> {selectedOffer.status || "AVAILABLE"}
                </div>
                {selectedOffer.createdAt && (
                  <div>
                    <b>Created:</b>{" "}
                    {new Date(selectedOffer.createdAt).toLocaleString()}
                  </div>
                )}
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
