package com.universalpos.repository;

import com.universalpos.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStoreIdAndActive(Long storeId, boolean active);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByStoreIdAndCategoryId(Long storeId, Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.store.id = :storeId AND p.active = true AND p.stockQuantity <= p.reorderLevel")
    List<Product> findLowStockProducts(Long storeId);
    
    boolean existsBySku(String sku);
    boolean existsByBarcode(String barcode);
}