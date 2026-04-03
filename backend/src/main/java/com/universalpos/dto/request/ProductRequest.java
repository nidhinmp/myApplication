package com.universalpos.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    private String sku;
    
    private String barcode;
    
    private String imageUrl;
    
    private Long categoryId;
    
    private Long storeId;
    
    private boolean active = true;
    
    private int stockQuantity;
    
    private int reorderLevel;
    
    private boolean trackInventory;
    
    private List<VariantRequest> variants;
    
    private List<ModifierRequest> modifiers;
    
    @Data
    public static class VariantRequest {
        private String name;
        private String sku;
        private String attributes;
        private BigDecimal price;
        private int stockQuantity;
    }
    
    @Data
    public static class ModifierRequest {
        private String name;
        private BigDecimal price;
        private boolean isDefault;
    }
}