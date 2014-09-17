define([
	"app/Bijit",
	"dojo/text!./AccountTransactions.html",
	"dojo/i18n!./nls/AccountTransactions",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/when",
	"dojo/on",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-construct",
	"app/utils/formatter",
	"dijit/registry",
	"dojo/sniff",
	"app/context",
	"app/account/AccountTransactionDetail",
	"dojo/store/Memory",
	"dojo/store/Observable",
	"dgrid/OnDemandGrid","dgrid/Selection",
	"dojox/mobile/RoundRectStoreList",
    "dojox/mobile",
    "dojox/mobile/parser"

	], function(Bijit, template, nls, array, declare, when,on,lang,array,dom,formatter,registry,sniff,context,AccountTransactionDetail,MemoryStore,Observable,OnDemandGrid,Selection,RoundRectStoreList) {

	var MODULE = "app/account/AccountTransactions";
	
	return declare( [Bijit], {
		
		templateString : template,
		text           : nls,
		accountId:null,
		store:null,

		
		//-----------------------------------------------------------------------------------------
		constructor: function() {		
			var F = MODULE + ":constructor:";
			console.log(F, arguments);
		},
	
		//-----------------------------------------------------------------------------------------
		postCreate: function() {		
			var F = MODULE + ":postCreate:";
			console.log(F, "Starting");
			on(this.dapBackButton,"click",lang.hitch(this,function()
			{
				$(this.dapDetailSection).css("display","none");
				$(this.dapList).css("display","block");
				$(".accountDetailSection").css("display","block");
			}	
			));
			if(this.accountId)
			{
				this.getTransactions();
			}
		},
		getTransactions:function()
		{
			// Build grid of accounts
			var F = MODULE + ":getTransactions:";
			console.log(F, "Starting");
			when( context.getTransactions(this.accountId), lang.hitch(this, function(trans) {
				console.log(F,"Have transactions:", trans);
				this.store = new Observable(new MemoryStore({data:this.store,idProperty:"id"}));
				this.store.setData(trans);
				this.buildGrid();
				this.buildMobileList();
			}
			));
		},
		buildGrid: function() {
			// summary:
			//		Build grid of accounts
			var F = MODULE + ":buildGrid:";
			console.log(F, "Starting");
			console.log(F, this.store);
	        
			this.grid = new OnDemandGrid({
				store:this.store,
				columns:
				{
					merchant: "Merchant",
					id: "Transaction ID",
					date: {
						label:"Date",
						formatter:lang.hitch(this,function (date)
						{
							return formatter.formatDate(date);
						})
					},
					amount:{
						label:"Amount",
						get:lang.hitch(this,function(object)
						{
							return formatter.formatAmount(object.amount,object.currency);
						})
					},
					
					currency: "Currency",
					tranType:"Type",
					memo:"Memo"
				}
			},this.dapGrid);
			
				this.grid.startup();
				
			console.log(F,"Event Logged");
			
		},
		buildMobileList:function()
		{
			var F = MODULE + ":buildMobileList:";
			console.log(F, "Starting");
			this.dataList = new RoundRectStoreList(
					{
						store:this.store,
						itemMap:{
							date:"rightText",
							merchant:"label"
						}
					}, this.dapList);
			$(".mblListItemRightText",this.dataList.domNode).each(lang.hitch(this,function(i,value)
			{
				value.innerHTML = formatter.formatDate(parseFloat(value.innerHTML));
			}		
			));
			on(this.dataList,"click",lang.hitch(this,function (e)
			{
				console.log(F,"Mobile List Item Clicked",e);
				var id = e.target.getAttribute("id") || e.target.parentNode.getAttribute("id");
				var data = this.store.get(id);
				console.log(F,"Data For List Item",data);
				if(this.tranDetail)
				{
					this.tranDetail.destroy();
				}
				dom.empty(this.dapDetail);
				data.formattedDate = formatter.formatDate(data.date);
				data.formattedAmount = formatter.formatAmount(data.amount,data.currency);
				console.log(F,"Formated Data", data);
				this.tranDetail = new AccountTransactionDetail({tran:data}).placeAt(this.dapDetail);
				$(this.dapDetailSection).css("display","block");
				$(this.dapList).css("display","none");
				
				$(".accountDetailSection").css("display","none");
			}		
			));
			this.dataList.startup();
		}
	});
});