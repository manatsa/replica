package org.zimnat.lionloader.business.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.domain
 */

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Category extends BaseEntity{

    @Column(unique = true)
    private String name;
    private String description;

    @ManyToOne
    @JoinColumn(name = "industry_id")
    Industry industry;
}
