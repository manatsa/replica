package org.zimnat.lionloader.business.domain.enums;

import org.zimnat.lionloader.utils.StringUtils;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public enum Period {
    MONTH(1), QUARTER(2), TERM(3),HALF_YEAR(4), YEAR(5);

    private final Integer code;

    private Period(Integer code){
        this.code = code;
    }

    public Integer getCode(){
        return code;
    }

    public static Period get(Integer code){
        switch(code){
            case 1:
                return MONTH;
            case 2:
                return QUARTER;
            case 3:
                return TERM;
            case 4:
                return HALF_YEAR;
            case 5:
                return YEAR;
            default:
                throw new IllegalArgumentException("Illegal parameter passed to method :" + code);
        }
    }

    public String getName(){
        return StringUtils.toCamelCase3(super.name());
    }
}