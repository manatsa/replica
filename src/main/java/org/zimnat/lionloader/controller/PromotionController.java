package org.zimnat.lionloader.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zimnat.lionloader.aop.annotation.Auditor;
import org.zimnat.lionloader.business.domain.Promotion;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.PromotionDTO;
import org.zimnat.lionloader.business.domain.enums.UserLevel;
import org.zimnat.lionloader.business.services.PromotionService;
import org.zimnat.lionloader.business.services.UserService;

/**
 * @author :: codemaster
 * created on :: 2/4/2023
 */

@RestController
@RequestMapping("/api/promotion")
public class PromotionController {

    @Autowired
    PromotionService promotionService;

    @Autowired
    UserService userService;

    @Auditor
    @GetMapping("/")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(promotionService.getAll());
    }


    @Auditor
    @PostMapping("/")
    public ResponseEntity<?> createPromotion(@RequestBody PromotionDTO promotionDTO){
        Promotion promotion= new Promotion();
        User user=userService.getCurrentUser();
        try{
            promotion.setName(promotionDTO.getName());
            promotion.setDescription(promotionDTO.getDescription());
            promotion.setPromotionStart(promotionDTO.getPromotionStart());
            promotion.setPromotionEnd(promotionDTO.getPromotionEnd());
            promotion.setDiscount(promotionDTO.getDiscount());
            promotion.setDiscountType(promotionDTO.getDiscountType());
            promotion =promotionService.save(promotion, user);
            return  ResponseEntity.ok(promotionService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @Auditor
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePromotion(@RequestBody PromotionDTO promotionDTO, @PathVariable("id") String id){


        try{
            User currentUser=userService.getCurrentUser();
            Promotion promotion=promotionService.update(id, promotionDTO,currentUser);
            return  ResponseEntity.ok(promotionService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
