//-----------------------------------------------------------------------------
// Module: context
//-----------------------------------------------------------------------------
// Facade to obtain requested data.  Encapsulates URLS and access paths from caller
//-----------------------------------------------------------------------------
define("app/config", [
             
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/json",

], function( array, lang, Deferred, json ) {
	
	var MODULE = "app/config";
	
	var config = {
			
		// internal data storage
		_data : {},
		
	    //------------------------------------------------------------------------
	    load : function( /*list*/sources ) {
	    	// summary:
	    	//		Load config sources
	    	var F = MODULE+":load:";
	    	console.log(F,"Loading: ",sources);
	    	var promise = new Deferred();
	    	//-- treat all sources as text and convert to json
	    	var modules = [];
	    	array.forEach( sources, function(s) {
	    		modules.push( "dojo/text!" + s );
	    	});
	    	//-- Using require here instead of 'request' for a couple reasons
	    	//-- First to ensure consistent order of results
	    	//-- Second to enforce that these are REQURIED for the app.
	    	require( modules, function() {
	    		array.forEach( arguments, function( cfg ) {
	    			try {
	    				var obj = json.parse( cfg );
		    			config._merge( config._data, obj );
	    			} catch( err ) {
	    				console.error(F,"Invalid Config:", arguments[i], " :: ", cfg);
	    			}
	    		});
		    	console.log(F,"Finished:",config._data);
	    		promise.resolve( config._data );
	    	});
	    	return promise;
	    },
	    
	    //------------------------------------------------------------------------
	    get : function( /*String*/target, /*Opt:String*/key ) {
	    	// summary:
	    	//		Get top level config target
	    	// target: String
	    	//		Target top level config entry (usually the module name)
	    	// key: String
	    	//		Dot notation of object to set (eg. "a.b.c")
	    	var F = MODULE+":get:";
	    	var t = config._data[target];
	    	if (t) {
		    	return key ? lang.getObject( key, false, t) : t;
	    	} else {
	    		console.warn(F,"Unknown target:",target);
	    		return {};
	    	}
	    },
	    
	    //------------------------------------------------------------------------
	    set : function( /*String*/target, /*String*/key, /*any*/val ) {
	    	// summary:
	    	//		Deep set new value
	    	// target: String
	    	//		Target top level config entry (usually the module name)
	    	// key: String
	    	//		Dot notation of object to set (eg. "a.b.c")
	    	// val: Object
	    	//		Any value to set for target:key location
	    	var F = MODULE+":set:";
	    	var t = config._data[target];
	    	if (!t) {
	    		config._data[target] = {};
	    		t = config._data[target];
	    		lang.setObject( key, val, t );
	    	} else {
	    		console.error(F,"Invalid target:",target);
	    	}
	    },
	    
	    
	    //------------------------------------------------------------------------
	    _merge : function( o1, o2 ) {
	        // summary:
	        //      Merge Object2 into Object1.
	    	// description:
	    	//		Basically a deep "lang.mixin"
	        //      Combines function of dojo/_base/lang::mixin(), but goes deep into objects.
	        // o1: object
	        //      Target object to be merged into
	        // o2: object
	        //      Source object to be merged from
	        // Returns:
	        //      The target object (o1)
			// tags:
			//	public
	    	var F = MODULE+"._merge";
	        o1 = o1 || {};
	        if ( o2 ) {
	            for( var i in o2 ) {
	                if( lang.isFunction( o2[i] ) || lang.isString( o2[i] ) ) {
	                    o1[i] = o2[i];
	                } else if ( o2[i] instanceof Date) {
	                    o1[i] = new Date(o2[i].getTime());   // Date
	                } else if ( lang.isArray(o2[i]) ) {
	                    if ( ! lang.isArray(o1[i] ) ) {
	                        o1[i] = [];
	                    }
	                    for(var j = 0; j < o2[i].length; ++j){
	                    	var k = array.indexOf( o1[i], o2[i][j] );
	                    	if ( k >= 0 ) {
		                        config._merge(o1[i][k], o2[i][j] );
	                    	} else {
	                    		o1[i].push( o2[i][j] );
	                    	}
	                    }
	                } else if ( typeof lang.isObject(o2[i]) === null ) {
	                	o1[i] = null;
	                } else if ( lang.isObject(o2[i]) ) {
	                    o1[i] = config._merge(o1[i], o2[i]);
	                } else {
	                    o1[i] = o2[i];
	                }
	            }
	        }
	        return o1;
	    }
	};
	return config;

});      
