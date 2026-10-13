package com.example.schoolfee.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "students")
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Size(max = 100)
    private String fullName;
    @NotBlank @Size(max = 30)
    @Column(unique = true)
    private String admissionNumber;
    @NotBlank @Size(max = 80)
    private String className;
    @Email @Size(max = 120)
    @Column(unique = true)
    private String email;
    @Size(max = 20)
    private String phone;

    public Student() {}
    public Student(String fullName, String admissionNumber, String className, String email, String phone) {
        this.fullName = fullName; this.admissionNumber = admissionNumber; this.className = className;
        this.email = email; this.phone = phone;
    }
    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getAdmissionNumber() { return admissionNumber; }
    public void setAdmissionNumber(String admissionNumber) { this.admissionNumber = admissionNumber; }
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
