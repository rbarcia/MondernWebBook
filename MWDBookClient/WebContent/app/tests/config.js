//-- Run using this URL (adjust for your anv):
//-- http://localhost/idt18/util/doh/runner.html?paths=app,/mwdclient/app&test=app/tests/config
define([
    "doh/runner",
    "dojo/_base/lang",
    "dojo/when",
    "../config",
], function(doh, lang, when, config) {
	
	var MODULE = "app/tests/config";

	var tests = {
 	    "simpleLoad" : function( doh ) {
			var F = MODULE+":simpleLoad:";
			// Test of simple config loading and reading
			console.log(F,"starting");

			var deferred = new doh.Deferred();
			
			var cfgs = ["app/config.json"];
			config.load(cfgs).then( deferred.getTestCallback( function() {
					console.log(F,"running asserts");
					doh.assertTrue( config.get("app/account/AccountList", "international") );
					doh.assertEqual( config.get("app/app", "clientId"), "111" );
					
					doh.assertTrue(  config.get(MODULE, "myTrue1") );
					doh.assertFalse( config.get(MODULE, "myFalse1") );
					doh.assertEqual( config.get(MODULE, "myString1"), "Hello World" );
					doh.assertTrue(  config.get(MODULE, "nested.myTrue2") );
					doh.assertFalse( config.get(MODULE, "nested.myFalse2") );
					doh.assertEqual( config.get(MODULE, "nested.myString2"), "Hello World" );

					doh.assertTrue(true);
					console.log(F,"finished asserts");
			}));
			return deferred;
		},
		
 	    "complexLoad" : function( doh ) {
			var F = MODULE+":complexLoad:";
			// Test of simple config loading and reading
			console.log(F,"starting");

			var deferred = new doh.Deferred();

			var cfgs = ["app/config.json", "app/configTest.json"];
			config.load(cfgs).then( deferred.getTestCallback( function() {
				doh.assertTrue( config.get("app/account/AccountList", "international") );
				doh.assertEqual( config.get("app/app", "clientId"), "111" );
				
				doh.assertTrue(  config.get(MODULE, "myTrue1") );
				doh.assertFalse( config.get(MODULE, "myFalse1") );
				doh.assertEqual( config.get(MODULE, "myString1"), "Hello World" );
				doh.assertTrue(  config.get(MODULE, "nested.myTrue2") );
				doh.assertFalse( config.get(MODULE, "nested.myFalse2") );
				doh.assertEqual( config.get(MODULE, "nested.myString2"), "Hello World" );

				doh.assertEqual( config.get(MODULE    , "myTestEntry" ), "Loaded from configTest.json" );
				doh.assertEqual( config.get(MODULE+"2", "myTestEntry2"), "Loaded from configTest.json" );
			}));
			return deferred;
		},
		
 	    "forceFail" : function( doh ) {
			var F = MODULE+":forceFail:";
			// Test of simple config loading and reading
			console.log(F,"starting");

			var deferred = new doh.Deferred();

			var cfgs = ["app/config.json"];
			config.load(cfgs).then( deferred.getTestCallback( function() {
				doh.assertTrue(  config.get(MODULE, "myFalse1") );
				doh.assertFalse( config.get(MODULE, "myTrue1") );
				doh.assertEqual( config.get(MODULE, "myString1"), "Goodbye Cruel World" );
			}));
			return deferred;
		}
	};
	
	var wrapped = [];
	for(var name in tests){
		wrapped.push({
			name: name,
			runTest: tests[name],
			timeout: 2000 // 2 second timeout.
		});
	}

	doh.register("app/tests/config", wrapped);

});