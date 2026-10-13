package com.example.schoolfee.repository;
import com.example.schoolfee.model.FeePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {
    List<FeePayment> findByStudentIdOrderByPaidAtDesc(Long studentId);
}
