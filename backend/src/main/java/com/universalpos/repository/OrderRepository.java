package com.universalpos.repository;

import com.universalpos.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStoreId(Long storeId);
    List<Order> findByStoreIdAndStatus(Long storeId, Order.OrderStatus status);
    List<Order> findByCustomerId(Long customerId);
    List<Order> findByUserId(Long userId);
    
    @Query("SELECT o FROM Order o WHERE o.store.id = :storeId AND o.orderDate BETWEEN :startDate AND :endDate")
    List<Order> findByStoreIdAndDateRange(@Param("storeId") Long storeId, 
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(o.total) FROM Order o WHERE o.store.id = :storeId AND o.orderDate >= :date")
    Double findTotalSalesSince(Long storeId, LocalDateTime date);
}