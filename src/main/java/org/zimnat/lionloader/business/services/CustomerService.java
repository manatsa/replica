package org.zimnat.lionloader.business.services;
import org.zimnat.lionloader.business.domain.*;
import org.zimnat.lionloader.business.domain.dto.CustomerDTO;

import java.util.List;

public interface CustomerService {

    public Customer get(String customerId);
    public Customer save(Customer customer, User user);
    public Customer update(String id, CustomerDTO customerDTO, User user);
    public  List<Customer> getAll();

    public Customer getCustomerByEmailOrPhone(String email, String phone);
}
