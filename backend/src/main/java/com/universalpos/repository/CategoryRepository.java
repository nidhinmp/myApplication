package com.universalpos.repository;

import com.universalpos.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByStoreIdAndActive(Long storeId, boolean active);
    List<Category> findByParentId(Long parentId);
    List<Category> findByStoreIdAndParentIdIsNull(Long storeId);
}