package org.zimnat.lionloader.business.services;

import org.zimnat.lionloader.business.domain.Industry;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.IndustryDTO;
import org.zimnat.lionloader.exceptions.InternalServerErrorException;

import java.util.List;

public interface IndustryService {

    public Industry findById(String id);
    public Industry save(Industry industry, User user);

    public Industry update(String id, IndustryDTO industryDTO, User user);

    public List<Industry> getAll();
}
