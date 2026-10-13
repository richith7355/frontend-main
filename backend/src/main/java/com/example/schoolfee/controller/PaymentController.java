package com.example.schoolfee.controller;

import com.example.schoolfee.dto.PaymentRequest;
import com.example.schoolfee.model.FeePayment;
import com.example.schoolfee.model.FeeStructure;
import com.example.schoolfee.model.Student;
import com.example.schoolfee.repository.FeePaymentRepository;
import com.example.schoolfee.repository.FeeStructureRepository;
import com.example.schoolfee.repository.StudentRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final FeePaymentRepository payments;
    private final StudentRepository students;
    private final FeeStructureRepository fees;
    public PaymentController(FeePaymentRepository payments, StudentRepository students, FeeStructureRepository fees) {
        this.payments = payments; this.students = students; this.fees = fees;
    }
    @GetMapping public List<FeePayment> all() { return payments.findAll(); }
    @GetMapping("/student/{studentId}") public List<FeePayment> byStudent(@PathVariable Long studentId) {
        return payments.findByStudentIdOrderByPaidAtDesc(studentId);
    }
    @PostMapping public FeePayment create(@Valid @RequestBody PaymentRequest request) {
        Student student = students.findById(request.getStudentId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        FeeStructure fee = fees.findById(request.getFeeStructureId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fee structure not found"));
        if (!fee.isActive()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This fee structure is inactive");
        FeePayment p = new FeePayment();
        p.setStudent(student); p.setFeeStructure(fee); p.setAmountPaid(request.getAmountPaid());
        p.setPaymentMethod(request.getPaymentMethod() == null ? "DEMO" : request.getPaymentMethod());
        return payments.save(p);
    }
}
