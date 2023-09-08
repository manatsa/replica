package org.zimnat.lionloader.business.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zimnat.lionloader.business.domain.enums.StockStatus;

import javax.persistence.*;
import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.domain
 */

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Professional extends BaseEntity{

    private String title;

    private String firstName;

    private String lastName;

    private String address;

    private String address2;

    private String email;

    private String phone;

    private String phone2;

    private String tel;

    private String qualifications;

    private Boolean active;

    private String experience;

    private String organization;

    private String Tags;

    @Lob
    private String picture;

    @ManyToOne
    @JoinColumn(name = "category_id")
    Category category;

    @OneToOne(optional = true)
    @JoinColumn(name = "admin_id")
    User administrator;
}
