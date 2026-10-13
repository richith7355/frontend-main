package com.example.schoolfee.controller;

import com.example.schoolfee.model.FeePayment;
import com.example.schoolfee.model.FeeStructure;
import com.example.schoolfee.repository.FeePaymentRepository;
import com.example.schoolfee.repository.FeeStructureRepository;
import com.example.schoolfee.repository.StudentRepository;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final StudentRepository students;
    private final FeeStructureRepository fees;
    private final FeePaymentRepository payments;
    public DashboardController(StudentRepository students, FeeStructureRepository fees, FeePaymentRepository payments) {
        this.students = students; this.fees = fees; this.payments = payments;
    }
    @GetMapping public Map<String, Object> summary() {
        BigDecimal totalExpected = fees.findAll().stream().filter(FeeStructure::isActive)
            .map(FeeStructure::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add)
            .multiply(BigDecimal.valueOf(students.count()));
        BigDecimal collected = payments.findAll().stream().map(FeePayment::getAmountPaid)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal outstanding = totalExpected.subtract(collected).max(BigDecimal.ZERO);
        return Map.of("studentCount", students.count(), "feeStructureCount", fees.count(),
            "totalExpected", totalExpected, "totalCollected", collected, "outstanding", outstanding,
            "paymentCount", payments.count());
    }
}
