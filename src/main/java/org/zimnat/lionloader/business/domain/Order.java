package org.zimnat.lionloader.business.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.domain
 */

@Table(name="Orders")
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Order extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    private double quantity;
    private Date deliveryDate;
    private boolean payment;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
}
