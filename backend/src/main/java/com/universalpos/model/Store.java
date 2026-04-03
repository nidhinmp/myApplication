package com.universalpos.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String address;
    
    private String phone;
    
    private String email;
    
    @Column(columnDefinition = "TEXT")
    private String settings; // JSON for customizable settings
    
    @Column(columnDefinition = "TEXT")
    private String themeConfig; // JSON for theme customization
    
    @Enumerated(EnumType.STRING)
    private BusinessType businessType;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum BusinessType {
        RESTAURANT,
        RETAIL,
        MALL,
        CUSTOM
    }
}