package com.universalpos.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {
    @NotNull(message = "Store ID is required")
    private Long storeId;
    
    private Long customerId;
    
    private Long tableId;
    
    private String notes;
    
    private List<OrderItemRequest> items;
    
    private DiscountRequest discount;
    
    private List<PaymentRequest> payments;
    
    @Data
    public static class OrderItemRequest {
        @NotNull(message = "Product ID is required")
        private Long productId;
        
        private Long variantId;
        
        @NotNull(message = "Quantity is required")
        private int quantity;
        
        private String notes;
        
        private List<Long> modifierIds;
    }
    
    @Data
    public static class DiscountRequest {
        private BigDecimal amount;
        private BigDecimal percentage;
        private String reason;
    }
    
    @Data
    public static class PaymentRequest {
        private String method;
        private BigDecimal amount;
    }
}