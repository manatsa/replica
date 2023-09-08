package org.zimnat.lionloader.business.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zimnat.lionloader.business.domain.AuditTrail;

import java.util.Date;
import java.util.List;

public interface AuditTrailRepo extends JpaRepository<AuditTrail, String> {

    List<AuditTrail> findAllByUsername(String username);
    List<AuditTrail> findAllByActionContainingIgnoreCaseAndUsername(String action, String username);
    List<AuditTrail> findAllByUsernameAndStartIsGreaterThanEqualAndEndIsLessThanEqual(String username, Date start, Date end);
    List<AuditTrail> findAllByUsernameAndDateCreatedBetween(String username, Date start, Date end);
}
