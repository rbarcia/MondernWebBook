package com.ibm.mwdbook.dao;

import java.util.List;

import javax.annotation.Resource;
import javax.annotation.security.DeclareRoles;
import javax.annotation.security.RolesAllowed;
import javax.ejb.SessionContext;
import javax.ejb.Stateless;
import javax.interceptor.Interceptors;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import com.ibm.mwdbook.exception.NotAuthorizedException;
import com.ibm.mwdbook.exception.NotFoundException;
import com.ibm.mwdbook.jpa.Account;
import com.ibm.mwdbook.util.AuditInterceptor;

@Stateless
@DeclareRoles({"BANKADMIN", "BANKUSER"})
@Interceptors ({AuditInterceptor.class})
public class AccountDao 
{
	@PersistenceContext
	private EntityManager em;
	
	@Resource
	private SessionContext sctx;
		
	@RolesAllowed("BANKADMIN")
	public int createAccount(Account account)
	{
		em.persist(account);
		return account.getId();
	}
	
	
	@RolesAllowed("BANKADMIN")
	public void updateAccount(Account account)
	{
		em.merge(account);
	}
	
	@RolesAllowed("BANKADMIN")
	public void removeAccount(int id)
	{
		Account account = em.find(Account.class, id);
		em.remove(account);
	}
	
	@SuppressWarnings("unchecked")
	@RolesAllowed("BANKADMIN")
	public List<Account> getAllAccounts ()
	{
		Query q = em.createNamedQuery("getAllAccounts");
		return q.getResultList();
	}
	
	@SuppressWarnings("unchecked")
	@RolesAllowed("BANKUSER")
	public List<Account> getAccountsForUser()
	{
		String user = sctx.getCallerPrincipal().getName();
		Query q = em.createNamedQuery("getAccountForUser");
		q.setParameter("user", user);
		return q.getResultList();
	}
	
	@RolesAllowed({"BANKADMIN","BANKUSER"})
	public Account getAccount(int id) throws NotAuthorizedException,NotFoundException
	{
		Account account = em.find(Account.class, id);
		if(account == null) throw new NotFoundException(); 
		String user = sctx.getCallerPrincipal().getName();
		if(user.equals(account.getUserId()) || sctx.isCallerInRole("BANKADMIN")) 
			return account;
		else throw new NotAuthorizedException();
		
	}

}
