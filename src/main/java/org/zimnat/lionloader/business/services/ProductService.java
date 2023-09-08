package org.zimnat.lionloader.business.services;
import org.zimnat.lionloader.business.domain.Category;
import org.zimnat.lionloader.business.domain.Industry;
import org.zimnat.lionloader.business.domain.Product;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.ProductDTO;

import java.util.List;

public interface ProductService {

    public Product get(String id);
    public Product save(Product product, User user);
    public Product update(String id, ProductDTO product, User user);
    public  List<Product> getAll();

    public  List<Product> getAllForOwner(User owner);
    public Product findByName(String name);
    public List<Product> getProductsByCategory(Category category);
    public List<Product> getProductsByIndustry(Industry industry);
}
