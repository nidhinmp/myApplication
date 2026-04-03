package com.universalpos.controller;

import com.universalpos.model.Category;
import com.universalpos.repository.CategoryRepository;
import com.universalpos.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryRepository categoryRepository;
    
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long storeId = userDetails.getStoreId();
        if (storeId == null) {
            return ResponseEntity.ok(categoryRepository.findAll());
        }
        return ResponseEntity.ok(categoryRepository.findByStoreIdAndActive(storeId, true));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryRepository.findById(id).orElseThrow());
    }
    
    @PostMapping
    public ResponseEntity<Category> createCategory(
            @RequestBody Category category,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        // Set store from authenticated user
        return ResponseEntity.ok(categoryRepository.save(category));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @RequestBody Category category) {
        category.setId(id);
        return ResponseEntity.ok(categoryRepository.save(category));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id).orElseThrow();
        category.setActive(false);
        categoryRepository.save(category);
        return ResponseEntity.noContent().build();
    }
}