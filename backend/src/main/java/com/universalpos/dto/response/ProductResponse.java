package com.universalpos.dto.response;

import com.universalpos.model.*;
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
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String sku;
    private String barcode;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    private Long storeId;
    private boolean active;
    private int stockQuantity;
    private int reorderLevel;
    private boolean trackInventory;
    private List<VariantResponse> variants;
    private List<ModifierResponse> modifiers;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VariantResponse {
        private Long id;
        private String name;
        private String sku;
        private String attributes;
        private BigDecimal price;
        private int stockQuantity;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModifierResponse {
        private Long id;
        private String name;
        private BigDecimal price;
        private boolean isDefault;
    }
}