package org.zimnat.lionloader.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zimnat.lionloader.aop.annotation.Auditor;
import org.zimnat.lionloader.business.domain.Professional;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.ProfessionalDTO;
import org.zimnat.lionloader.business.services.CategoryService;
import org.zimnat.lionloader.business.services.ProfessionalService;
import org.zimnat.lionloader.business.services.UserService;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 2/4/2023
 */

@RestController
@RequestMapping("/api/professionals")
public class ProfessionalController {

    @Autowired
    ProfessionalService professionalService;

    @Autowired
    UserService userService;

    @Autowired
    CategoryService categoryService;

    @Auditor
    @GetMapping("/")
    public ResponseEntity<?> getAll(){
        List<Professional> professionals=professionalService.getAll();
        return ResponseEntity.ok(professionals);
    }


    @Auditor
    @PostMapping("/")
    public ResponseEntity<?> createProfessional(@RequestBody ProfessionalDTO professionalDTO) {

        Professional professional= new Professional();
        User user=userService.getCurrentUser();
        try{
            if(professional!=null){
                professional.setFirstName(professionalDTO.getFirstName());
                professional.setLastName(professionalDTO.getLastName());
                professional.setAddress(professionalDTO.getAddress());
                professional.setAddress2(professional.getAddress2());
                if(professionalDTO.getPicture()!=null && professionalDTO.getPicture().length()>0) {
                    professional.setPicture(professionalDTO.getPicture());
                }
                professional.setTags(professionalDTO.getTags());
                professional.setEmail(professionalDTO.getEmail());
                professional.setExperience(professionalDTO.getExperience());
                professional.setOrganization(professionalDTO.getOrganization());
                professional.setCategory(categoryService.get(professionalDTO.getCategory()));
                professional.setPhone(professionalDTO.getPhone());
                professional.setPhone2(professional.getPhone2());
                professional.setTel(professionalDTO.getTel());
                professional.setQualifications(professionalDTO.getQualifications());
                professional.setTitle(professionalDTO.getTitle());
                professional.setActive(Boolean.TRUE);
                professional.setAdministrator(userService.get(professionalDTO.getAdmin()));
            }
            professional =professionalService.save(professional, user);
            List<Professional> professionals=professionalService.getAll();
            return  ResponseEntity.ok(professionals);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @Auditor
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfessional(@RequestBody ProfessionalDTO professionalDTO, @PathVariable("id") String id){

        try{
            User currentUser=userService.getCurrentUser();
            Professional professional=professionalService.update(id, professionalDTO,currentUser);
            return  ResponseEntity.ok(professionalService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
