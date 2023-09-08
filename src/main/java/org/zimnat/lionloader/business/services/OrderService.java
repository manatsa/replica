package org.zimnat.lionloader.business.services;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zimnat.lionloader.business.domain.Customer;
import org.zimnat.lionloader.business.domain.Order;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.OrderDTO;

import java.util.Date;
import java.util.List;

public interface OrderService {

    public Order get(String orderId);
    public Order save(Order order, User user);
    public Order update(String id, OrderDTO orderDTO, User user);
    public  List<Order> getAll();

    public List<Order> getOrdersForOwner(User owner);

    public List<Order> getOrdersByUser(User owner);

    public List<Order> getOrdersBetween(Date startDate, Date endDate);

    public List<Order> getOrdersForOwnerBetween(User owner, Date startDate, Date endDate);

    public List<Order> getOrdersForOwnerByProduct(User owner, Date startDate, Date endDate);
}
