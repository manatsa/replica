package org.zimnat.lionloader.business.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zimnat.lionloader.business.domain.enums.Period;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 24/6/2023
 * Package Name :: org.zimnat.lionloader.business.domain
 */

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Subscription extends BaseEntity{
    private Date startDate;
    private Date endDate;
    @Enumerated
    private Period period;
    @ManyToOne
    @JoinColumn(name="subscriber_id")
    User subscriber;
}
