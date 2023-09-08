package org.zimnat.lionloader.business.services;

import org.zimnat.lionloader.business.domain.Promotion;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.PromotionDTO;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 9/6/2023
 * Package Name :: org.zimnat.lionloader.business.services
 */

public interface PromotionService {

    public List<Promotion> getAll();
    public Promotion save(Promotion setting, User user);
    public Promotion update(String id, PromotionDTO promotionDTO, User user);
    public Promotion findById(String id);
    public Promotion findByName(String name);
    public List<Promotion> findByDescription(String description);
}
