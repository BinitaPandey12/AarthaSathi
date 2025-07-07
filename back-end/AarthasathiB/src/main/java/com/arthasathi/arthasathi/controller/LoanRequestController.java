package com.arthasathi.arthasathi.controller;

import com.arthasathi.arthasathi.DTO.LoanRequestDTO;
import com.arthasathi.arthasathi.DTO.LoanRequestWithoutStatusDTO;
import com.arthasathi.arthasathi.DTO.LoanRequestSummaryDTO;
import com.arthasathi.arthasathi.entities.LoanRequestStatus;
import com.arthasathi.arthasathi.services.LoanRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/loan-requests")
@CrossOrigin(origins = "*")
public class LoanRequestController {

    @Autowired
    private LoanRequestService loanRequestService;

    // Create a new loan request (Borrowers only)
    @PostMapping
    public ResponseEntity<LoanRequestDTO> createLoanRequest(@Valid @RequestBody LoanRequestDTO loanRequestDTO) {
        String userEmail = getCurrentUserEmail();
        LoanRequestDTO createdRequest = loanRequestService.createLoanRequest(loanRequestDTO, userEmail);
        return ResponseEntity.ok(createdRequest);
    }

    // Get all pending loan requests (for lenders dashboard)
    @GetMapping("/pending")
    public ResponseEntity<List<LoanRequestDTO>> getAllPendingLoanRequests() {
        List<LoanRequestDTO> requests = loanRequestService.getAllPendingLoanRequests();
        return ResponseEntity.ok(requests);
    }

    // Get loan requests by current borrower
    @GetMapping("/my-requests")
    public ResponseEntity<List<LoanRequestWithoutStatusDTO>> getMyLoanRequests() {
        String userEmail = getCurrentUserEmail();
        List<LoanRequestWithoutStatusDTO> requests = loanRequestService.getLoanRequestsByBorrower(userEmail);
        return ResponseEntity.ok(requests);
    }

    // Get loan request summaries by current borrower (with trust score)
    @GetMapping("/my-requests-summary")
    public ResponseEntity<List<LoanRequestSummaryDTO>> getMyLoanRequestSummaries() {
        String userEmail = getCurrentUserEmail();
        List<LoanRequestSummaryDTO> requests = loanRequestService.getLoanRequestSummariesByBorrower(userEmail);
        return ResponseEntity.ok(requests);
    }

    // Get loan request by ID
    @GetMapping("/{id}")
    public ResponseEntity<LoanRequestDTO> getLoanRequestById(@PathVariable Long id) {
        LoanRequestDTO request = loanRequestService.getLoanRequestById(id);
        return ResponseEntity.ok(request);
    }

    // Update loan request status (Admin/Lender functionality)
    @PutMapping("/{id}/status")
    public ResponseEntity<LoanRequestDTO> updateLoanRequestStatus(
            @PathVariable Long id,
            @RequestParam LoanRequestStatus status) {
        LoanRequestDTO updatedRequest = loanRequestService.updateLoanRequestStatus(id, status);
        return ResponseEntity.ok(updatedRequest);
    }

    // Cancel loan request (Borrower can cancel their own requests)
    @PutMapping("/{id}/cancel")
    public ResponseEntity<LoanRequestDTO> cancelLoanRequest(@PathVariable Long id) {
        String userEmail = getCurrentUserEmail();
        LoanRequestDTO cancelledRequest = loanRequestService.cancelLoanRequest(id, userEmail);
        return ResponseEntity.ok(cancelledRequest);
    }

    // Filter loan requests by amount range
    @GetMapping("/filter/amount")
    public ResponseEntity<List<LoanRequestDTO>> getLoanRequestsByAmountRange(
            @RequestParam BigDecimal minAmount,
            @RequestParam BigDecimal maxAmount) {
        List<LoanRequestDTO> requests = loanRequestService.getLoanRequestsByAmountRange(minAmount, maxAmount);
        return ResponseEntity.ok(requests);
    }

    // Filter loan requests by interest rate
    @GetMapping("/filter/interest-rate")
    public ResponseEntity<List<LoanRequestDTO>> getLoanRequestsByInterestRate(
            @RequestParam BigDecimal minInterestRate) {
        List<LoanRequestDTO> requests = loanRequestService.getLoanRequestsByInterestRate(minInterestRate);
        return ResponseEntity.ok(requests);
    }

    // Helper method to get current user email
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}