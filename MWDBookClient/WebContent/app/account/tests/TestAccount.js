define([
	"app/Bijit",
    "dojo/text!./TestAccount.html",

	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/json",
	"dojo/on",
	"dojo/when",
	"app/context",
	
	//-- Template only modules
	
], function(Bijit, template, declare, lang, domConstruct, json, on, when, context) {

	// MODULE : String
	//		MODULEule name used in configuration and logging
	var MODULE = "app/account/tests/TestAccount";

	//-- Do not define a global name, just list base class(es), and implementation object.
	return declare( [Bijit], {
		
		templateString : template,
		
		//-- We should allow test user to manually enter these values. Hard coded for now 
		clientId : "111",
		accountId : "111-001",
		
		//-----------------------------------------------------------------------------------------
		postCreate: function() {		
			var F = MODULE + ":postCreate: ";
			console.log(F, arguments);
			
			//-- Widget loaders
			on( this.dapAccountListBijitBtn          , "click", lang.hitch(this, this.showAccountList));
			on( this.dapAccountDetailBijitBtn        , "click", lang.hitch(this, this.showAccountDetail));
			on( this.dapAccountTransactionsBijitBtn  , "click", lang.hitch(this, this.showAccountTransactions));
			
			//-- Service Calls
			on( this.dapGetAccountListDataBtn        , "click", lang.hitch(this, this.doGetAccountListData));
			on( this.dapGetAccountDetailDataBtn      , "click", lang.hitch(this, this.doGetAccountDetailData));
			on( this.dapGetAccountTransactionsDataBtn, "click", lang.hitch(this, this.doGetAccountTransactionsData));
		},
	
		//-----------------------------------------------------------------------------------------
		clearContainer: function() {
			// summary:
			//		Clean out containers and destroy any widgets
			var F = MODULE + ":clearContainer: ";
			console.log(F, "starting");
			if ( this._currentWidget ) {
				this._currentWidget.destroyRecursive();
			}
			this.dapContainer.innerHTML = "";
		},
			
		//-----------------------------------------------------------------------------------------
		showAccountList: function() {
			// summary:
			//		Show account list bijit
			var F = MODULE + ":showAccountList: ";
			console.log(F, "starting");
			this.clearContainer();
			require(["app/account/AccountList"], lang.hitch(this, function(AccountList) {
				var al = new AccountList({
					clientId: this.clientId
				}).placeAt( this.dapContainer );
			}));
		},
		
		//-----------------------------------------------------------------------------------------
		showAccountDetail: function() {
			// summary:
			//		Show account detail bijit
			var F = MODULE + ":showAccountDetail: ";
			console.log(F, "starting");
			this.clearContainer();
			require(["app/account/AccountDetail"], lang.hitch(this, function(AccountDetail) {
				var ad = new AccountDetail({
					clientId: this.clientId,
					accountId : this.accountId
				}).placeAt( this.dapContainer );
			}));
		},
		
		//-----------------------------------------------------------------------------------------
		showAccountTransactions: function() {
			// summary:
			//		Show account transaction bijit
			var F = MODULE + ":showAccountTransactions: ";
			console.log(F, "starting");
			this.clearContainer();
			require(["app/account/AccountTransactions"], lang.hitch(this, function(AccountTransactions) {
				var at = new AccountTransactions({
					clientId: this.clientId,
					accountId : this.accountId
				}).placeAt( this.dapContainer );
			}));
		},
		
		//-----------------------------------------------------------------------------------------
		doGetAccountListData: function() {
			// summary:
			//		Get account list data
			var F = MODULE + ":doGetAccountListData: ";
			console.log(F, "starting");
			this.clearContainer();
			domConstruct.create("h1",{innerHTML:"Account List Data"}, this.dapContainer);

			when( context.getAccounts( this.clientId ), 
				lang.hitch(this, this._showContent), 
				lang.hitch(this, this._showError  )
			);
		},
		
		//-----------------------------------------------------------------------------------------
		doGetAccountDetailData: function() {
			// summary:
			//		Get account list data
			var F = MODULE + ":doGetAccountListData: ";
			console.log(F, "starting");
			this.clearContainer();
			domConstruct.create("h1",{innerHTML:"Account Detail Data"}, this.dapContainer);
			
			when( context.getAccountDetail( this.clientId, this.accountId ),
				lang.hitch(this, this._showContent), 
				lang.hitch(this, this._showError  )
			);
		},
		
		//-----------------------------------------------------------------------------------------
		doGetAccountTransactionsData: function() {
			// summary:
			//		Get account transaction data
			var F = MODULE + ":doGetAccountTransactionsData: ";
			console.log(F, "starting");
			this.clearContainer();
			domConstruct.create("h1",{innerHTML:"Account Transaction Data"}, this.dapContainer);
			this._showError("Service call not implemented!");
		},
		
		//-----------------------------------------------------------------------------------------
		_showContent: function( data ) {
			// summary:
			//		Show data in container
			var F = MODULE + ":_showContent:";
			console.log(F, "starting:", data);
			try {
				var span = domConstruct.create("span", {"class":"code"}, this.dapContainer);
				span.innerHTML = json.stringify(data, null, "    ");
			} catch( err ) {
				this._showError( err );
			}
		},
		
		//-----------------------------------------------------------------------------------------
		_showError: function( err ) {
			// summary:
			//		Show data in container
			var F = MODULE + ":_showError: ";
			console.error(F, "starting:Error", err);
			var span = domConstruct.create("span", {"class":"error"}, this.dapContainer);
			span.innerHTML = "Error: " + err;
		},
		
		
	});
});

