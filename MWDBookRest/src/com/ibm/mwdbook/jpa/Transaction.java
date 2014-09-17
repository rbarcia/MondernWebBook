package com.ibm.mwdbook.jpa;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlTransient;

import com.ibm.mwdbook.rules.BankRules;
import com.ibm.mwdbook.util.BankStatics;

/**
 * Entity implementation class for Entity: Transaction
 *
 */
@Entity
@Table(name="TRAN")
@NamedQueries({
    @NamedQuery(name="getAllTransaction",query="select t from Transaction t"),
    @NamedQuery(name="getAllTransactionForUser", query="select t from Transaction t where t.account.userId = :userId"),
}) 
@EntityListeners(BankRules.class)
public class Transaction implements Serializable {

	
	@Id 
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne
	@JoinColumn(name="ACCOUNT_ID",referencedColumnName="ID")
	@NotNull
	@XmlTransient
	private Account account;
	
	@Column(name="TDATE") 
	private Date date = new Date();
	private String description;
	
	@Column(name="TRAN_TYPE")
	@NotNull
	@Pattern(regexp=BankStatics.DEPOSIT+"|"+BankStatics.WITHDRAWL)
	private String tranType;
	
	@NotNull
	private double amount;
	
	private String merchant;
	
	private String currency;
	
	private static final long serialVersionUID = 1L;

	public Transaction() {
		super();
	}   
	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}   
	
	public Date getDate() {
		return this.date;
	}

	public void setDate(Date date) {
		this.date = date;
	}   
	
	@XmlElement(name = "memo")
	public String getDescription() {
		return this.description;
	}

	@XmlElement(name = "memo")
	public void setDescription(String description) {
		this.description = description;
	}  
	
	public double getAmount() {
		return this.amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}
	
	@XmlTransient
	public Account getAccount() {
		return account;
	}
	
	@XmlTransient
	public void setAccount(Account account) {
		this.account = account;
	}
	public String getTranType() {
		return tranType;
	}
	public void setTranType(String tranType) {
		this.tranType = tranType;
	}
	public String getMerchant() {
		return merchant;
	}
	public void setMerchant(String merchant) {
		this.merchant = merchant;
	}
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
   
}
