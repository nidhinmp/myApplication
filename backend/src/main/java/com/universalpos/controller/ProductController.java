package com.universalpos.controller;

import com.universalpos.dto.request.ProductRequest;
import com.universalpos.dto.response.ProductResponse;
import com.universalpos.security.CustomUserDetails;
import com.universalpos.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long storeId = userDetails.getStoreId();
        if (storeId == null) {
            return ResponseEntity.ok(productService.getAllProducts(null));
        }
        return ResponseEntity.ok(productService.getAllProducts(storeId));
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(
            @PathVariable Long categoryId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long storeId = userDetails.getStoreId();
        return ResponseEntity.ok(productService.getProductsByCategory(storeId, categoryId));
    }
    
    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductResponse>> getLowStockProducts(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long storeId = userDetails.getStoreId();
        return ResponseEntity.ok(productService.getLowStockProducts(storeId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
    
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (request.getStoreId() == null) {
            request.setStoreId(userDetails.getStoreId());
        }
        return ResponseEntity.ok(productService.createProduct(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}