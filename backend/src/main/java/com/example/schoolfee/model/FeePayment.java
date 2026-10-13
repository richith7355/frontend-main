package com.example.schoolfee.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fee_payments")
public class FeePayment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false) @JoinColumn(name = "student_id")
    private Student student;
    @ManyToOne(optional = false) @JoinColumn(name = "fee_structure_id")
    private FeeStructure feeStructure;
    @NotNull @DecimalMin("0.01")
    @Column(precision = 10, scale = 2)
    private BigDecimal amountPaid;
    private String paymentMethod;
    @Column(unique = true)
    private String receiptNumber;
    private LocalDateTime paidAt;

    @PrePersist
    void beforeInsert() {
        if (paidAt == null) paidAt = LocalDateTime.now();
        if (receiptNumber == null || receiptNumber.isBlank())
            receiptNumber = "DEMO-" + System.currentTimeMillis();
    }
    public Long getId() { return id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public FeeStructure getFeeStructure() { return feeStructure; }
    public void setFeeStructure(FeeStructure feeStructure) { this.feeStructure = feeStructure; }
    public BigDecimal getAmountPaid() { return amountPaid; }
    public void setAmountPaid(BigDecimal amountPaid) { this.amountPaid = amountPaid; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getReceiptNumber() { return receiptNumber; }
    public LocalDateTime getPaidAt() { return paidAt; }
}
