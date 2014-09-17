define([
	"app/Bijit",
	"dojo/text!./AccountList.html",
	"dojo/i18n!./nls/AccountList",
	"app/config",
	"app/context",
	"app/account/AccountDetail",
	"dojo/on",
	"dojo/aspect",
	"dojo/_base/array",
	'dojo/_base/connect',
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
	"dojo/when",
	"app/utils/formatter",
	"dijit/registry",
	"dojo/store/Memory",
	"dojo/store/Observable",
	"dgrid/OnDemandGrid","dgrid/Selection",
	"dojox/mobile/RoundRectStoreList",
	"dojox/mobile/_DataListMixin",
    "dojox/mobile",
    "dojox/mobile/parser"
	
], function(Bijit, template, nls, config, context,AccountDetail,on,aspect,
	array, connect, declare, lang, dom, when, formatter,registry,MemoryStore, Observable,OnDemandGrid,Selection,
	RoundRectStoreList,dataMixin
) {

	var MODULE = "app/account/AccountList";
	
	return declare( [Bijit], {
		
		templateString : template,
		text           : nls,

		
		// accountList : List
		//		List of accounts for a given customerId
		accountList    : null,
		
		// instance variable that may be overridden by config!
		international : false,
		
		//Data
		store:null,
		
		grid:null,
		dataList:null,
		
		//-----------------------------------------------------------------------------------------
		constructor: function() {		
			var F = MODULE + ":constructor:";
			console.log(F, arguments);
			//-- Load
			lang.mixin( config.get(MODULE) );
		},
	
		//-----------------------------------------------------------------------------------------
		postCreate: function() {		
			var F = MODULE + ":postCreate:";
			console.log(F, "Starting");
			this.loadAccountList();
			on(this.dapBackButton,"click",lang.hitch(this,function()
			{
				$(this.dapDetailSection).css("display","none");
				$(this.dapList).css("display","block");
				
			}		
			));
			
		},
		loadAccountList:function()
		{
			// summary:
			// Build grid of accounts
			var F = MODULE + ":loadAccountList:";
			console.log(F, "Starting");
			
			//-- "HOW" the account list is obtained is not our concern.
			//-- We dont even want to save the list internally, as it may be cached at context level.
			//-- We just need the data and build display the grid.
			when( context.getAccounts(), lang.hitch(this, function(accts) {
				console.log(F,"Have accounts:", accts);
				console.log(F,this);
				this.store = new Observable(new MemoryStore({data:this.store,idProperty:"id"}));
				this.store.setData(accts);
				this.buildGrid();
				this.buildMobileList();
			}
			));
		},
		//-----------------------------------------------------------------------------------------
		buildGrid: function() {
			// summary:
			//		Build grid of accounts
			var F = MODULE + ":buildGrid:";
			console.log(F, "Starting");
			console.log(F, this.store);
			
			// Create a new constructor by mixing in the components
	        var CustomGrid = declare([ OnDemandGrid, Selection ]);
	        
			this.grid = new CustomGrid({
				store:this.store,
				selectionMode: "single",
				columns:
				{
					name:"Account Name",
					id:"Account Number",
					balance:{
						label:"Account Balance",
						get:function(object)
						{
							return formatter.formatAmount(object.balance,object.currency);
						}
					}	
				}
			},this.dapGrid);
			
				this.grid.startup();
				this.grid.on("dgrid-select", lang.hitch(this,function(event){
					console.log(F,"Account Details", event.rows[0].data);
				    this.accountDetails(event.rows[0].data);
				    $(this.dapDetailSection).css("display","block");
				    $(this.dapList).css("display","none");
				}));
			
			console.log(F,"Event Logged");
			
		},
		buildMobileList:function()
		{
			var F = MODULE + ":buildMobileList:";
			
			this.dataList = new RoundRectStoreList(
			{
				store:this.store,
				itemMap:{
					name:"label",
					balance:"rightText"
				}
			
			}, this.dapList);
			console.log(F,this.dataList);
			$(".mblListItemRightText",this.dataList.domNode).each(lang.hitch(this,function(i,value)
			{
				value.innerHTML = formatter.formatAmount(value.innerHTML,this.store.get($(value).parent()[0].id).currency);
			}		
			));
			
			on(this.dataList,"click",lang.hitch(this,function (e)
			{
				console.log(F,"Mobile List Item Clicked",e);
				var id = e.target.getAttribute("id") || e.target.parentNode.getAttribute("id");
				var data = this.store.get(id);
				console.log(F,"Data For List Item",data);
				this.accountDetails(data);
				console.log(F,"DAP DETAIL NODE",this.dapDetailSection);
				$(this.dapDetailSection).css("display","block");
				$(this.dapList).css("display","none");
				
			}		
			));
			this.dataList.startup();
		},
		accountDetails:function(data)
		{
			var F = MODULE + ":accountDetails:";
			console.log(F,"started",data);
			var nodes = $("[widgetId]",this.dapDetail);
			array.forEach(nodes,function(node)
			{
				var widget = registry.byId(node.id);
				registry.remove(widget);
				if(widget){widget.destroy();}
			});
			dom.empty( this.dapDetail );
			data.formattedBalance = formatter.formatAmount(data.balance,data.currency);
			var accountDetail = new AccountDetail({account:data}).placeAt( this.dapDetail );
		}
	});
});