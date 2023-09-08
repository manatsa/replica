package org.zimnat.lionloader.business.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.zimnat.lionloader.business.domain.Industry;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.repos
 */

public interface IndustryRepo extends JpaRepository<Industry, String> {
    public Industry findByName(String name);
}
