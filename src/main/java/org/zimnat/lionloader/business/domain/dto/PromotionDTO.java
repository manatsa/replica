package org.zimnat.lionloader.business.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zimnat.lionloader.business.domain.enums.DiscountType;
import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 9/6/2023
 * Package Name :: org.zimnat.lionloader.business.domain.dto
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionDTO {
    private String name;
    private String description;
    private DiscountType discountType;
    private double discount;
    private Date promotionStart;
    private Date promotionEnd;

}