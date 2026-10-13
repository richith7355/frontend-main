package com.example.schoolfee.controller;

import com.example.schoolfee.model.FeeStructure;
import com.example.schoolfee.repository.FeeStructureRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/fee-structures")
public class FeeStructureController {
    private final FeeStructureRepository repo;
    public FeeStructureController(FeeStructureRepository repo) { this.repo = repo; }
    @GetMapping public List<FeeStructure> all() { return repo.findAll(); }
    @PostMapping public FeeStructure create(@Valid @RequestBody FeeStructure fee) {
        if (repo.findAll().stream().anyMatch(f -> f.getFeeName().equalsIgnoreCase(fee.getFeeName())))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Fee name already exists");
        return repo.save(fee);
    }
}
