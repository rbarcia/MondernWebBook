package com.ibm.mwdbook.jpa;

import java.io.Serializable;
import java.util.ArrayList;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 * Entity implementation class for Entity: Account
 *
 */
@Entity
@NamedQueries({
    @NamedQuery(name="getAllAccounts",query="select a from Account a"),
    @NamedQuery(name="getAccountForUser",
                query="select a from Account a where a.userId = :user"),
}) 
public class Account implements Serializable {

	
	public enum AccountType
	{
		
		Cash,
		Checking,
		Saving,
		Credit;
		
	}
	
	@Id 
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	@Column(name="USERNAME")
	private String userId;
	
	@Column(name="TYPE_ID") 
	@Enumerated(EnumType.ORDINAL)
	
	private AccountType typeId;
	private String description;
	private String currency;
	private double balance;
	private static final long serialVersionUID = 1L;
	
	@OneToMany(mappedBy="account",fetch=FetchType.LAZY)
	private ArrayList<Transaction> transactions;

	public Account() {
		super();
	}   
	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	@XmlTransient
	public String getUserId() {
		return this.userId;
	}

	@XmlTransient
	public void setUserId(String userId) {
		this.userId = userId;
	}   
	
	@XmlElement(name = "type")
	public AccountType getTypeId() {
		return this.typeId;
	}
	
	@XmlElement(name = "type")
	public void setTypeId(AccountType typeId) {
		this.typeId = typeId;
	}   
	
	@XmlElement(name = "name")
	public String getDescription() {
		return this.description;
	}

	@XmlElement(name = "name")
	public void setDescription(String description) {
		this.description = description;
	}   
	
	
	public double getBalance() {
		return this.balance;
	}

	public void setBalance(double balance) {
		this.balance = balance;
	}
	public ArrayList<Transaction> getTransactions() {
		return transactions;
	}
	public void setTransactions(ArrayList<Transaction> transactions) {
		this.transactions = transactions;
	}
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
   
}
