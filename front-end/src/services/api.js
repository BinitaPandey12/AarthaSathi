const API_BASE_URL = "http://localhost:8080/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Loan Request APIs
export const loanRequestAPI = {
  // Create a new loan request (borrower)
  createLoanRequest: async (loanData) => {
    const response = await fetch(`${API_BASE_URL}/loan-requests`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(loanData),
    });
    return handleResponse(response);
  },

  // Get summary of loan requests for lender dashboard
  getLoanRequestsSummary: async () => {
    const response = await fetch(
      `${API_BASE_URL}/loan-requests/my-requests-summary`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Get detailed loan requests (for view request modal)
  getMyLoanRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/loan-requests/my-requests`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get all loan requests (for lenders to see)
  getAllLoanRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/loan-requests`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Loan Offer APIs
export const loanOfferAPI = {
  // Create a loan offer
  createLoanOffer: async (offerData) => {
    const response = await fetch(`${API_BASE_URL}/loan-offers`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(offerData),
    });
    return handleResponse(response);
  },

  // Get lender's own loan offers
  getMyLoanOffers: async () => {
    const response = await fetch(`${API_BASE_URL}/loan-offers/my-offers`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get all loan offers (for borrowers to see)
  getAllLoanOffers: async () => {
    const response = await fetch(`${API_BASE_URL}/loan-offers`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Auth API (if needed for token management)
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};
