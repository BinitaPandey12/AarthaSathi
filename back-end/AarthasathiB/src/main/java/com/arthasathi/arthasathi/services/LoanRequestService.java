package com.arthasathi.arthasathi.services;

import com.arthasathi.arthasathi.DTO.LoanRequestDTO;
import com.arthasathi.arthasathi.DTO.LoanRequestWithoutStatusDTO;
import com.arthasathi.arthasathi.DTO.LoanRequestSummaryDTO;
import com.arthasathi.arthasathi.entities.LoanRequest;
import com.arthasathi.arthasathi.entities.LoanRequestStatus;
import com.arthasathi.arthasathi.entities.User;
import com.arthasathi.arthasathi.repositories.LoanRequestRepository;
import com.arthasathi.arthasathi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LoanRequestService {

    @Autowired
    private LoanRequestRepository loanRequestRepository;

    @Autowired
    private UserRepository userRepository;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // Create a new loan request
    public LoanRequestDTO createLoanRequest(LoanRequestDTO loanRequestDTO, String userEmail) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        if (user.getRole() != com.arthasathi.arthasathi.entities.Role.BORROWER) {
            throw new RuntimeException("Only borrowers can create loan requests");
        }

        LoanRequest loanRequest = new LoanRequest();
        loanRequest.setBorrower(user);
        loanRequest.setAmount(loanRequestDTO.getAmount());
        loanRequest.setMaxInterestRate(loanRequestDTO.getMaxInterestRate());
        loanRequest.setRepaymentDate(loanRequestDTO.getRepaymentDate());
        loanRequest.setDescription(loanRequestDTO.getDescription());
        loanRequest.setStatus(LoanRequestStatus.PENDING);

        LoanRequest savedRequest = loanRequestRepository.save(loanRequest);
        return convertToDTO(savedRequest);
    }

    // Get all loan requests for lenders dashboard
    public List<LoanRequestDTO> getAllPendingLoanRequests() {
        List<LoanRequest> requests = loanRequestRepository.findByStatusOrderByCreatedAtDesc(LoanRequestStatus.PENDING);
        return requests.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get loan requests by borrower
    public List<LoanRequestWithoutStatusDTO> getLoanRequestsByBorrower(String userEmail) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        List<LoanRequest> requests = loanRequestRepository.findByBorrowerOrderByCreatedAtDesc(userOpt.get());
        return requests.stream()
                .map(this::convertToDTOWithoutStatus)
                .collect(Collectors.toList());
    }

    // Get loan request summaries by borrower (with trust score)
    public List<LoanRequestSummaryDTO> getLoanRequestSummariesByBorrower(String userEmail) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        List<LoanRequest> requests = loanRequestRepository.findByBorrowerOrderByCreatedAtDesc(userOpt.get());
        return requests.stream()
                .map(this::convertToSummaryDTO)
                .collect(Collectors.toList());
    }

    // Get loan request by ID
    public LoanRequestDTO getLoanRequestById(Long id) {
        Optional<LoanRequest> requestOpt = loanRequestRepository.findById(id);
        if (requestOpt.isEmpty()) {
            throw new RuntimeException("Loan request not found");
        }
        return convertToDTO(requestOpt.get());
    }

    // Update loan request status
    public LoanRequestDTO updateLoanRequestStatus(Long id, LoanRequestStatus status) {
        Optional<LoanRequest> requestOpt = loanRequestRepository.findById(id);
        if (requestOpt.isEmpty()) {
            throw new RuntimeException("Loan request not found");
        }

        LoanRequest request = requestOpt.get();
        request.setStatus(status);
        LoanRequest savedRequest = loanRequestRepository.save(request);
        return convertToDTO(savedRequest);
    }

    // Cancel loan request
    public LoanRequestDTO cancelLoanRequest(Long id, String userEmail) {
        Optional<LoanRequest> requestOpt = loanRequestRepository.findById(id);
        if (requestOpt.isEmpty()) {
            throw new RuntimeException("Loan request not found");
        }

        LoanRequest request = requestOpt.get();
        if (!request.getBorrower().getEmail().equals(userEmail)) {
            throw new RuntimeException("You can only cancel your own loan requests");
        }

        if (request.getStatus() != LoanRequestStatus.PENDING) {
            throw new RuntimeException("Only pending loan requests can be cancelled");
        }

        request.setStatus(LoanRequestStatus.CANCELLED);
        LoanRequest savedRequest = loanRequestRepository.save(request);
        return convertToDTO(savedRequest);
    }

    // Filter loan requests by amount range
    public List<LoanRequestDTO> getLoanRequestsByAmountRange(java.math.BigDecimal minAmount, java.math.BigDecimal maxAmount) {
        List<LoanRequest> requests = loanRequestRepository.findByAmountBetweenAndStatus(minAmount, maxAmount, LoanRequestStatus.PENDING);
        return requests.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Filter loan requests by interest rate
    public List<LoanRequestDTO> getLoanRequestsByInterestRate(java.math.BigDecimal minInterestRate) {
        List<LoanRequest> requests = loanRequestRepository.findByMaxInterestRateGreaterThanOrEqualToAndStatus(minInterestRate, LoanRequestStatus.PENDING);
        return requests.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Convert entity to DTO
    private LoanRequestDTO convertToDTO(LoanRequest loanRequest) {
        LoanRequestDTO dto = new LoanRequestDTO();
        dto.setId(loanRequest.getId());
        dto.setAmount(loanRequest.getAmount());
        dto.setMaxInterestRate(loanRequest.getMaxInterestRate());
        dto.setRepaymentDate(loanRequest.getRepaymentDate());
        dto.setDescription(loanRequest.getDescription());
        dto.setBorrowerName(loanRequest.getBorrower().getName());
        dto.setBorrowerEmail(loanRequest.getBorrower().getEmail());
        dto.setStatus(loanRequest.getStatus().name());
        dto.setCreatedAt(loanRequest.getCreatedAt().format(formatter));
        return dto;
    }

    // Convert entity to DTO without status (for my-requests endpoint)
    private LoanRequestWithoutStatusDTO convertToDTOWithoutStatus(LoanRequest loanRequest) {
        LoanRequestWithoutStatusDTO dto = new LoanRequestWithoutStatusDTO();
        dto.setId(loanRequest.getId());
        dto.setAmount(loanRequest.getAmount());
        dto.setMaxInterestRate(loanRequest.getMaxInterestRate());
        dto.setRepaymentDate(loanRequest.getRepaymentDate());
        dto.setDescription(loanRequest.getDescription());
        dto.setBorrowerName(loanRequest.getBorrower().getName());
        dto.setBorrowerEmail(loanRequest.getBorrower().getEmail());
        dto.setCreatedAt(loanRequest.getCreatedAt().format(formatter));
        return dto;
    }

    // Convert entity to summary DTO (for summary endpoint)
    private LoanRequestSummaryDTO convertToSummaryDTO(LoanRequest loanRequest) {
        LoanRequestSummaryDTO dto = new LoanRequestSummaryDTO();
        dto.setId(loanRequest.getId());
        dto.setAmount(loanRequest.getAmount());
        dto.setMaxInterestRate(loanRequest.getMaxInterestRate());
        dto.setRepaymentDate(loanRequest.getRepaymentDate());
        dto.setBorrowerName(loanRequest.getBorrower().getName());
        dto.setTrustScore(5); // Default trust score for all users
        return dto;
    }
}