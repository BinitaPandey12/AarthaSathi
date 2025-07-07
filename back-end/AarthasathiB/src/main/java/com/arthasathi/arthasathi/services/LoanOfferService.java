package com.arthasathi.arthasathi.services;

import com.arthasathi.arthasathi.DTO.LoanOfferDTO;
import com.arthasathi.arthasathi.DTO.LoanOfferSummaryDTO;
import com.arthasathi.arthasathi.DTO.LoanOfferAvailableDTO;
import com.arthasathi.arthasathi.entities.LoanOffer;
import com.arthasathi.arthasathi.entities.LoanOfferStatus;
import com.arthasathi.arthasathi.entities.User;
import com.arthasathi.arthasathi.repositories.LoanOfferRepository;
import com.arthasathi.arthasathi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LoanOfferService {

    @Autowired
    private LoanOfferRepository loanOfferRepository;

    @Autowired
    private UserRepository userRepository;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // Create a new loan offer
    public LoanOfferDTO createLoanOffer(LoanOfferDTO loanOfferDTO, String userEmail) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        if (user.getRole() != com.arthasathi.arthasathi.entities.Role.LENDER) {
            throw new RuntimeException("Only lenders can create loan offers");
        }

        LoanOffer loanOffer = new LoanOffer();
        loanOffer.setLender(user);
        loanOffer.setAmount(loanOfferDTO.getAmount());
        loanOffer.setInterestRate(loanOfferDTO.getInterestRate());
        loanOffer.setRepaymentDate(loanOfferDTO.getRepaymentDate());
        loanOffer.setDescription(loanOfferDTO.getDescription());
        loanOffer.setStatus(LoanOfferStatus.AVAILABLE);

        LoanOffer savedOffer = loanOfferRepository.save(loanOffer);
        return convertToDTO(savedOffer);
    }

    // Get all available loan offers for borrowers dashboard
    public List<LoanOfferDTO> getAllAvailableLoanOffers() {
        List<LoanOffer> offers = loanOfferRepository.findByStatusOrderByCreatedAtDesc(LoanOfferStatus.AVAILABLE);
        return offers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get loan offers by lender
    public List<LoanOfferDTO> getLoanOffersByLender(String userEmail) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        List<LoanOffer> offers = loanOfferRepository.findByLenderOrderByCreatedAtDesc(userOpt.get());
        return offers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get loan offer by ID
    public LoanOfferDTO getLoanOfferById(Long id) {
        Optional<LoanOffer> offerOpt = loanOfferRepository.findById(id);
        if (offerOpt.isEmpty()) {
            throw new RuntimeException("Loan offer not found");
        }
        return convertToDTO(offerOpt.get());
    }

    // Update loan offer status
    public LoanOfferDTO updateLoanOfferStatus(Long id, LoanOfferStatus status) {
        Optional<LoanOffer> offerOpt = loanOfferRepository.findById(id);
        if (offerOpt.isEmpty()) {
            throw new RuntimeException("Loan offer not found");
        }

        LoanOffer offer = offerOpt.get();
        offer.setStatus(status);
        LoanOffer savedOffer = loanOfferRepository.save(offer);
        return convertToDTO(savedOffer);
    }

    // Cancel loan offer
    public LoanOfferDTO cancelLoanOffer(Long id, String userEmail) {
        Optional<LoanOffer> offerOpt = loanOfferRepository.findById(id);
        if (offerOpt.isEmpty()) {
            throw new RuntimeException("Loan offer not found");
        }

        LoanOffer offer = offerOpt.get();
        if (!offer.getLender().getEmail().equals(userEmail)) {
            throw new RuntimeException("You can only cancel your own loan offers");
        }

        if (offer.getStatus() != LoanOfferStatus.AVAILABLE) {
            throw new RuntimeException("Only available loan offers can be cancelled");
        }

        offer.setStatus(LoanOfferStatus.CANCELLED);
        LoanOffer savedOffer = loanOfferRepository.save(offer);
        return convertToDTO(savedOffer);
    }

    // Filter loan offers by amount range
    public List<LoanOfferDTO> getLoanOffersByAmountRange(java.math.BigDecimal minAmount, java.math.BigDecimal maxAmount) {
        List<LoanOffer> offers = loanOfferRepository.findByAmountBetweenAndStatus(minAmount, maxAmount, LoanOfferStatus.AVAILABLE);
        return offers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Filter loan offers by interest rate
    public List<LoanOfferDTO> getLoanOffersByInterestRate(java.math.BigDecimal maxInterestRate) {
        List<LoanOffer> offers = loanOfferRepository.findByInterestRateLessThanOrEqualToAndStatus(maxInterestRate, LoanOfferStatus.AVAILABLE);
        return offers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Filter loan offers by interest rate range
    public List<LoanOfferDTO> getLoanOffersByInterestRateRange(java.math.BigDecimal minRate, java.math.BigDecimal maxRate) {
        List<LoanOffer> offers = loanOfferRepository.findByInterestRateBetweenAndStatus(minRate, maxRate, LoanOfferStatus.AVAILABLE);
        return offers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get all available loan offer summaries for borrowers
    public List<LoanOfferSummaryDTO> getAllLoanOfferSummaries() {
        List<LoanOffer> offers = loanOfferRepository.findByStatusOrderByCreatedAtDesc(com.arthasathi.arthasathi.entities.LoanOfferStatus.AVAILABLE);
        return offers.stream().map(offer -> {
            LoanOfferSummaryDTO dto = new LoanOfferSummaryDTO();
            dto.setAmount(offer.getAmount());
            dto.setInterestRate(offer.getInterestRate());
            dto.setRepaymentDate(offer.getRepaymentDate());
            dto.setTrustScore(5); // Default
            return dto;
        }).collect(java.util.stream.Collectors.toList());
    }

    // Get all available loan offers for borrowers with only required fields
    public List<LoanOfferAvailableDTO> getAllAvailableLoanOffersForBorrower() {
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        List<LoanOffer> offers = loanOfferRepository.findByStatusOrderByCreatedAtDesc(com.arthasathi.arthasathi.entities.LoanOfferStatus.AVAILABLE);
        return offers.stream().map(offer -> {
            LoanOfferAvailableDTO dto = new LoanOfferAvailableDTO();
            dto.setAmount(offer.getAmount());
            dto.setInterestRate(offer.getInterestRate());
            dto.setRepaymentDate(offer.getRepaymentDate());
            dto.setDescription(offer.getDescription());
            dto.setLenderName(offer.getLender().getName());
            dto.setLenderEmail(offer.getLender().getEmail());
            dto.setCreatedAt(offer.getCreatedAt().format(formatter));
            return dto;
        }).collect(java.util.stream.Collectors.toList());
    }

    // Convert entity to DTO
    private LoanOfferDTO convertToDTO(LoanOffer loanOffer) {
        LoanOfferDTO dto = new LoanOfferDTO();
        dto.setId(loanOffer.getId());
        dto.setAmount(loanOffer.getAmount());
        dto.setInterestRate(loanOffer.getInterestRate());
        dto.setRepaymentDate(loanOffer.getRepaymentDate());
        dto.setDescription(loanOffer.getDescription());
        dto.setLenderName(loanOffer.getLender().getName());
        dto.setLenderEmail(loanOffer.getLender().getEmail());
        dto.setStatus(loanOffer.getStatus().name());
        dto.setCreatedAt(loanOffer.getCreatedAt().format(formatter));
        return dto;
    }
}