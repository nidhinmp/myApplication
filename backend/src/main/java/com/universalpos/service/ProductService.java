package com.universalpos.service;

import com.universalpos.dto.request.ProductRequest;
import com.universalpos.dto.response.ProductResponse;
import com.universalpos.model.*;
import com.universalpos.repository.CategoryRepository;
import com.universalpos.repository.ProductRepository;
import com.universalpos.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;
    
    public List<ProductResponse> getAllProducts(Long storeId) {
        return productRepository.findByStoreIdAndActive(storeId, true)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ProductResponse> getProductsByCategory(Long storeId, Long categoryId) {
        return productRepository.findByStoreIdAndCategoryId(storeId, categoryId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToResponse(product);
    }
    
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .sku(request.getSku())
                .barcode(request.getBarcode())
                .imageUrl(request.getImageUrl())
                .active(request.isActive())
                .stockQuantity(request.getStockQuantity())
                .reorderLevel(request.getReorderLevel())
                .trackInventory(request.isTrackInventory())
                .build();
        
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }
        
        if (request.getStoreId() != null) {
            Store store = storeRepository.findById(request.getStoreId())
                    .orElseThrow(() -> new RuntimeException("Store not found"));
            product.setStore(store);
        }
        
        if (request.getVariants() != null) {
            List<ProductVariant> variants = request.getVariants().stream()
                    .map(v -> ProductVariant.builder()
                            .name(v.getName())
                            .sku(v.getSku())
                            .attributes(v.getAttributes())
                            .price(v.getPrice())
                            .stockQuantity(v.getStockQuantity())
                            .product(product)
                            .build())
                    .collect(Collectors.toList());
            product.setVariants(variants);
        }
        
        if (request.getModifiers() != null) {
            List<Modifier> modifiers = request.getModifiers().stream()
                    .map(m -> Modifier.builder()
                            .name(m.getName())
                            .price(m.getPrice())
                            .isDefault(m.isDefault())
                            .product(product)
                            .build())
                    .collect(Collectors.toList());
            product.setModifiers(modifiers);
        }
        
        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }
    
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setSku(request.getSku());
        product.setBarcode(request.getBarcode());
        product.setImageUrl(request.getImageUrl());
        product.setActive(request.isActive());
        product.setStockQuantity(request.getStockQuantity());
        product.setReorderLevel(request.getReorderLevel());
        product.setTrackInventory(request.isTrackInventory());
        
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }
        
        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }
    
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setActive(false);
        productRepository.save(product);
    }
    
    public List<ProductResponse> getLowStockProducts(Long storeId) {
        return productRepository.findLowStockProducts(storeId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .sku(product.getSku())
                .barcode(product.getBarcode())
                .imageUrl(product.getImageUrl())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .storeId(product.getStore() != null ? product.getStore().getId() : null)
                .active(product.isActive())
                .stockQuantity(product.getStockQuantity())
                .reorderLevel(product.getReorderLevel())
                .trackInventory(product.isTrackInventory())
                .build();
        
        if (product.getVariants() != null) {
            response.setVariants(product.getVariants().stream()
                    .map(v -> ProductResponse.VariantResponse.builder()
                            .id(v.getId())
                            .name(v.getName())
                            .sku(v.getSku())
                            .attributes(v.getAttributes())
                            .price(v.getPrice())
                            .stockQuantity(v.getStockQuantity())
                            .build())
                    .collect(Collectors.toList()));
        }
        
        if (product.getModifiers() != null) {
            response.setModifiers(product.getModifiers().stream()
                    .map(m -> ProductResponse.ModifierResponse.builder()
                            .id(m.getId())
                            .name(m.getName())
                            .price(m.getPrice())
                            .isDefault(m.isDefault())
                            .build())
                    .collect(Collectors.toList()));
        }
        
        return response;
    }
}