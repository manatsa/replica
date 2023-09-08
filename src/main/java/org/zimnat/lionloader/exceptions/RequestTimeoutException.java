package org.zimnat.lionloader.exceptions;

/**
 * @author :: codemaster
 * created on :: 24/5/2023
 * Package Name :: org.zimnat.lionloader.exceptions
 */

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.REQUEST_TIMEOUT)
public class RequestTimeoutException extends Exception{

    private static final long serialVersionUID = 1L;

    public RequestTimeoutException(String message){
        super(message);
    }
}