package org.zimnat.lionloader.business.services;

import org.zimnat.lionloader.business.domain.Category;
import org.zimnat.lionloader.business.domain.Industry;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {

    public Category save(Category category, User user);

    public Category update(String id, CategoryDTO categoryDTO, User user);

    public List<Category> getAll();

    public Category get(String id);

    public List<Category> getByIndustry(Industry industry);
}
