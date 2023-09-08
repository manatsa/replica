package org.zimnat.lionloader.business.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zimnat.lionloader.business.domain.BaseEntity;

import javax.persistence.Entity;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.domain
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDTO{

    private String title;

    private String firstName;

    private String lastName;

    private String address;

    private String address2;

    private String email;

    private String phone;

    private String phone2;

    private String deliver;

    private String register;

    private OrderDTO order;

}
