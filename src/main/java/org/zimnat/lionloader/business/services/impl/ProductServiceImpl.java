package org.zimnat.lionloader.business.services.impl;

import org.apache.commons.codec.binary.Base64;
import org.hibernate.engine.jdbc.BlobProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zimnat.lionloader.business.domain.Category;
import org.zimnat.lionloader.business.domain.Industry;
import org.zimnat.lionloader.business.domain.Product;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.ProductDTO;
import org.zimnat.lionloader.business.repos.ProductRepo;
import org.zimnat.lionloader.business.services.CategoryService;
import org.zimnat.lionloader.business.services.ProductService;
import org.zimnat.lionloader.business.services.UserService;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.services.impl
 */


@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    CategoryService categoryService;

    @Autowired
    UserService userService;

    @Override
    public Product get(String id) {
        return productRepo.getById(id);
    }

    @Transactional
    @Override
    public Product save(Product product, User user) {
        if(product!=null){
            product.setId(UUID.randomUUID().toString());
            product.setCreatedBy(user);
            product.setDateCreated(new Date());

            return productRepo.save(product);
        }
        return null;
    }

    @Transactional
    @Override
    public Product update(String id, ProductDTO productDTO, User user) {
        if(id!=null && !id.isEmpty()){
            Product target=productRepo.getById(id);
            if(target!=null){
                target.setPrice(productDTO.getPrice());
                target.setDescription(productDTO.getDescription());
                target.setName(productDTO.getName());
                if(productDTO.getPicture()!=null && productDTO.getPicture().length()>0) {
                    target.setPicture(productDTO.getPicture());
                }
                target.setTags(productDTO.getTags());
                target.setPromotionStartDate(productDTO.getPromotionStart());
                target.setPromotionEndDate(productDTO.getPromotionEnd());
                target.setDiscount(productDTO.getDiscount()!=null && !productDTO.getDiscount().isEmpty()?Double.parseDouble(productDTO.getDiscount()):0.0);
                target.setCategory(categoryService.get(productDTO.getCategory()));
                target.setCoupon(productDTO.getCoupon());
                if(productDTO.getOwner()!=null && !productDTO.getOwner().isEmpty()) {
                    target.setOwner(userService.get(productDTO.getOwner()));
                }
                target.setModifiedBy(user);
                target.setDateModified(new Date());
                target.setActive(productDTO.getActive());
            }
        }
        return null;
    }

    @Override
    public List<Product> getAll() {
        List<Product> products=productRepo.findAll();
        return products;
    }

    @Override
    public List<Product> getAllForOwner(User owner) {
        List<Product> products=productRepo.getProductsByOwnerAndActive(owner, Boolean.TRUE);
        return products;

    }


    @Override
    public Product findByName(String name) {
        return null;
    }

    @Override
    public List<Product> getProductsByCategory(Category category) {
        return null;
    }

    @Override
    public List<Product> getProductsByIndustry(Industry industry) {
        return null;
    }
}
