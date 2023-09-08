package org.zimnat.lionloader.business.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 24/6/2023
 * Package Name :: org.zimnat.lionloader.business.domain.dto
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionDTO{
    private Date startDate;
    private Date endDate;
    private String period;
    private String subscriber;
}