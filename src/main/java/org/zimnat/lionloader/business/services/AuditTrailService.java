package org.zimnat.lionloader.business.services;

import org.zimnat.lionloader.business.domain.AuditTrail;
import org.zimnat.lionloader.business.domain.User;

import java.util.Date;
import java.util.List;

public interface AuditTrailService {

    AuditTrail save(AuditTrail auditTrail, User user);
    List<AuditTrail> getByUsername(String username);
    List<AuditTrail> getByActionContainingIgnoreCaseAndUsername(String action, String username);
    List<AuditTrail> getByUsernameAndStartIsGreaterThanEqualAndEndIsLessThanEqual(String username, Date start, Date end);
    List<AuditTrail> getByUsernameAndDateCreatedBetween(String username, Date start, Date end);
}
