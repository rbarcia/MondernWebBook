define([
	"app/Bijit",
	"dojo/text!./AccountDetail.html",
	"dojo/i18n!./nls/AccountDetail",
	"app/account/AccountTransactions",
	
	"dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
	"dojo/when",
	"dojox/mobile/ListItem",
	
	"app/context",
	
	//-- Template only modules
	"dojox/mobile/EdgeToEdgeCategory",
	"dojox/mobile/EdgeToEdgeList",
	"dojox/mobile/Button"
], function(Bijit, template, nls,AccountTransactions, array, declare, lang, when, ListItem, context,button) {

	var MODULE = "app/account/AccountDetail";
	
	return declare( [Bijit], {
		
		templateString : template,
		text           : nls,
		account        : null,
		
		//-----------------------------------------------------------------------------------------
		constructor: function() {		
			var F = MODULE + ":constructor:";
			console.log(F, arguments);
		},
	
		//-----------------------------------------------------------------------------------------
		postCreate: function() {		
			var F = MODULE + ":postCreate:";
			console.log(F, "Starting");
			var accountTransactions = new AccountTransactions({accountId:this.account.id,accountDetailHeader:this.accountDetailHeader}).placeAt(this.dapTranList);
		}
	});
});