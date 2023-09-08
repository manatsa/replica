package org.zimnat.lionloader.business.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zimnat.lionloader.business.domain.Category;
import org.zimnat.lionloader.business.domain.Industry;
import org.zimnat.lionloader.business.domain.Professional;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.ProfessionalDTO;
import org.zimnat.lionloader.business.repos.ProfessionalRepo;
import org.zimnat.lionloader.business.services.CategoryService;
import org.zimnat.lionloader.business.services.ProfessionalService;
import org.zimnat.lionloader.business.services.UserService;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.services.impl
 */


@Service
public class ProfessionalServiceImpl implements ProfessionalService {

    @Autowired
    private ProfessionalRepo professionalRepo;

    @Autowired
    CategoryService categoryService;

    @Autowired
    UserService userService;

    @Transactional
    @Override
    public Professional save(Professional professional, User user) {
        if(professional!=null){
            professional.setId(UUID.randomUUID().toString());
            professional.setCreatedBy(user);
            professional.setDateCreated(new Date());

            return professionalRepo.save(professional);
        }
        return null;
    }

    @Transactional
    @Override
    public Professional update(String id, ProfessionalDTO professionalDTO, User user) {
        if(id!=null && !id.isEmpty()){
            Professional target=professionalRepo.getById(id);
            if(target!=null){
                target.setFirstName(professionalDTO.getFirstName());
                target.setLastName(professionalDTO.getLastName());
                target.setAddress(professionalDTO.getAddress());
                target.setAddress2(professionalDTO.getAddress2());
                if(professionalDTO.getPicture()!=null && professionalDTO.getPicture().length()>0) {
                    target.setPicture(professionalDTO.getPicture());
                }
                target.setTags(professionalDTO.getTags());
                target.setEmail(professionalDTO.getEmail());
                target.setExperience(professionalDTO.getExperience());
                target.setOrganization(professionalDTO.getOrganization());
                if(professionalDTO.getCategory()!=null) {
                    target.setCategory(categoryService.get(professionalDTO.getCategory()));
                }
                target.setPhone(professionalDTO.getPhone());
                target.setPhone2(professionalDTO.getPhone2());
                target.setTel(professionalDTO.getTel());
                target.setQualifications(professionalDTO.getQualifications());
                target.setTitle(professionalDTO.getTitle());
                target.setModifiedBy(user);
                target.setDateModified(new Date());
                target.setActive(professionalDTO.getActive());
                Optional<String> optionalAdmin=Optional.ofNullable(professionalDTO.getAdmin());
                target.setAdministrator(optionalAdmin.isPresent()?userService.get(professionalDTO.getAdmin()):null);
            }
        }
        return null;
    }

    @Override
    public List<Professional> getAll() {
        List<Professional> professionals=professionalRepo.findAllByActive(Boolean.TRUE);
        return professionals;
    }

    @Override
    public List<Professional> getProfessionalsByTitleAndActive(String title) {
        List<Professional> professionals=professionalRepo.getProfessionalByTitleAndActive(title, Boolean.TRUE);
        return professionals;

    }


    @Override
    public List<Professional> findByName(String name) {
        if(name!=null && !name.isEmpty()) {
            String[] names = name.split(" ");
            List<Professional> professionals= professionalRepo.findByFirstName(names[0]);
            if(names[1]!=null && !names[1].isEmpty()){
                professionals.addAll(professionalRepo.findByLastName(names[1]));
            }

            return professionals;
        }

        return null;
    }

    @Override
    public List<Professional> getProfessionalsByCategoryAndActive(Category category) {
        return professionalRepo.getProfessionalsByCategoryAndActive(category, Boolean.TRUE);
    }

    @Override
    public List<Professional> getProfessionalsByCategory(Category category) {
        return professionalRepo.getProfessionalsByCategory(category);
    }

    @Override
    public List<Professional> getProfessionalsByIndustry(Industry industry) {
        return null;
    }
}
