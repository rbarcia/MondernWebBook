define([
	"app/Bijit",
	"dojo/text!./ApplicationController.html",
	"dojo/i18n!./nls/ApplicationController",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/router",
    "dojo/hash",
    "app/account/AccountList"
], function(Bijit, template, nls, declare, lang, on, router,hash,AccountList) {

	var MODULE = "app/account/ApplicationController";
	
	return declare( [Bijit], {
		
		templateString : template,
		text           : nls,
		clientId       : null,
		accountList    : null,
		
		postCreate: function() {		
			var F = MODULE + ":postCreate:";
			router.register("account", lang.hitch(this,function(event){
				console.log(F,"Account Link Clicked");
				if(!this.accountList)
				{
					this.accountList = new AccountList().placeAt(this.dapMain);
				}
				$(".pagebody",this.accountRoot).css("display","none");
				$(".account",this.accountRoot).css("display","block");
				$(".menuList",this.accountRoot).removeClass("active");
				$(".accountItem",this.accountRoot).addClass("active");
				console.log(F,"Account Displayed");
			}));
			
			router.register("billpay", lang.hitch(this,function(event){
				console.log(F,"Paybill Clicked");
				$(".pagebody",this.accountRoot).css("display","none");
				$(".billpay",this.accountRoot).css("display","block");
				$(".menuList",this.accountRoot).removeClass("active");
				$(".billpayItem",this.accountRoot).addClass("active");
				console.log(F,"Bill Pay Displayed");
			}));
			
			router.register("transfer", lang.hitch(this,function(event){
				console.log(F,"Transfer Clicked");
				$(".pagebody",this.accountRoot).css("display","none");
				$(".transfer",this.accountRoot).css("display","block");
				$(".menuList",this.accountRoot).removeClass("active");
				$(".transferItem",this.accountRoot).addClass("active");
				console.log(F,"Transfer Displayed");
			}));
			
			router.register("contact", lang.hitch(this,function(event){
				console.log(F,"Contact Clicked");
				$(".pagebody",this.accountRoot).css("display","none");
				$(".contactus",this.accountRoot).css("display","block");
				$(".menuList",this.accountRoot).removeClass("active");
				$(".contactItem",this.accountRoot).addClass("active");
				console.log(F,"Contact Displayed");
			}));
			
			router.startup();
			console.log(F,"Finding default hash",hash());
			switch(hash()) 
			{
				case "account":
					console.log(F,"account");
					break;
				case "billpay":
					console.log(F,"billpay");
					break;
				case "transfer":
					console.log(F,"transfer");
					break;
				case "contact":
					console.log(F,"contact");
					break;
				default:
					console.log(F,"No Valid Hash, Defaulting to Account");
					router.go("account");
			}
			console.log(F,"END postCreate",$(".pagebody"));
			
		}
	});
});