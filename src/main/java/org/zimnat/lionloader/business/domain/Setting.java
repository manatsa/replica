package org.zimnat.lionloader.business.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zimnat.lionloader.business.domain.enums.UserLevel;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 9/6/2023
 * Package Name :: org.zimnat.lionloader.business.domain
 */

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Setting extends BaseEntity{

    private String name;
    private String description;
    private String property;
    private String value;
    private Date effectiveDate;
    @Enumerated
    private UserLevel level;
}
