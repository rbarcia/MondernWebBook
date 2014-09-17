package com.ibm.mwdbook.util;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.interceptor.AroundInvoke;
import javax.interceptor.InvocationContext;

public class AuditInterceptor {
	private final static Logger audit = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME); 
	
	public AuditInterceptor()
	{
		audit.setLevel(Level.FINE);
	}
	
	@AroundInvoke
	public Object logInterceptor(InvocationContext ctx) throws Exception
	{
	   audit.log(Level.FINE, "Entering: " + ctx.getMethod());
	   Object result = ctx.proceed();
	   audit.log(Level.FINE, "Exiting: " + ctx.getMethod());
	   return result;
	}
}
