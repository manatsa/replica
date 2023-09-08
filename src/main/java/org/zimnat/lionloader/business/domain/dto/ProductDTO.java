package org.zimnat.lionloader.business.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zimnat.lionloader.business.domain.Category;
import org.zimnat.lionloader.business.domain.User;

import java.sql.Blob;
import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.domain.dto
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private String name;

    private String description;

    private double price;

    private String category;

    private Boolean active;

    private String owner;

    private String coupon;

    private String discountType;

    private String discount;

    private Date promotionStart;

    private Date promotionEnd;

    private String effectiveDate;

    private String Tags;

    private String picture;
}
