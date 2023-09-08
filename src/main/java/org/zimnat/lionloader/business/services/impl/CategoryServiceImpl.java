package org.zimnat.lionloader.business.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zimnat.lionloader.business.domain.Category;
import org.zimnat.lionloader.business.domain.Industry;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.CategoryDTO;
import org.zimnat.lionloader.business.domain.dto.IndustryDTO;
import org.zimnat.lionloader.business.repos.CategoryRepo;
import org.zimnat.lionloader.business.repos.IndustryRepo;
import org.zimnat.lionloader.business.services.CategoryService;
import org.zimnat.lionloader.business.services.IndustryService;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.services.impl
 */

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    IndustryService industryService;

    @Transactional
    @Override
    public Category save(Category category, User user) {
        category.setId(UUID.randomUUID().toString());
        category.setCreatedBy(user);
        category.setDateCreated(new Date());
        return categoryRepo.save(category);
    }

    @Transactional
    @Override
    public Category update(String id, CategoryDTO categoryDTO, User user) {
        if(id!=null && !id.isEmpty()){
            Category target=categoryRepo.findById(id).get();
            if(target!=null){
                target.setName(categoryDTO.getName());
                target.setDescription(categoryDTO.getDescription());
                target.setIndustry(industryService.findById(categoryDTO.getIndustry()));
                target.setDateModified(new Date());
                target.setModifiedBy(user);
                return categoryRepo.save(target);
            }

        }

        return null;
    }

    @Override
    public List<Category> getAll() {
        return categoryRepo.findAll();
    }

    @Override
    public Category get(String id) {
        return categoryRepo.getById(id);
    }

    @Override
    public List<Category> getByIndustry(Industry industry) {
        return categoryRepo.getCategoriesByIndustry(industry);
    }
}
