package org.zimnat.lionloader.business.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zimnat.lionloader.business.domain.enums.StockStatus;

import javax.persistence.*;
import java.sql.Blob;
import java.util.Date;
import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.domain
 */

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Product extends BaseEntity{

    private String name;

    private String description;

    private double price;

    private String tags;

    private String coupon;

    private double discount;

    private Date promotionStartDate;

    private Date promotionEndDate;

    private Date effectiveDate;

    @Enumerated
    private StockStatus stockStatus;

    @Transient
    private String image;

    @Lob
    private String picture;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "category_id")
    Category category;
}
