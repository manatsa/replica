package org.zimnat.lionloader.business.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.zimnat.lionloader.business.domain.AuditTrail;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.repos.AuditTrailRepo;
import org.zimnat.lionloader.business.services.AuditTrailService;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @author :: codemaster
 * created on :: 24/5/2023
 * Package Name :: org.zimnat.lionloader.business.services.impl
 */

@Service
public class AuditTrailServiceImpl implements AuditTrailService {

    @Autowired
    AuditTrailRepo auditTrailRepo;

    @Override
    public AuditTrail save(AuditTrail auditTrail, User user) {
        auditTrail.setCreatedBy(user);
        auditTrail.setDateCreated(new Date());
        auditTrail.setId(UUID.randomUUID().toString());
        return auditTrailRepo.save(auditTrail);
    }

    @Override
    public List<AuditTrail> getByUsername(String username) {
        if(username==null){
            return null;
        }
        return auditTrailRepo.findAllByUsername(username);
    }

    @Override
    public List<AuditTrail> getByActionContainingIgnoreCaseAndUsername(String action, String username) {
        if(username==null){
            return null;
        }
        return auditTrailRepo.findAllByActionContainingIgnoreCaseAndUsername(action, username);
    }

    @Override
    public List<AuditTrail> getByUsernameAndStartIsGreaterThanEqualAndEndIsLessThanEqual(String username, Date start, Date end) {
        if(start==null || end==null){
            return null;
        }
        return auditTrailRepo.findAllByUsernameAndStartIsGreaterThanEqualAndEndIsLessThanEqual(username, start, end);
    }

    @Override
    public List<AuditTrail> getByUsernameAndDateCreatedBetween(String username,Date start, Date end) {
        if(start==null || end==null){
            return null;
        }
        return auditTrailRepo.findAllByUsernameAndDateCreatedBetween(username, start, end);
    }
}
