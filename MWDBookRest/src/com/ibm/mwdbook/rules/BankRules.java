package com.ibm.mwdbook.rules;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.ibm.mwdbook.exception.InvalidTranException;
import com.ibm.mwdbook.jpa.Transaction;
import com.ibm.mwdbook.util.BankStatics;

public class BankRules {
	
	private final double accountMinumum = 25;
	
	@PrePersist @PreUpdate
	public void applyBalance(Transaction tran) throws InvalidTranException
	{
		if(tran == null) throw new InvalidTranException();
		if(tran.getAccount() == null) throw new InvalidTranException();
		if(tran.getTranType().equals(BankStatics.WITHDRAWL))
		{
			if(tran.getAccount().getBalance() - tran.getAmount() < accountMinumum)
			{
				throw new InvalidTranException();
			}
			else
			{
				tran.getAccount().setBalance(tran.getAccount().getBalance() - tran.getAmount());
			}
		}
	}

}
