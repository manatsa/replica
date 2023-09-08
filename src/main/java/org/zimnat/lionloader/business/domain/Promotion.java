package org.zimnat.lionloader.business.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zimnat.lionloader.business.domain.enums.DiscountType;

import javax.persistence.Column;
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
public class Promotion extends BaseEntity{

    @Column(unique = true)
    private String name;
    private String description;
    @Enumerated
    private DiscountType discountType;
    private double discount;
    private Date promotionStart;
    private Date promotionEnd;

}
