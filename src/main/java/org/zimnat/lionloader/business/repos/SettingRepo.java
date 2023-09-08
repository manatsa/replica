package org.zimnat.lionloader.business.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zimnat.lionloader.business.domain.Setting;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 9/6/2023
 * Package Name :: org.zimnat.lionloader.business.repos
 */

@Repository
public interface SettingRepo extends JpaRepository<Setting, String> {
    public Setting findByName(String name);
    public List<Setting> findByDescriptionContainingIgnoreCase(String description);
}
