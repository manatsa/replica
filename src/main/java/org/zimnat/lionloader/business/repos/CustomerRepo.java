package org.zimnat.lionloader.business.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zimnat.lionloader.business.domain.Customer;
import org.zimnat.lionloader.business.domain.Role;
import org.zimnat.lionloader.utils.Constants;

import java.util.List;
import java.util.Set;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Repository
public interface CustomerRepo extends JpaRepository<Customer, String> {
    public Customer findByEmailIsOrPhoneIs(String email, String phone);
}