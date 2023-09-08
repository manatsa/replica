package org.zimnat.lionloader.business.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zimnat.lionloader.business.domain.Setting;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.SettingDTO;
import org.zimnat.lionloader.business.domain.enums.UserLevel;
import org.zimnat.lionloader.business.repos.SettingRepo;
import org.zimnat.lionloader.business.services.SettingService;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @author :: codemaster
 * created on :: 9/6/2023
 * Package Name :: org.zimnat.lionloader.business.services.impl
 */

@Service
public class SettingServiceImpl implements SettingService {

    @Autowired
    SettingRepo settingRepo;

    @Override
    public List<Setting> getAll() {
        return settingRepo.findAll();
    }

    @Override
    public Setting save(Setting setting, User user) {
        if(setting!=null){
            setting.setDateCreated(new Date());
            setting.setId(UUID.randomUUID().toString());
            setting.setCreatedBy(user);
            return settingRepo.save(setting);
        }
        return null;
    }

    @Transactional
    @Override
    public Setting update(String id, SettingDTO settingsDTO, User user) {
        if(id!=null && !id.isEmpty()){
            Setting target=settingRepo.getById(id);
            target.setDescription(settingsDTO.getDescription());
            target.setName(settingsDTO.getName());
            target.setLevel(UserLevel.valueOf(settingsDTO.getLevel()));
            target.setProperty(settingsDTO.getProperty());
            target.setValue(settingsDTO.getValue());
            target.setEffectiveDate(settingsDTO.getEffectiveDate());
            target.setDateModified(new Date());
            target.setModifiedBy(user);

            return settingRepo.save(target);
        }
        return null;
    }

    @Override
    public Setting findById(String id) {
        if(id!=null && !id.isEmpty()){
            return settingRepo.findById(id).get();
        }
        return null;
    }

    @Override
    public Setting findByName(String name) {
        if(name!=null && !name.isEmpty()){
            return settingRepo.findByName(name);
        }
        return null;
    }

    @Override
    public List<Setting> findByDescription(String description) {
        if(description!=null && !description.isEmpty()){
            return settingRepo.findByDescriptionContainingIgnoreCase(description);
        }
        return null;
    }
}
