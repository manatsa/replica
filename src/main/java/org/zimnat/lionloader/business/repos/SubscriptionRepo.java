package org.zimnat.lionloader.business.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zimnat.lionloader.business.domain.Category;
import org.zimnat.lionloader.business.domain.Industry;
import org.zimnat.lionloader.business.domain.Subscription;
import org.zimnat.lionloader.business.domain.User;

import java.util.Date;
import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.repos
 */

public interface SubscriptionRepo extends JpaRepository<Subscription, String> {

    public List<Subscription> getSubscriptionBySubscriberAndEndDateIsAfter(User subscriber, Date endDate);

    public List<Subscription> getAllByEndDateIsGreaterThanEqual(Date endDate);
}
