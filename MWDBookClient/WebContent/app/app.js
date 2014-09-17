
define([
        
    "dojo/_base/connect",
	"dojo/_base/lang",
    "dojo/when",

    "app/config",
    "app/context",
    "app/ApplicationController",
    
    //-- Modules not directly referenced in local context
    "dojo/domReady!"
	
], function(connect, lang, when, config, context, ApplicationController ) {
	
	var MODULE = "app/app";
	
	var app = {

	    version        : "1.0.0",
	    clientId       : "",
	    
	    //------------------------------------------------------------------------
	    init : function( args ) {
	        var F = MODULE+":init:";
	        console.info(F, ">>>>>  MWD: Modern Web Development: starting up  <<<<<");
	        args = args || {};
	        lang.mixin( app, args );
	        
	        // Load up config
	        var cfgs = [];

	        //-- Only single use case, but could layer on as many cfgs as we want
	        //-- Ex. Per user or group settings can be added here.
	        switch( app.mode ) {
		        case "localserver" : cfgs.push( "app/config.json" ); break;
		        case "test" : cfgs.push( "app/configTest.json" ); break;
		        default : cfgs.push( "app/configTest.json" );
	        }
	        
	        config.load( cfgs ).then( function() {
	        	var ac = new ApplicationController();
		        ac.placeAt("main");
		        
	        });
	    },

	    //------------------------------------------------------------------------
	    someFunc : function(){
	        console.log("Not implemented");
	    }
	};
	
	return app;

});      
