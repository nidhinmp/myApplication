package com.universalpos.dto.response;

import com.universalpos.model.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Long storeId;
    private String storeName;
    private Long userId;
    private String userName;
    private Long customerId;
    private String customerName;
    private Order.OrderStatus status;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private BigDecimal total;
    private String notes;
    private Long tableId;
    private String tableName;
    private LocalDateTime orderDate;
    private LocalDateTime completedAt;
    private List<OrderItemResponse> items;
    private List<PaymentResponse> payments;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private Long variantId;
        private String variantName;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
        private String modifiers;
        private String notes;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentResponse {
        private Long id;
        private String method;
        private BigDecimal amount;
        private String transactionId;
        private LocalDateTime paymentTime;
    }
}