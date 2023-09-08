package org.zimnat.lionloader.business.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zimnat.lionloader.business.domain.Order;
import org.zimnat.lionloader.business.domain.Product;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.utils.Constants;

import java.util.Date;
import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Repository
public interface OrderRepo extends JpaRepository<Order, String> {

    @Query("Select Distinct o from Order o left join fetch o.product p  where p.owner =:owner")
    public List<Order> getOrderForOwner(@Param("owner") User owner);

    @Query("Select Distinct o from Order o left join fetch o.product p  where o.createdBy =:user")
    public List<Order> getOrderByUser(@Param("user") User owner);

    @Query("Select Distinct o from Order o left join fetch o.product p  where o.dateCreated between :startDate and :endDate")
    public List<Order> getOrdersBetween(@Param("startDate")Date startDate, @Param("endDate") Date endDate);

    @Query("Select Distinct o from Order o left join fetch o.product p  where p.owner=:owner and (o.dateCreated between :startDate and :endDate)")
    public List<Order> getOrdersForOwnerBetween(@Param("owner") User owner,@Param("startDate")Date startDate, @Param("endDate") Date endDate);

    @Query("Select Distinct o from Order o  where o.product=:product")
    public User getOrdersByProduct(@Param("product") Product product);
}