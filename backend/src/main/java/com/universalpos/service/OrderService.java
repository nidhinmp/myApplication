package com.universalpos.service;

import com.universalpos.dto.request.OrderRequest;
import com.universalpos.dto.response.OrderResponse;
import com.universalpos.model.*;
import com.universalpos.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final TableRepository tableRepository;
    
    public List<OrderResponse> getOrdersByStore(Long storeId) {
        return orderRepository.findByStoreId(storeId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<OrderResponse> getOrdersByStatus(Long storeId, Order.OrderStatus status) {
        return orderRepository.findByStoreIdAndStatus(storeId, status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToResponse(order);
    }
    
    @Transactional
    public OrderResponse createOrder(OrderRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Store store = user.getStore();
        if (store == null) {
            throw new RuntimeException("User does not have a store assigned");
        }
        
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .store(store)
                .user(user)
                .status(Order.OrderStatus.PENDING)
                .orderDate(LocalDateTime.now())
                .notes(request.getNotes())
                .build();
        
        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            order.setCustomer(customer);
        }
        
        if (request.getTableId() != null) {
            Table table = tableRepository.findById(request.getTableId())
                    .orElseThrow(() -> new RuntimeException("Table not found"));
            order.setTable(table);
            table.setStatus(Table.TableStatus.OCCUPIED);
            tableRepository.save(table);
        }
        
        // Process order items
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> items = request.getItems().stream()
                .map(itemRequest -> {
                    Product product = productRepository.findById(itemRequest.getProductId())
                            .orElseThrow(() -> new RuntimeException("Product not found: " + itemRequest.getProductId()));
                    
                    BigDecimal unitPrice = product.getPrice();
                    if (itemRequest.getVariantId() != null && product.getVariants() != null) {
                        unitPrice = product.getVariants().stream()
                                .filter(v -> v.getId().equals(itemRequest.getVariantId()))
                                .findFirst()
                                .map(ProductVariant::getPrice)
                                .orElse(product.getPrice());
                    }
                    
                    BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
                    subtotal = subtotal.add(itemTotal);
                    
                    // Update inventory
                    if (product.isTrackInventory()) {
                        product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
                        productRepository.save(product);
                    }
                    
                    return OrderItem.builder()
                            .order(order)
                            .product(product)
                            .variant(itemRequest.getVariantId() != null ? 
                                    product.getVariants().stream()
                                            .filter(v -> v.getId().equals(itemRequest.getVariantId()))
                                            .findFirst()
                                            .orElse(null) : null)
                            .quantity(itemRequest.getQuantity())
                            .unitPrice(unitPrice)
                            .totalPrice(itemTotal)
                            .notes(itemRequest.getNotes())
                            .build();
                })
                .collect(Collectors.toList());
        
        order.setItems(items);
        
        // Calculate discounts
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getDiscount() != null) {
            if (request.getDiscount().getPercentage() != null) {
                discountAmount = subtotal.multiply(request.getDiscount().getPercentage())
                        .divide(BigDecimal.valueOf(100));
            } else if (request.getDiscount().getAmount() != null) {
                discountAmount = request.getDiscount().getAmount();
            }
        }
        
        // Calculate tax (configurable - using 10% as default)
        BigDecimal taxRate = new BigDecimal("0.10");
        BigDecimal taxAmount = subtotal.subtract(discountAmount).multiply(taxRate);
        
        BigDecimal total = subtotal.subtract(discountAmount).add(taxAmount);
        
        order.setSubtotal(subtotal);
        order.setDiscountAmount(discountAmount);
        order.setTaxAmount(taxAmount);
        order.setTotal(total);
        
        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }
    
    @Transactional
    public OrderResponse updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(status);
        if (status == Order.OrderStatus.COMPLETED) {
            order.setCompletedAt(LocalDateTime.now());
            
            // Free the table if this was a restaurant order
            if (order.getTable() != null) {
                Table table = order.getTable();
                table.setStatus(Table.TableStatus.AVAILABLE);
                tableRepository.save(table);
            }
        }
        
        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }
    
    @Transactional
    public OrderResponse addPayment(Long orderId, OrderRequest.PaymentRequest paymentRequest) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        Payment payment = Payment.builder()
                .order(order)
                .method(Payment.PaymentMethod.valueOf(paymentRequest.getMethod()))
                .amount(paymentRequest.getAmount())
                .paymentTime(LocalDateTime.now())
                .build();
        
        order.getPayments().add(payment);
        
        // If fully paid, mark as completed
        BigDecimal totalPaid = order.getPayments().stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (totalPaid.compareTo(order.getTotal()) >= 0) {
            order.setStatus(Order.OrderStatus.COMPLETED);
            order.setCompletedAt(LocalDateTime.now());
            
            if (order.getTable() != null) {
                Table table = order.getTable();
                table.setStatus(Table.TableStatus.AVAILABLE);
                tableRepository.save(table);
            }
        }
        
        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }
    
    public List<OrderResponse> getOrdersByDateRange(Long storeId, LocalDateTime start, LocalDateTime end) {
        return orderRepository.findByStoreIdAndDateRange(storeId, start, end)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public Double getTodaySales(Long storeId) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        Double sales = orderRepository.findTotalSalesSince(storeId, startOfDay);
        return sales != null ? sales : 0.0;
    }
    
    private String generateOrderNumber() {
        return "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }
    
    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .storeId(order.getStore() != null ? order.getStore().getId() : null)
                .storeName(order.getStore() != null ? order.getStore().getName() : null)
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .userName(order.getUser() != null ? order.getUser().getFullName() : null)
                .customerId(order.getCustomer() != null ? order.getCustomer().getId() : null)
                .customerName(order.getCustomer() != null ? order.getCustomer().getName() : null)
                .status(order.getStatus())
                .subtotal(order.getSubtotal())
                .taxAmount(order.getTaxAmount())
                .discountAmount(order.getDiscountAmount())
                .total(order.getTotal())
                .notes(order.getNotes())
                .orderDate(order.getOrderDate())
                .completedAt(order.getCompletedAt())
                .build();
        
        if (order.getTable() != null) {
            response.setTableId(order.getTable().getId());
            response.setTableName(order.getTable().getName());
        }
        
        if (order.getItems() != null) {
            response.setItems(order.getItems().stream()
                    .map(item -> OrderResponse.OrderItemResponse.builder()
                            .id(item.getId())
                            .productId(item.getProduct().getId())
                            .productName(item.getProduct().getName())
                            .variantId(item.getVariant() != null ? item.getVariant().getId() : null)
                            .variantName(item.getVariant() != null ? item.getVariant().getName() : null)
                            .quantity(item.getQuantity())
                            .unitPrice(item.getUnitPrice())
                            .totalPrice(item.getTotalPrice())
                            .modifiers(item.getModifiers())
                            .notes(item.getNotes())
                            .build())
                    .collect(Collectors.toList()));
        }
        
        if (order.getPayments() != null) {
            response.setPayments(order.getPayments().stream()
                    .map(p -> OrderResponse.PaymentResponse.builder()
                            .id(p.getId())
                            .method(p.getMethod().name())
                            .amount(p.getAmount())
                            .transactionId(p.getTransactionId())
                            .paymentTime(p.getPaymentTime())
                            .build())
                    .collect(Collectors.toList()));
        }
        
        return response;
    }
}