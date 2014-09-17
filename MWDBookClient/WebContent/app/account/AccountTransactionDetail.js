define([
	"app/Bijit",
	"dojo/text!./AccountTransactionDetail.html",
	"dojo/i18n!./nls/AccountTransactionDetail",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/when",
	"dojo/on",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-construct"

	], function(Bijit, template, nls, array, declare, when,on,lang,array,dom) {

	var MODULE = "app/account/AccountTransactionDetail";
	
	return declare( [Bijit], {
		
		templateString : template,
		text           : nls,
		tran:null,
		postCreate:function()
		{
			var F = MODULE + ":postCreate:";
			console.log(F, "Starting");
		}
	});
});