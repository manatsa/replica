package org.zimnat.lionloader.business.services;

import org.zimnat.lionloader.business.domain.Subscription;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.SubscriptionDTO;

import java.util.List;

public interface SubscriptionService {

    public Subscription findById(String id);
    public Subscription save(Subscription industry, User user);
    public Subscription update(String id, SubscriptionDTO industryDTO, User user);
    public List<Subscription> getAll();
    public List<Subscription> getAllActive();
    public List<Subscription> getAllActiveForSubscriber(User subscriber);

    public List<Subscription> getAllActiveSubscriptions();
}
