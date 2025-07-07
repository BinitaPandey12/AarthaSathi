package com.arthasathi.arthasathi.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LoanOfferSummaryDTO {
    private BigDecimal amount;
    private BigDecimal interestRate;
    private LocalDate repaymentDate;
    private int trustScore = 5; // Default for all

    // Getters and setters
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }

    public LocalDate getRepaymentDate() { return repaymentDate; }
    public void setRepaymentDate(LocalDate repaymentDate) { this.repaymentDate = repaymentDate; }

    public int getTrustScore() { return trustScore; }
    public void setTrustScore(int trustScore) { this.trustScore = trustScore; }
}