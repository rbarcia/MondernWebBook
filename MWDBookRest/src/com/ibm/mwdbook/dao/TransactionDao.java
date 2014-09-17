package com.ibm.mwdbook.dao;

import java.util.List;

import javax.annotation.Resource;
import javax.annotation.security.DeclareRoles;
import javax.annotation.security.RolesAllowed;
import javax.ejb.EJB;
import javax.ejb.SessionContext;
import javax.ejb.Stateless;
import javax.interceptor.Interceptors;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import com.ibm.mwdbook.exception.InvalidTranException;
import com.ibm.mwdbook.exception.NotAuthorizedException;
import com.ibm.mwdbook.exception.NotFoundException;
import com.ibm.mwdbook.jpa.Account;
import com.ibm.mwdbook.jpa.Transaction;
import com.ibm.mwdbook.util.AuditInterceptor;

@Stateless
@DeclareRoles({"BANKADMIN"})
@Interceptors ({AuditInterceptor.class})
public class TransactionDao {
	
	@PersistenceContext
	private EntityManager em;
	
	@Resource
	private SessionContext sctx;
	
	@EJB
	private AccountDao accountDao;
		
	@SuppressWarnings("unchecked")
	@RolesAllowed({"BANKADMIN"})
	public List<Transaction> getAllTransactions(int start, int size)
	{
		Query q = em.createNamedQuery("getAllTransaction");
		q.setMaxResults(size);
		q.setFirstResult(start);
		return q.getResultList();
	}
	
	@SuppressWarnings("unchecked")
	@RolesAllowed({"BANKADMIN","BANKUSER"})
	public List<Transaction> getAllTransactionsForUser(int start, int size)
	{
		Query q = em.createNamedQuery("getAllTransactionForUser");
		q.setMaxResults(size);
		q.setFirstResult(start);
		q.setParameter("userId", sctx.getCallerPrincipal().getName());
		return q.getResultList();
	}
	
	@RolesAllowed({"BANKADMIN","BANKUSER"})
	public int createTransaction(Transaction tran,int id) throws InvalidTranException,NotAuthorizedException,NotFoundException
	{
		String user = sctx.getCallerPrincipal().getName();
		Account account = accountDao.getAccount(id);
		tran.setAccount(account);
		if(user.equals(tran.getAccount().getUserId()) || sctx.isCallerInRole("BANKADMIN")) em.persist(tran);
		return tran.getId();
	}
	
	@RolesAllowed({"BANKADMIN","BANKUSER"})
	public Transaction getTransaction(int tranId) throws InvalidTranException, NotAuthorizedException,NotFoundException
	{
		String user = sctx.getCallerPrincipal().getName();
		Transaction tran = em.find(Transaction.class, tranId);
		if(tran == null) throw new NotFoundException();
		if(user.equals(tran.getAccount().getUserId()) || sctx.isCallerInRole("BANKADMIN"))
			return tran;
		else 
			throw new NotAuthorizedException();
	}
	
}
