package org.zimnat.lionloader.business.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zimnat.lionloader.business.domain.Order;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.OrderDTO;
import org.zimnat.lionloader.business.repos.OrderRepo;
import org.zimnat.lionloader.business.services.CustomerService;
import org.zimnat.lionloader.business.services.OrderService;
import org.zimnat.lionloader.business.services.ProductService;
import org.zimnat.lionloader.business.services.UserService;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.services.impl
 */


@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    ProductService productService;

    @Autowired
    CustomerService customerService;

    @Autowired
    UserService userService;

    @Override
    public Order get(String orderId) {
        return orderRepo.getById(orderId);
    }

    @Transactional
    @Override
    public Order save(Order order, User user) {
        if(order!=null){
            order.setId(UUID.randomUUID().toString());
//            order.setCreatedBy(user);
            order.setDateCreated(new Date());

            return orderRepo.save(order);
        }
        return null;
    }

    @Transactional
    @Override
    public Order update(String id, OrderDTO orderDTO, User user) {
        if(id!=null && !id.isEmpty()){
            Order target=orderRepo.getById(id);
            if(target!=null){
                target.setProduct(productService.get(orderDTO.getProductID()));
//                target.setProduct(orderDTO.getProductID());
                target.setQuantity(orderDTO.getQuantity());
                target.setDeliveryDate(orderDTO.getDeliveryDate());
                target.setModifiedBy(user);
                target.setDateModified(new Date());
            }
        }
        return null;
    }

    @Override
    public List<Order> getAll() {
        List<Order> orders=orderRepo.findAll();
        return orders;
    }

    @Override
    public List<Order> getOrdersForOwner(User owner) {
        return orderRepo.getOrderForOwner(owner);
    }

    @Override
    public List<Order> getOrdersByUser(User owner) {
        return orderRepo.getOrderByUser(owner);
    }

    @Override
    public List<Order> getOrdersBetween(Date startDate, Date endDate) {
        return orderRepo.getOrdersBetween(startDate, endDate);
    }

    @Override
    public List<Order> getOrdersForOwnerBetween(User owner, Date startDate, Date endDate) {
        return orderRepo.getOrdersForOwnerBetween(owner, startDate, endDate);
    }

    @Override
    public List<Order> getOrdersForOwnerByProduct(User owner, Date startDate, Date endDate) {
        return null;
    }


}
