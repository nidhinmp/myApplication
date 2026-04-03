package com.universalpos.controller;

import com.universalpos.dto.request.OrderRequest;
import com.universalpos.dto.response.OrderResponse;
import com.universalpos.model.Order;
import com.universalpos.security.CustomUserDetails;
import com.universalpos.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long storeId = userDetails.getStoreId();
        return ResponseEntity.ok(orderService.getOrdersByStore(storeId));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(
            @PathVariable Order.OrderStatus status,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long storeId = userDetails.getStoreId();
        return ResponseEntity.ok(orderService.getOrdersByStatus(storeId, status));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
    
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(orderService.createOrder(request, userDetails.getId()));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
    
    @PostMapping("/{id}/payments")
    public ResponseEntity<OrderResponse> addPayment(
            @PathVariable Long id,
            @RequestBody OrderRequest.PaymentRequest paymentRequest) {
        return ResponseEntity.ok(orderService.addPayment(id, paymentRequest));
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<OrderResponse>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long storeId = userDetails.getStoreId();
        return ResponseEntity.ok(orderService.getOrdersByDateRange(storeId, start, end));
    }
    
    @GetMapping("/today-sales")
    public ResponseEntity<Double> getTodaySales(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long storeId = userDetails.getStoreId();
        return ResponseEntity.ok(orderService.getTodaySales(storeId));
    }
}