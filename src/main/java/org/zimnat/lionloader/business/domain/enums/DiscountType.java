package org.zimnat.lionloader.business.domain.enums;

import org.zimnat.lionloader.utils.StringUtils;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public enum DiscountType {
    LITERAL(1), PERCENTAGE(2), COUPON(3);

    private final Integer code;

    private DiscountType(Integer code){
        this.code = code;
    }

    public Integer getCode(){
        return code;
    }

    public static DiscountType get(Integer code){
        switch(code){
            case 1:
                return LITERAL;
            case 2:
                return PERCENTAGE;
            case 3:
                return COUPON;
            default:
                throw new IllegalArgumentException("Illegal parameter passed to method :" + code);
        }
    }

    public String getName(){
        return StringUtils.toCamelCase3(super.name());
    }
}