package com.universalpos.repository;

import com.universalpos.model.Table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<Table, Long> {
    List<Table> findByStoreId(Long storeId);
    List<Table> findByStoreIdAndStatus(Long storeId, Table.TableStatus status);
}