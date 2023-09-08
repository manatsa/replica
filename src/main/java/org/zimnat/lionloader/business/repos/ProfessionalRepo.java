package org.zimnat.lionloader.business.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zimnat.lionloader.business.domain.Category;
import org.zimnat.lionloader.business.domain.Product;
import org.zimnat.lionloader.business.domain.Professional;
import org.zimnat.lionloader.business.domain.User;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.repos
 */

public interface ProfessionalRepo extends JpaRepository<Professional, String> {
    List<Professional> findAllByActive(Boolean active);
    public List<Professional> findByFirstName(String firstName);
    public List<Professional> findByLastName(String lastName);
    List<Professional> getProfessionalsByCategory(Category category);

    List<Professional> getProfessionalsByCategoryAndActive(Category category, Boolean active);

    List<Professional> getProfessionalByTitleAndActive(String title, boolean active);

    /*@Query("select p from Product p left join fetch p.category_id c left join fetch c.industry_id i where i = :industry")
    List<Product> getProductsInIndustry(@Param("industry") Industry industry);*/
}
