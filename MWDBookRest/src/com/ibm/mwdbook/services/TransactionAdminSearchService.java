package com.ibm.mwdbook.services;

import java.util.List;

import javax.annotation.security.DeclareRoles;
import javax.annotation.security.RolesAllowed;
import javax.ejb.EJB;
import javax.ejb.Singleton;
import javax.interceptor.Interceptors;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.ibm.mwdbook.dao.TransactionDao;
import com.ibm.mwdbook.exception.NotAuthorizedException;
import com.ibm.mwdbook.jpa.Transaction;
import com.ibm.mwdbook.util.AuditInterceptor;



@Singleton
@Path("transactions")
@DeclareRoles({"BANKADMIN"})
@Interceptors ({AuditInterceptor.class})
public class TransactionAdminSearchService {
	
	private static int defaultStart = 0;
	private static int defaultSize = 25;
	
	@EJB
	private TransactionDao transactionDao;
	
	@GET
	@Produces("application/json")
	@RolesAllowed({"BANKADMIN"})
	public Response getTransactions(@QueryParam(value="start")Integer start,@QueryParam(value="size")Integer size) {
		try {
			if(start == null)
			{
				start = defaultStart;
			}
			if(size == null)
			{
				size = defaultSize;
			}
			List<Transaction> trans = transactionDao.getAllTransactions(start, size);
			return Response.status(Response.Status.OK).entity(trans).build();
	       
		} 
		catch (Exception e) {
			   throw new WebApplicationException(e);
		}	
	}
	
	@GET
	@Path("{tid}")
	@Produces("application/json")
	@RolesAllowed({"BANKADMIN"})
	public Response getTransaction(@PathParam(value="tid")String tid) {
		try {
			return Response.status(Response.Status.OK).entity(transactionDao.getTransaction(Integer.parseInt(tid))).build();
		} 
		catch(NotAuthorizedException na)
	    {
		   return Response.status(Status.UNAUTHORIZED).build();
	    }
		catch (Exception e) 
		{
			throw new WebApplicationException(e);
		}	
	}
	
}
