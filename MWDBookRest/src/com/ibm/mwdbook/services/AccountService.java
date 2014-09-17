package com.ibm.mwdbook.services;

import java.util.List;

import javax.annotation.Resource;
import javax.annotation.security.DeclareRoles;
import javax.annotation.security.RolesAllowed;
import javax.ejb.EJB;
import javax.ejb.EJBException;
import javax.ejb.SessionContext;
import javax.ejb.Singleton;
import javax.interceptor.Interceptors;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.ibm.mwdbook.dao.AccountDao;
import com.ibm.mwdbook.dao.TransactionDao;
import com.ibm.mwdbook.exception.InvalidTranException;
import com.ibm.mwdbook.exception.NotAuthorizedException;
import com.ibm.mwdbook.exception.NotFoundException;
import com.ibm.mwdbook.jpa.Account;
import com.ibm.mwdbook.jpa.Transaction;
import com.ibm.mwdbook.util.AuditInterceptor;

@Singleton
@Path("accounts")
@DeclareRoles({"BANKADMIN", "BANKUSER"})
@Interceptors ({AuditInterceptor.class})
public class AccountService {
	
	private static int defaultStart = 0;
	private static int defaultSize = 25;
	
	@EJB
	private AccountDao accountBean;
	
	@EJB
	private TransactionDao transactionDao;
	
	@Resource
	private SessionContext sctx;
	
	@GET
	@Produces("application/json")
	@RolesAllowed({"BANKADMIN","BANKUSER"})
	public Response getAccounts() {
		
		try
		{
			if(sctx.isCallerInRole("BANKADMIN"))
			{
				return Response.status(Response.Status.OK).entity(accountBean.getAllAccounts()).build();
			}
			else
			{
				return Response.status(Response.Status.OK).entity(accountBean.getAccountsForUser()).build();
			}
		} 
		catch (Exception e) {
			throw new WebApplicationException(e);
		}	
	}
	
	
	@GET
	@Path("{id}")
	@Produces("application/json")
	@RolesAllowed({"BANKADMIN","BANKUSER"})
	public Response getAccount(@PathParam(value="id")String id) 
	{
		try
		{
			Account account = accountBean.getAccount(Integer.parseInt(id));
			if(account == null)
			{
				return Response.status(Status.NOT_FOUND).build();
			}
			return Response.status(Response.Status.OK).entity(account).build();
	   }
		catch(NotAuthorizedException na)
	   {
		   return Response.status(Status.UNAUTHORIZED).build();
	   }
		catch (NotFoundException e) 
		{
			 return Response.status(Status.NOT_FOUND).build();
		}
		catch (Exception e) {
			throw new WebApplicationException(e);
		}	
	}
	
	@POST
	@Consumes("application/json")
	@RolesAllowed("BANKADMIN")
	public Response createAccount(Account account)
	{
		int id = accountBean.createAccount(account);
		return Response.status(Status.CREATED).header("Location", id).build();
	}
	
	@PUT
	@Path("{id}")
	@Consumes("application/json")
	@RolesAllowed({"BANKADMIN","BANKUSER"})
	public Response updateAccount(Account account,@PathParam(value="id")String id)
	{
		accountBean.updateAccount(account);
		return Response.status(Status.NO_CONTENT).build();
	}
	
	@DELETE
	@Path("{id}")
	@RolesAllowed({"BANKADMIN"})
	public Response removeAccount(@PathParam(value="id")String id)
	{
		accountBean.removeAccount(Integer.parseInt(id));
		return Response.status(Status.NO_CONTENT).build();
	}
	
	@GET
	@Path("{id}/transactions")
	@Produces("application/json")
	@RolesAllowed({"BANKADMIN","BANKUSER"})
	public Response getTransactions(@PathParam(value="id")String id,@QueryParam(value="start")Integer start,@QueryParam(value="size")Integer size) {
		try {
			if(start == null)
			{
				start = defaultStart;
			}
			if(size == null)
			{
				size = defaultSize;
			}
			Account account = accountBean.getAccount(Integer.parseInt(id));
			if(account == null)
			{
				return Response.status(Status.NOT_FOUND).build();
			}
			List<Transaction> trans = transactionDao.getAllTransactionsForUser(start, size);
			return Response.status(Response.Status.OK).entity(trans).build();
	       
		} 
		catch(NotAuthorizedException na)
		   {
			   return Response.status(Status.UNAUTHORIZED).build();
		   }
		catch (Exception e) {
			   throw new WebApplicationException(e);
		}	
	}
	
	@GET
	@Path("{id}/transactions/{tid}")
	@Produces("application/json")
	@RolesAllowed({"BANKADMIN","BANKUSER"})
	public Response getTransaction(@PathParam(value="id")String id,@PathParam(value="tid")String tid) {
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
	
	@POST
	@Path("{id}/transactions")
	@Consumes("application/json")
	@RolesAllowed({"BANKADMIN","BANKUSER"})
	public Response createTransaction(@PathParam(value="id")String id,Transaction tran)
	{
		try 
		{
			int tranId = transactionDao.createTransaction(tran, Integer.parseInt(id));
			return Response.status(Status.CREATED).header("Location", tranId).build();
		} 
		catch (NumberFormatException e) 
		{
			 return Response.status(Status.BAD_REQUEST).build();
		} 
		catch (InvalidTranException e) 
		{
			 return Response.status(Status.BAD_REQUEST).build();
		} 
		catch (NotAuthorizedException e) 
		{
			 return Response.status(Status.UNAUTHORIZED).build();
		}
		catch (NotFoundException e) 
		{
			 return Response.status(Status.NOT_FOUND).build();
		}
		catch (EJBException e)
		{
			return Response.status(Status.BAD_REQUEST).build();
		}
		
	}
}
