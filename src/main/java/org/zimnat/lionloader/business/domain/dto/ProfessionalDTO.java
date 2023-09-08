package org.zimnat.lionloader.business.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Lob;
import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 23/5/2023
 * Package Name :: org.zimnat.lionloader.business.domain.dto
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessionalDTO {

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

    private String category;

    private Boolean active;

    private String experience;

    private String organization;

    private String admin;

    private String Tags;

    private String picture;
}
