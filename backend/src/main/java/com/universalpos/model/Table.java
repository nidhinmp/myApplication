package com.universalpos.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tables")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Table {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private int capacity;
    
    @Enumerated(EnumType.STRING)
    private TableStatus status;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;
    
    public enum TableStatus {
        AVAILABLE,
        OCCUPIED,
        RESERVED
    }
}