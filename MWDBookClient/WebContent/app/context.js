//-----------------------------------------------------------------------------
// Module: context
//-----------------------------------------------------------------------------
// Facade to obtain requested data.  Encapsulates URLS and access paths from caller
//-----------------------------------------------------------------------------
define([

    "app/config",
    "dojo/request",
    "dojo/string",
    "dojo/sniff"

], function( config, request, string, sniff ) {
	
	var MODULE = "app/context";
	
	var context = {

		//-----------------------------------------------------------------------------------------
		getAccounts: function(  ) {
			var F = MODULE + ":getAccounts:";
			
			var url  = config.get("app/services", "AccountList");
			console.log(F,"URL for Services",url);
			var promise = request(url, {
					handleAs : "json"
				}).then(
					function( resp) {
						console.log(F,"Got response:",resp);
						return resp;
					},
					function( err) {
						console.log(F,"Got error:",err);
						alert("Error accessing account data. Try again later");
						return [];
					}
				);
			return promise;
		},
		
		getTransactions: function(accountId)
		{
			var F = MODULE + ":getTransactions:";
			console.log(F,"Starting");
			var url  = config.get("app/services", "TransactionList");
			var size = 25;
			var webSize = config.get("app/tranSizes","defaultTranSize");
			var mobileSize = config.get("app/tranSizes","defaultTranMobileSize");
			console.log(F,"Sniffing for mobile...");
			if(sniff("ios") || sniff("android"))
			{
			   size = mobileSize;
			}
			else
			{
			   size = webSize;
			}
			console.log(F,"Creating URL",url);
			url = string.substitute( url, {
				accountId : accountId,
				size:size
			});
			
	
	
			console.log(F+" URL: ", url);
			promise = request(url, {
				handleAs : "json"
			}).then(
				function( resp) {
					console.log(F,"Got response:",resp);
					return resp;
				},
				function( err) {
					console.log(F,"Got error:",err);
					alert("Error accessing account data. Try again later");
					return [];
				}
			);
			return promise;
		}
		
		
		
	};
	return context;

});      
