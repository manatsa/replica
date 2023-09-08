package org.zimnat.lionloader.business.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 24/5/2023
 * Package Name :: org.zimnat.lionloader.business.domain
 */


@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class AuditTrail extends BaseEntity{

    private String username;
    private Date start;
    private Date end;
    private String signature;
    private String actionName;
    private String action;
}
