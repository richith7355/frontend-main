package com.example.schoolfee.repository;
import com.example.schoolfee.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
public interface StudentRepository extends JpaRepository<Student, Long> {
    boolean existsByAdmissionNumber(String admissionNumber);
}
