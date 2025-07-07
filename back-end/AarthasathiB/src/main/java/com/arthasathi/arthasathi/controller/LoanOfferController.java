package com.arthasathi.arthasathi.controller;

import com.arthasathi.arthasathi.DTO.LoanOfferDTO;
import com.arthasathi.arthasathi.entities.LoanOfferStatus;
import com.arthasathi.arthasathi.services.LoanOfferService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/loan-offers")
//@CrossOrigin(origins = "*")
public class LoanOfferController {

    @Autowired
    private LoanOfferService loanOfferService;

    // Create a new loan offer (Lenders only)
    @PostMapping
    public ResponseEntity<LoanOfferDTO> createLoanOffer(@Valid @RequestBody LoanOfferDTO loanOfferDTO) {
        String userEmail = getCurrentUserEmail();
        LoanOfferDTO createdOffer = loanOfferService.createLoanOffer(loanOfferDTO, userEmail);
        return ResponseEntity.ok(createdOffer);
    }

    // Get all available loan offers (for borrowers dashboard)
    @GetMapping("/available")
    public ResponseEntity<List<LoanOfferDTO>> getAllAvailableLoanOffers() {
        List<LoanOfferDTO> offers = loanOfferService.getAllAvailableLoanOffers();
        return ResponseEntity.ok(offers);
    }

    // Get loan offers by current lender
    @GetMapping("/my-offers")
    public ResponseEntity<List<LoanOfferDTO>> getMyLoanOffers() {
        String userEmail = getCurrentUserEmail();
        List<LoanOfferDTO> offers = loanOfferService.getLoanOffersByLender(userEmail);
        return ResponseEntity.ok(offers);
    }

    // Get loan offer by ID
    @GetMapping("/{id}")
    public ResponseEntity<LoanOfferDTO> getLoanOfferById(@PathVariable Long id) {
        LoanOfferDTO offer = loanOfferService.getLoanOfferById(id);
        return ResponseEntity.ok(offer);
    }

    // Update loan offer status (Admin/Borrower functionality)
    @PutMapping("/{id}/status")
    public ResponseEntity<LoanOfferDTO> updateLoanOfferStatus(
            @PathVariable Long id,
            @RequestParam LoanOfferStatus status) {
        LoanOfferDTO updatedOffer = loanOfferService.updateLoanOfferStatus(id, status);
        return ResponseEntity.ok(updatedOffer);
    }

    // Cancel loan offer (Lender can cancel their own offers)
    @PutMapping("/{id}/cancel")
    public ResponseEntity<LoanOfferDTO> cancelLoanOffer(@PathVariable Long id) {
        String userEmail = getCurrentUserEmail();
        LoanOfferDTO cancelledOffer = loanOfferService.cancelLoanOffer(id, userEmail);
        return ResponseEntity.ok(cancelledOffer);
    }

    // Filter loan offers by amount range
    @GetMapping("/filter/amount")
    public ResponseEntity<List<LoanOfferDTO>> getLoanOffersByAmountRange(
            @RequestParam BigDecimal minAmount,
            @RequestParam BigDecimal maxAmount) {
        List<LoanOfferDTO> offers = loanOfferService.getLoanOffersByAmountRange(minAmount, maxAmount);
        return ResponseEntity.ok(offers);
    }

    // Filter loan offers by interest rate (max rate)
    @GetMapping("/filter/interest-rate")
    public ResponseEntity<List<LoanOfferDTO>> getLoanOffersByInterestRate(
            @RequestParam BigDecimal maxInterestRate) {
        List<LoanOfferDTO> offers = loanOfferService.getLoanOffersByInterestRate(maxInterestRate);
        return ResponseEntity.ok(offers);
    }

    // Filter loan offers by interest rate range
    @GetMapping("/filter/interest-rate-range")
    public ResponseEntity<List<LoanOfferDTO>> getLoanOffersByInterestRateRange(
            @RequestParam BigDecimal minRate,
            @RequestParam BigDecimal maxRate) {
        List<LoanOfferDTO> offers = loanOfferService.getLoanOffersByInterestRateRange(minRate, maxRate);
        return ResponseEntity.ok(offers);
    }

    // Helper method to get current user email
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
