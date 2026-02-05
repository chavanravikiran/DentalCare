package com.dentalcare.dentalcaremanager.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class RendezVousLoggingAspect {

    @Pointcut("execution(* com.dentalcare.dentalcaremanager.service.RendezVousServiceImpl.*(..))")
    public void rendezVousMethods() {}

    @Before("rendezVousMethods()")
    public void logBefore(JoinPoint joinPoint) {
        log.info("🔍 Method call : {} with arguments : {}",
                joinPoint.getSignature().getName(),
                Arrays.toString(joinPoint.getArgs()));
    }

    @AfterReturning(pointcut = "rendezVousMethods()", returning = "result")
    public void logAfter(JoinPoint joinPoint, Object result) {
        log.info("✅ Success Method : {} → Result : {}",
                joinPoint.getSignature().getName(),
                result);
    }

    @AfterThrowing(pointcut = "rendezVousMethods()", throwing = "ex")
    public void logException(JoinPoint joinPoint, Throwable ex) {
        log.error("❌ Exception in method : {} → {}",
                joinPoint.getSignature().getName(),
                ex.getMessage());
    }
}
