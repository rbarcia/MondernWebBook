package com.ibm.mwdbook.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNotSame;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

import javax.ws.rs.core.MediaType;

import org.apache.derby.tools.ij;
import org.apache.wink.client.ClientConfig;
import org.apache.wink.client.ClientResponse;
import org.apache.wink.client.Resource;
import org.apache.wink.client.RestClient;
import org.apache.wink.client.handlers.BasicAuthSecurityHandler;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;

public class AccountTest {

	
	private String url = "http://localhost:9080/MWDBookRest/jaxrs";
	private String derby = "jdbc:derby://localhost:1527/MyDB;create=true";
	private JSONArray testAccounts;
	private long testId = 2;
	private long testId2 = 5;
	private String testUserId = "rbarcia";
	private JSONObject testUser;
	
	
	@Before
	public void setUp() throws Exception {
		
		//RESET DB with derby tools
		InputStream dbin = this.getClass().getResourceAsStream("/createMWD.sql");
		Properties connectionProps = new Properties();
	    connectionProps.put("user", "APP");
	    connectionProps.put("password", "APP");
		Connection connection = DriverManager.getConnection(derby,connectionProps);
	    ij.runScript(connection,dbin,"UTF-8",System.out,"UTF-8");
	    System.out.println("SQL Script Done");
		
		//READ TEST DATA
		InputStream in = this.getClass().getResourceAsStream("/accounts.json");
		testAccounts = JSONArray.parse(in);
		for(int i = 0; i < testAccounts.size();i++)
		{
			if(((Long)((JSONObject)testAccounts.get(i)).get("id")) == testId)
			{
				testUser = (JSONObject)testAccounts.get(i);
				System.out.println(testUser);
			}
		}
	
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testAccountsAdmin() {
		
		 ClientConfig config = new ClientConfig();
		 BasicAuthSecurityHandler basicAuthHandler = new BasicAuthSecurityHandler();
		 basicAuthHandler.setUserName("admin");
		 basicAuthHandler.setPassword("admin");
		 basicAuthHandler.setSSLRequired(false);
		 config.handlers(basicAuthHandler);
		 RestClient client = new RestClient(config);
		 Resource resource = client.resource(url+"/accounts");
		 JSONArray accounts = resource.accept("application/json").get(JSONArray.class);
		 assertNotNull(accounts);
		 assertEquals(accounts,testAccounts);
		 for(int i = 0; i < accounts.size();i++)
		 {
			 resource = client.resource(url+"/accounts/"+((JSONObject)accounts.get(i)).get("id"));
			 JSONObject account =  resource.accept("application/json").get(JSONObject.class);
			 assertEquals(accounts.get(i), account);
		 }
	}
	
	@Test
	public void testGetAccountsForUser() {
		
		 ClientConfig config = new ClientConfig();
		 BasicAuthSecurityHandler basicAuthHandler = new BasicAuthSecurityHandler();
		 basicAuthHandler.setUserName(testUserId);
		 basicAuthHandler.setPassword("bl0wfish");
		 basicAuthHandler.setSSLRequired(false);
		 config.handlers(basicAuthHandler);
		 RestClient client = new RestClient(config);
		 Resource resource = client.resource(url+"/accounts");
		 JSONArray accounts = resource.accept("application/json").get(JSONArray.class);
		 assertNotNull(accounts);
		 assertEquals(accounts.size(), 2);
		 for(int i = 0; i < accounts.size();i++)
		 {
			 JSONObject jsonObject = (JSONObject)accounts.get(i);
			 assertTrue(((Long)jsonObject.get("id")==testId) || ((Long)jsonObject.get("id")==testId2));
		 }
	}
	
	@Test
	public void testGetAccount() {
		
		 ClientConfig config = new ClientConfig();
		 BasicAuthSecurityHandler basicAuthHandler = new BasicAuthSecurityHandler();
		 basicAuthHandler.setUserName(testUserId);
		 basicAuthHandler.setPassword("bl0wfish");
		 basicAuthHandler.setSSLRequired(false);
		 config.handlers(basicAuthHandler);
		 RestClient client = new RestClient(config);
		 Resource resource = client.resource(url+"/accounts/"+testUser.get("id"));
		 JSONObject account = resource.accept("application/json").get(JSONObject.class);
		 assertNotNull(account);
		 assertEquals(account,testUser);
	}
	

	
	@Test
	public void testCrudAccounts() throws IOException 
	{
		 ClientConfig config = new ClientConfig();
		 BasicAuthSecurityHandler basicAuthHandler = new BasicAuthSecurityHandler();
		 basicAuthHandler.setUserName("admin");
		 basicAuthHandler.setPassword("admin");
		 basicAuthHandler.setSSLRequired(false);
		 config.handlers(basicAuthHandler);
		 
		 
		 RestClient client = new RestClient(config);
		 Resource resource = client.resource(url+"/accounts");
		 
		 //Create New Account
		 JSONObject newUser = JSONObject.parse("{\"name\": \"GANG SAVING\",\"type\": \"Checking\",\"balance\": 100.5,\"currency\":\"USD\"}");
		 ClientResponse clientResponse = resource.contentType(MediaType.APPLICATION_JSON).post(newUser);
		 assertEquals(201,clientResponse.getStatusCode());
		 int newId = Integer.parseInt(clientResponse.getHeaders().get("Location").get(0));
		 assertNotNull(newId);
		 newUser.put("id", newId);
		 
		 //Read the created account
		 resource = client.resource(url+"/accounts/"+newId);
		 JSONObject newAccountCheck = resource.accept("application/json").get(JSONObject.class);
		 assertEquals(newUser.serialize(), newAccountCheck.serialize());
		 
		 //Update the created account
		 newUser.put("balance", 200.5);
		 clientResponse = resource.contentType(MediaType.APPLICATION_JSON).put(newUser);
		 assertEquals(204,clientResponse.getStatusCode());
		 
		 //Read the updated account
		 resource = client.resource(url+"/accounts/"+newId);
		 newAccountCheck = resource.accept("application/json").get(JSONObject.class);
		 assertEquals(newUser.serialize(), newAccountCheck.serialize());
		 
		 //Delete Account
		 resource = client.resource(url+"/accounts/"+newId);
		 clientResponse = resource.delete();
		 assertEquals(204,clientResponse.getStatusCode());
		
		 //Read the deleted account
		 resource = client.resource(url+"/accounts/"+newId);
		 clientResponse = resource.accept("application/json").get();
		 assertEquals(404, clientResponse.getStatusCode());
	}
	
	@Test
	public void testTransactions()
	{
		 ClientConfig config = new ClientConfig();
		 BasicAuthSecurityHandler basicAuthHandler = new BasicAuthSecurityHandler();
		 basicAuthHandler.setUserName(testUserId);
		 basicAuthHandler.setPassword("bl0wfish");
		 basicAuthHandler.setSSLRequired(false);
		 config.handlers(basicAuthHandler);
		 RestClient client = new RestClient(config);
		 Resource resource = client.resource(url+"/accounts/"+testUser.get("id")+"/transactions");
		 JSONArray transactions = resource.accept("application/json").get(JSONArray.class);
		 assertNotNull(transactions);
		 for(int i = 0; i < transactions.size();i++)
		 {
			 resource = client.resource(url+"/accounts/"+testUser.get("id")+"/transactions/"+((JSONObject)transactions.get(i)).get("id"));
			 JSONObject tran =  resource.accept("application/json").get(JSONObject.class);
			 assertEquals(transactions.get(i), tran);
		 }
	}
	
	@Test
	public void createTransaction() throws IOException 
	{
		 
		 //Create Config
		 ClientConfig config = new ClientConfig();
		 BasicAuthSecurityHandler basicAuthHandler = new BasicAuthSecurityHandler();
		 basicAuthHandler.setUserName(testUserId);
		 basicAuthHandler.setPassword("bl0wfish");
		 basicAuthHandler.setSSLRequired(false);
		 config.handlers(basicAuthHandler);
		 RestClient client = new RestClient(config);
		 
		 //Test Client
		 Resource resource = client.resource(url+"/accounts/"+testUser.get("id"));
		 JSONObject account = resource.accept("application/json").get(JSONObject.class);
		 double amount = (Double)account.get("balance");
		 
		 //Create New Transaction
		 resource = client.resource(url+"/accounts/"+testUser.get("id")+"/transactions");
		 JSONObject newTran = JSONObject.parse("{\"memo\": \"WITHDRAWL 20 TO ATM\",\"amount\": 200.0,\"tranType\": \"WITHDRAWL\"}");
		 ClientResponse clientResponse = resource.contentType(MediaType.APPLICATION_JSON).post(newTran);
		 assertEquals(201,clientResponse.getStatusCode());
		 long newId = Integer.parseInt(clientResponse.getHeaders().get("Location").get(0));
		 assertNotNull(newId);
		 
		 //Read Transaction
		 resource = client.resource(url+"/accounts/"+testUser.get("id")+"/transactions/"+newId);
		 JSONObject tran =  resource.accept("application/json").get(JSONObject.class);
		 assertEquals(newId, tran.get("id"));
		 assertEquals(newTran.get("description"), tran.get("description"));
		 assertEquals(newTran.get("tranType"), tran.get("tranType"));
		 assertEquals(newTran.get("amount"), tran.get("amount"));
		 assertNotNull(tran.get("date"));
		 
		 //New amount
		 resource = client.resource(url+"/accounts/"+testUser.get("id"));
		 account = resource.accept("application/json").get(JSONObject.class);
		 double newBalance = (Double)account.get("balance");
		 double balanceCheck = amount - (Double)tran.get("amount");
		 assertEquals(balanceCheck, newBalance,0);
		 
		 //Create Invalid New Transaction - Withdraw more than balance
		 resource = client.resource(url+"/accounts/"+testUser.get("id")+"/transactions");
		 newTran = JSONObject.parse("{\"memo\": \"WITHDRAWL 20 TO ATM\",\"amount\": 2000.0,\"tranType\": \"WITHDRAWL\"}");
		 clientResponse = resource.contentType(MediaType.APPLICATION_JSON).post(newTran);
		 assertEquals(400,clientResponse.getStatusCode());
		 
		 
	}
	
	@Test
	public void testAdminTransactions()
	{
		 
		 //Default Size
		 int defaultSize = 25;
		 ClientConfig config = new ClientConfig();
		 BasicAuthSecurityHandler basicAuthHandler = new BasicAuthSecurityHandler();
		 basicAuthHandler.setUserName("admin");
		 basicAuthHandler.setPassword("admin");
		 basicAuthHandler.setSSLRequired(false);
		 config.handlers(basicAuthHandler);
		 RestClient client = new RestClient(config);
		 Resource resource = client.resource(url+"/transactions");
		 JSONArray transactions = resource.accept("application/json").get(JSONArray.class);
		 assertNotNull(transactions);
		 assertEquals(defaultSize,transactions.size());
		 for(int i = 0; i < transactions.size();i++)
		 {
			 resource = client.resource(url+"/transactions/"+((JSONObject)transactions.get(i)).get("id"));
			 JSONObject tran =  resource.accept("application/json").get(JSONObject.class);
			 assertEquals(transactions.get(i), tran);
		 }
		 
		 //Smaller Size
		 int size = 10;
		 resource = client.resource(url+"/transactions?size="+size);
		 transactions = resource.accept("application/json").get(JSONArray.class);
		 assertNotNull(transactions);
		 assertEquals(size,transactions.size());
		 
		 long firstId = (Long)((JSONObject)transactions.get(0)).get("id");
		 
		 //Test Paging
		 int start = 10;
		 size = 10;
		 resource = client.resource(url+"/transactions?size="+size+"&start="+start);
		 JSONArray nextTransactions = resource.accept("application/json").get(JSONArray.class);
		 assertNotNull(nextTransactions);
		 assertEquals(size,nextTransactions.size());
		 
		 long nextId = (Long)((JSONObject)nextTransactions.get(0)).get("id");
		 assertNotSame(firstId, nextId);
		 
	}

}
