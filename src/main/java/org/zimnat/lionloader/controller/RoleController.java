package org.zimnat.lionloader.controller;

import org.joda.time.chrono.StrictChronology;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zimnat.lionloader.aop.annotation.Auditor;
import org.zimnat.lionloader.business.domain.BaseName;
import org.zimnat.lionloader.business.domain.Privilege;
import org.zimnat.lionloader.business.domain.Role;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.RoleDTO;
import org.zimnat.lionloader.business.services.PrivilegeService;
import org.zimnat.lionloader.business.services.RoleService;
import org.zimnat.lionloader.business.services.UserService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author :: codemaster
 * created on :: 1/4/2023
 */

@RestController
@RequestMapping("/api/roles")
public class RoleController {

   @Autowired
   RoleService roleService;

   @Autowired
    PrivilegeService privilegeService;

   @Autowired
    UserService userService;

   @Auditor
    @GetMapping("/")
    public ResponseEntity<?> getRoles(){
        try{

           List<Role> roles=roleService.getAll().stream().filter(role -> role!=null && role.getName()!=null).map(role -> {
               role.setPrivilegeString(privsToString(role));
               return role;
           }).collect(Collectors.toList());
           return ResponseEntity.ok(roles);
        }catch (Exception e){
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @Auditor
    @PostMapping("/")
    public ResponseEntity<?> createRole(@RequestBody RoleDTO roleDTO){
        Role role=new Role();
        role.setName(roleDTO.getName());
        Set<Privilege> privilegeSet= roleDTO.getPrivileges().stream().map(p->privilegeService.getByName(p)).collect(Collectors.toSet());
        role.setPrivileges(privilegeSet);
        try{
            role=roleService.save(role);
            return  ResponseEntity.ok(roleService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @Auditor
    @PutMapping("/{id}")
    public ResponseEntity<?> createRole(@RequestBody RoleDTO roleDTO, @PathVariable("id") String id){

        try{
            User currentUser=userService.getCurrentUser();
            Role role=roleService.update(id, roleDTO,currentUser);
            return  ResponseEntity.ok(roleService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    private String privsToString(Role role){
        return role.getPrivileges().stream().map(BaseName::getName).collect(Collectors.joining(","));
    }
}
