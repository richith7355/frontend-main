package com.example.schoolfee.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "fee_structures")
public class FeeStructure {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Column(unique = true)
    private String feeName;
    @NotNull @DecimalMin("0.01")
    @Column(precision = 10, scale = 2)
    private BigDecimal amount;
    private String academicYear;
    private boolean active = true;

    public FeeStructure() {}
    public Long getId() { return id; }
    public String getFeeName() { return feeName; }
    public void setFeeName(String feeName) { this.feeName = feeName; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
