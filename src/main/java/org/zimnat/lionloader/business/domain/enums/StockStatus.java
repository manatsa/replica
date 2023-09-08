package org.zimnat.lionloader.business.domain.enums;

import org.zimnat.lionloader.utils.StringUtils;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public enum StockStatus {
    INSTOCK(1), LOWSTOCK(2), OUTOFSTOCK(3);

    private final Integer code;

    private StockStatus(Integer code){
        this.code = code;
    }

    public Integer getCode(){
        return code;
    }

    public static StockStatus get(Integer code){
        switch(code){
            case 1:
                return INSTOCK;
            case 2:
                return LOWSTOCK;
            case 3:
                return OUTOFSTOCK;
            default:
                throw new IllegalArgumentException("Illegal parameter passed to method :" + code);
        }
    }

    public String getName(){
        return StringUtils.toCamelCase3(super.name());
    }
}