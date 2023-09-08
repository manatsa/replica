package org.zimnat.lionloader.controller;

import org.hibernate.engine.jdbc.BlobProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zimnat.lionloader.aop.annotation.Auditor;
import org.zimnat.lionloader.business.domain.Category;
import org.zimnat.lionloader.business.domain.Product;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.ProductDTO;
import org.zimnat.lionloader.business.services.CategoryService;
import org.zimnat.lionloader.business.services.ProductService;
import org.zimnat.lionloader.business.services.UserService;

import javax.sql.rowset.serial.SerialBlob;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author :: codemaster
 * created on :: 2/4/2023
 */

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    ProductService productService;

    @Autowired
    UserService userService;

    @Autowired
    CategoryService categoryService;

    @Auditor
    @GetMapping("/")
    public ResponseEntity<?> getAll(){
        User user=userService.getCurrentUser();

        List<Product> products=(user==null || (user!=null && !user.getRoles().stream().map(role -> role.getName()).filter(r->r.equals("ADMIN")).collect(Collectors.toList()).isEmpty()))? productService.getAll() : productService.getAllForOwner(user);
        return ResponseEntity.ok(products);
    }


    @Auditor
    @PostMapping("/")
    public ResponseEntity<?> createProduct(@RequestBody ProductDTO productDTO) {

        System.err.println(productDTO);
        Product product= new Product();
        User user=userService.getCurrentUser();
        try{
            User owner=userService.get(productDTO.getOwner());
            Category category=categoryService.get(productDTO.getCategory());
            product.setOwner(owner);
            product.setName(productDTO.getName());
            product.setDescription(productDTO.getDescription());
            product.setCategory(category);
            product.setPrice(productDTO.getPrice());
            product.setCoupon(productDTO.getCoupon());
            product.setDiscount(productDTO.getDiscount()!=null && !productDTO.getDiscount().isEmpty()? Double.parseDouble(productDTO.getDiscount()):0.0);
            product.setPromotionEndDate(productDTO.getPromotionEnd());
            product.setPromotionStartDate(productDTO.getPromotionStart());
            product.setTags(productDTO.getTags());
            product.setPicture(productDTO.getPicture());
            product =productService.save(product, user);
            List<Product> products=user.getRoles().stream().map(role -> role.getName()).filter(r->r.equals("ADMIN")).collect(Collectors.toList()).isEmpty()?productService.getAllForOwner(user):productService.getAll();
            return  ResponseEntity.ok(products);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @Auditor
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@RequestBody ProductDTO productDTO, @PathVariable("id") String id){

        try{
            User currentUser=userService.getCurrentUser();
            Product product=productService.update(id, productDTO,currentUser);
            return  ResponseEntity.ok(productService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
