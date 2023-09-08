package org.zimnat.lionloader.business.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author :: codemaster
 * created on :: 5/9/2023
 * Package Name :: org.zimnat.lionloader.business.domain.dto
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerOrderDTO {
    private OrderDTO[] orders;
    private CustomerDTO customer;
    private Boolean payment;
}
