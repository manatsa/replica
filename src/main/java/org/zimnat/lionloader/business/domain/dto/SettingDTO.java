package org.zimnat.lionloader.business.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zimnat.lionloader.business.domain.BaseEntity;
import org.zimnat.lionloader.business.domain.enums.UserLevel;

import javax.persistence.Enumerated;
import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 9/6/2023
 * Package Name :: org.zimnat.lionloader.business.domain.dto
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SettingDTO {
    private String name;
    private String description;
    private String property;
    private String value;
    private Date effectiveDate;
    private String level;
}