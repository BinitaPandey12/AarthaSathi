import React, { useState } from 'react';
import './BorrowerDashboard.css';

const BorrowerDashboard = () => {
  // Dummy data for loan status
  const funded = 5000;
  const goal = 15000;
  const lenders = 4;
  const interest = 12;
  const daysLeft = 14;
  const progress = (funded / goal) * 100;

  // Form state (not functional yet)
  const [form, setForm] = useState({
    amount: '',
    purpose: '',
    description: '',
    term: '6',
    maxInterest: '15',
  });

  const purposes = [
    '',
    'Education',
    'Healthcare',
    'Small Business',
    'Emergency',
    'Other',
  ];

  return (
    <div className="borrower-dashboard">
      {/* Loan Status */}
      <div className="dashboard-card loan-status">
        <h2>Your Loan Status</h2>
        <div className="progress-bar-container">
          <span className="progress-label">₹{funded.toLocaleString()}</span>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-label goal">₹{goal.toLocaleString()}</span>
        </div>
        <div className="progress-subtext">{Math.round(progress)}% funded of ₹{goal.toLocaleString()} goal</div>
        <div className="status-stats">
          <div className="stat lenders">
            <div className="stat-label">LENDERS</div>
            <div className="stat-value">{lenders}</div>
          </div>
          <div className="stat interest">
            <div className="stat-label">INTEREST</div>
            <div className="stat-value">{interest}%</div>
          </div>
          <div className="stat days">
            <div className="stat-label">DAYS LEFT</div>
            <div className="stat-value">{daysLeft}</div>
          </div>
        </div>
      </div>

      {/* Request a Loan */}
      <div className="dashboard-card loan-request">
        <h2>Request a Loan</h2>
        <form className="loan-form" onSubmit={e => e.preventDefault()}>
          <label>Loan Amount (₹)</label>
          <input type="number" placeholder="₹ Enter amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />

          <label>Purpose</label>
          <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })}>
            {purposes.map((p, i) => (
              <option key={i} value={p}>{p ? p : 'Select purpose'}</option>
            ))}
          </select>

          <label>Description</label>
          <textarea placeholder="Tell lenders about how you'll use the money" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

          <div className="loan-form-row">
            <div>
              <label>Repayment Term (months)</label>
              <input type="number" value={form.term} onChange={e => setForm({ ...form, term: e.target.value })} />
            </div>
            <div>
              <label>Maximum Interest Rate (%)</label>
              <input type="number" value={form.maxInterest} onChange={e => setForm({ ...form, maxInterest: e.target.value })} />
            </div>
          </div>

          <button type="submit" className="submit-btn">Submit Loan Request</button>
        </form>
      </div>

      {/* Learn Before You Borrow */}
      <div className="dashboard-card learn-section">
        <h2>Learn Before You Borrow</h2>
        <div className="learn-cards">
          <div className="learn-card">
            <img src="https://img.icons8.com/color/96/000000/reading.png" alt="Repayment Strategies" />
            <div>
              <div className="learn-title">Repayment Strategies</div>
              <div className="learn-desc">Learn how to plan your repayments effectively.</div>
            </div>
          </div>
          <div className="learn-card">
            <img src="https://img.icons8.com/ios-filled/100/000000/handshake-heart.png" alt="Responsible borrowing" />
            <div>
              <div className="learn-title">Responsible borrowing</div>
              <div className="learn-desc">Smart Borrowing<br/>Understand how much you should borrow.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowerDashboard;
