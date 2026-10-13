package com.example.schoolfee.controller;

import com.example.schoolfee.model.Student;
import com.example.schoolfee.repository.StudentRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentRepository repo;
    public StudentController(StudentRepository repo) { this.repo = repo; }

    @GetMapping public List<Student> all() { return repo.findAll(); }
    @GetMapping("/{id}") public Student one(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
    }
    @PostMapping public Student create(@Valid @RequestBody Student student) {
        if (repo.existsByAdmissionNumber(student.getAdmissionNumber()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Admission number already exists");
        student.setAdmissionNumber(student.getAdmissionNumber().trim());
        return repo.save(student);
    }
    @PutMapping("/{id}") public Student update(@PathVariable Long id, @Valid @RequestBody Student input) {
        Student s = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        s.setFullName(input.getFullName()); s.setClassName(input.getClassName());
        s.setEmail(input.getEmail()); s.setPhone(input.getPhone());
        return repo.save(s);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) {
        if (!repo.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
        repo.deleteById(id);
    }
}
