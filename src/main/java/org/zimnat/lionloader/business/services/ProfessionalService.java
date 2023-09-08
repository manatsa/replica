package org.zimnat.lionloader.business.services;
import org.zimnat.lionloader.business.domain.Category;
import org.zimnat.lionloader.business.domain.Industry;
import org.zimnat.lionloader.business.domain.Professional;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.ProfessionalDTO;

import java.util.List;

public interface ProfessionalService {

    public Professional save(Professional professionalDTO, User user);
    public Professional update(String id, ProfessionalDTO professionalDTO, User user);
    public  List<Professional> getAll();

    public List<Professional> findByName(String name);
    public List<Professional> getProfessionalsByCategoryAndActive(Category category);
    public List<Professional> getProfessionalsByTitleAndActive(String title);

    List<Professional> getProfessionalsByCategory(Category category);

    public List<Professional> getProfessionalsByIndustry(Industry industry);
}
