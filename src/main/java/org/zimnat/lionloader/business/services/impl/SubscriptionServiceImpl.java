package org.zimnat.lionloader.business.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zimnat.lionloader.business.domain.Subscription;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.SubscriptionDTO;
import org.zimnat.lionloader.business.domain.enums.Period;
import org.zimnat.lionloader.business.repos.SubscriptionRepo;
import org.zimnat.lionloader.business.services.SubscriptionService;
import org.zimnat.lionloader.business.services.UserService;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.services.impl
 */

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    @Autowired
    private SubscriptionRepo subscriptionRepo;

    @Autowired
    UserService userService;

    @Override
    public Subscription findById(String id) {
        return subscriptionRepo.findById(id).get();
    }

    @Transactional
    @Override
    public Subscription save(Subscription subscription, User user) {
        subscription.setId(UUID.randomUUID().toString());
        subscription.setEndDate(getEndDate(subscription.getStartDate(),subscription.getPeriod().getName()));
        subscription.setCreatedBy(user);
        subscription.setDateCreated(new Date());
        return subscriptionRepo.save(subscription);
    }

    @Transactional
    @Override
    public Subscription update(String id, SubscriptionDTO subscriptionDTO, User user) {
        if(id!=null && !id.isEmpty()){
            Subscription target=subscriptionRepo.findById(id).get();
            if(target!=null){
                target.setPeriod(Period.valueOf(subscriptionDTO.getPeriod()));
                target.setEndDate(getEndDate(subscriptionDTO.getStartDate(),subscriptionDTO.getPeriod()));
                target.setStartDate(subscriptionDTO.getStartDate());
                target.setSubscriber(userService.get(subscriptionDTO.getSubscriber()));
                target.setDateModified(new Date());
                target.setModifiedBy(user);
                return subscriptionRepo.save(target);
            }

        }

        return null;
    }

    @Override
    public List<Subscription> getAll() {
        return subscriptionRepo.findAll();
    }

    @Override
    public List<Subscription> getAllActive() {
        return null;
    }

    @Override
    public List<Subscription> getAllActiveForSubscriber(User subscriber) {
        return subscriptionRepo.getSubscriptionBySubscriberAndEndDateIsAfter(subscriber, new Date());
    }

    @Override
    public List<Subscription> getAllActiveSubscriptions() {
        return subscriptionRepo.getAllByEndDateIsGreaterThanEqual(new Date());
    }

    public Date getEndDate(Date startDate, String period){
        Period period1=Period.valueOf(period.toUpperCase());
        Calendar calendar=Calendar.getInstance();
        calendar.setTime(startDate!=null?startDate:new Date());
        switch (period1){
            case MONTH:
                calendar.add(Calendar.MONTH,1);
                break;
            case QUARTER:
                calendar.add(Calendar.MONTH,3);
                break;
            case TERM:
                calendar.add(Calendar.MONTH,4);
                break;
            case HALF_YEAR:
                calendar.add(Calendar.MONTH,6);
                break;
            case YEAR:
                calendar.add(Calendar.YEAR,1);
                break;

            default:
                throw new RuntimeException("The subscription period is invalid.");


        }

        return calendar.getTime();
    }
}
