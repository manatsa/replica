package org.zimnat.lionloader.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.zimnat.lionloader.business.domain.AuditTrail;
import org.zimnat.lionloader.business.services.AuditTrailService;
import org.zimnat.lionloader.business.services.UserService;

import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 24/5/2023
 * Package Name :: org.zimnat.lionloader.aop
 */


@Aspect
@Component
public class LoggerAspect {

    @Autowired
    UserService userService;

    @Autowired
    AuditTrailService auditTrailService;

    @Around("@annotation(org.zimnat.lionloader.aop.annotation.Auditor)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();

        Object proceed = joinPoint.proceed();

        long end=System.currentTimeMillis();
        var actionName=joinPoint.getSignature().getName();
        var action=actionName.startsWith("get")?"GET":actionName.startsWith("create")?"POST":actionName.startsWith("update")?"PUT":"OTHER";
        AuditTrail trail= new AuditTrail(userService.getCurrentUsername(),new Date(start), new Date(end),joinPoint.getSignature().toString(),actionName,action );
        auditTrailService.save(trail, userService.getCurrentUser());
        return proceed;
    }
}
