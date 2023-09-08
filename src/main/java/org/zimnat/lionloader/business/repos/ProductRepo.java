package org.zimnat.lionloader.business.repos;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.zimnat.lionloader.business.domain.Category;
import org.zimnat.lionloader.business.domain.Industry;
import org.zimnat.lionloader.business.domain.Product;
import org.zimnat.lionloader.business.domain.User;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.repos
 */

public interface ProductRepo extends JpaRepository<Product, String> {
    public Product findByName(String name);
    List<Product> getProductsByCategory(Category category);

    List<Product> getProductsByOwnerAndActive(User owner, boolean active);

    /*@Query("select p from Product p left join fetch p.category_id c left join fetch c.industry_id i where i = :industry")
    List<Product> getProductsInIndustry(@Param("industry") Industry industry);*/
}
