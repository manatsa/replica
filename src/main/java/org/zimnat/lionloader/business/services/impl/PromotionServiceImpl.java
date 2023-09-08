package org.zimnat.lionloader.business.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zimnat.lionloader.business.domain.Promotion;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.PromotionDTO;
import org.zimnat.lionloader.business.domain.enums.UserLevel;
import org.zimnat.lionloader.business.repos.PromotionRepo;
import org.zimnat.lionloader.business.repos.PromotionRepo;
import org.zimnat.lionloader.business.services.PromotionService;
import org.zimnat.lionloader.business.services.PromotionService;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @author :: codemaster
 * created on :: 9/6/2023
 * Package Name :: org.zimnat.lionloader.business.services.impl
 */

@Service
public class PromotionServiceImpl implements PromotionService {

    @Autowired
    PromotionRepo promotionRepo;

    @Override
    public List<Promotion> getAll() {
        return promotionRepo.findAll();
    }

    @Override
    public Promotion save(Promotion promotion, User user) {
        if(promotion!=null){
            promotion.setDateCreated(new Date());
            promotion.setId(UUID.randomUUID().toString());
            promotion.setCreatedBy(user);
            return promotionRepo.save(promotion);
        }
        return null;
    }

    @Transactional
    @Override
    public Promotion update(String id, PromotionDTO promotionsDTO, User user) {
        if(id!=null && !id.isEmpty()){
            Promotion target=promotionRepo.getById(id);
            target.setDescription(promotionsDTO.getDescription());
            target.setName(promotionsDTO.getName());
            target.setDiscount(promotionsDTO.getDiscount());
            target.setPromotionEnd(promotionsDTO.getPromotionEnd());
            target.setPromotionStart(promotionsDTO.getPromotionStart());
            target.setDiscountType(promotionsDTO.getDiscountType());
            target.setDateModified(new Date());
            target.setModifiedBy(user);

            return promotionRepo.save(target);
        }
        return null;
    }

    @Override
    public Promotion findById(String id) {
        if(id!=null && !id.isEmpty()){
            return promotionRepo.findById(id).get();
        }
        return null;
    }

    @Override
    public Promotion findByName(String name) {
        if(name!=null && !name.isEmpty()){
            return promotionRepo.findByName(name);
        }
        return null;
    }

    @Override
    public List<Promotion> findByDescription(String description) {
        if(description!=null && !description.isEmpty()){
            return promotionRepo.findByDescriptionContainingIgnoreCase(description);
        }
        return null;
    }
}
