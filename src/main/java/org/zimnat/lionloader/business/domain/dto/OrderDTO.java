package org.zimnat.lionloader.business.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zimnat.lionloader.business.domain.BaseEntity;
import org.zimnat.lionloader.business.domain.Customer;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 5/9/2023
 * Package Name :: org.zimnat.lionloader.business.domain.dto
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private String productID;
    private double quantity;
    private Date deliveryDate;
    private boolean payment;
}
