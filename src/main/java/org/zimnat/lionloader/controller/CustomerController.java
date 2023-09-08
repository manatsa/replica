package org.zimnat.lionloader.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zimnat.lionloader.aop.annotation.Auditor;
import org.zimnat.lionloader.business.domain.Customer;
import org.zimnat.lionloader.business.domain.Order;
import org.zimnat.lionloader.business.domain.Product;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.CustomerDTO;
import org.zimnat.lionloader.business.domain.dto.CustomerOrderDTO;
import org.zimnat.lionloader.business.domain.dto.OrderDTO;
import org.zimnat.lionloader.business.services.*;
import zw.co.paynow.core.Payment;
import zw.co.paynow.core.Paynow;
import zw.co.paynow.responses.StatusResponse;
import zw.co.paynow.responses.WebInitResponse;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * @author :: codemaster
 * created on :: 2/4/2023
 */

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    CustomerService customerService;

    @Autowired
    UserService userService;

    @Autowired
    CategoryService categoryService;

    @Autowired
    ProductService productService;

    @Autowired
    OrderService orderService;

    Paynow paynow = new Paynow("16459", "c2a23ef7-99a3-4782-9b9a-b0f573c04478");


    @Auditor
    @GetMapping("/")
    public ResponseEntity<?> getAll(){
        List<Customer> customers=customerService.getAll();
        return ResponseEntity.ok(customers);
    }


    @Auditor
    @PostMapping("/")
    public ResponseEntity<?> createCustomer(@RequestBody CustomerOrderDTO customerOrderDTO) {

        CustomerDTO customerDTO=customerOrderDTO.getCustomer();
        OrderDTO[] orderDTOs=customerOrderDTO.getOrders();
        Customer customer= customerService.getCustomerByEmailOrPhone(customerDTO.getEmail(), customerDTO.getPhone());
        System.err.println(customerOrderDTO.getPayment());
        User user=userService.getCurrentUser();
        try{
            if(customer==null){
                customer= new Customer();
                customer.setFirstName(customerDTO.getFirstName());
                customer.setLastName(customerDTO.getLastName());
                customer.setAddress(customerDTO.getAddress());
                customer.setAddress2(customer.getAddress2());
                customer.setEmail(customerDTO.getEmail());
                customer.setPhone(customerDTO.getPhone());
                customer.setPhone2(customer.getPhone2());
                customer.setTitle(customerDTO.getTitle());
                customer.setActive(Boolean.TRUE);
                customer.setDeliver(customerDTO.getDeliver().equalsIgnoreCase("Yes"));
                customer.setRegister(customerDTO.getRegister().equalsIgnoreCase("Yes"));
                customer =customerService.save(customer, user);
            }

            /*if(customerOrderDTO.getPayment()){
                Payment payment = paynow.createPayment(customer.getLastName()+"#"+customer.getFirstName());
                for(OrderDTO orderDTO: orderDTOs){
                    Product product= productService.get(orderDTO.getProductID());
                    payment.add(product.getName(), (product.getPrice()* orderDTO.getQuantity()));
                }
                payment.setCartDescription("Order from "+customer.getLastName()+" "+customer.getFirstName()+" on "+new Date());
                WebInitResponse response = paynow.send(payment);
                response.getErrors().stream().forEach(System.err::println);
                if (response.success()) {
                    // Get the url to redirect the user to so they can make payment
                    String redirectUrl = response.redirectURL();

                    // Get the poll URL of the transaction
                    String pollUrl = response.pollUrl();
                    System.err.println("POLL URL::"+pollUrl);

                    StatusResponse status = paynow.pollTransaction(pollUrl);

                    if (status.isPaid()) {
                        // Yay! Transaction was paid for
                    } else {
                        System.out.println("Why you no pay?");
                    }
                } else {
                    //System.err.println("Error sending payment request.");
                    return ResponseEntity.status(422).body("Failed to make payment.");
                    // *freak out*
                }

            }*/

            for(OrderDTO orderDTO: orderDTOs){
                Order order= new Order();
                order.setCustomer(customerService.get(customer.getId()));
                order.setQuantity(orderDTO.getQuantity());
                order.setDeliveryDate(orderDTO.getDeliveryDate());
                order.setProduct(productService.get(orderDTO.getProductID()));
                order=orderService.save(order, user);
            }

            return  ResponseEntity.ok(customer);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @Auditor
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@RequestBody CustomerDTO customerDTO, @PathVariable("id") String id){

        try{
            User currentUser=userService.getCurrentUser();
            Customer customer=customerService.update(id, customerDTO,currentUser);
            return  ResponseEntity.ok(customerService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
