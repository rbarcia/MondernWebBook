//---------------------------------------------------------------------------------
//
// IBM Software Services for WebSphere (ISSW)
//
// Licensed Materials - Property of IBM
// (C) Copyright IBM Corp. 2012  All Rights Reserved
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
//
//-------------------------------------------------------------------------
// Module: app/Bijit
//------------------------------------------------------------------------
define([
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/_Container",
	"dijit/_Contained",

	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/on"
	
], function(WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Container, Contained, declare, lang, on ) {

	// MODULE : String
	//		Module name used in configuration and logging
	var MODULE = "app/Bijit";

	//-- Do not define a global name, just list base class(es), and implementation object.
	return declare( [WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Container, Contained], {
		
		templateString : "<div></div>",

		// text : object
		//		Potentially NLS text map of key/value
		text : null,
		
		//-----------------------------------------------------------------------------------------
		constructor: function() {		
			var F = MODULE + ":constructor:";
			//console.log(F, arguments);
		},
		
		//-----------------------------------------------------------------------------------------
		postCreate: function() {		
			var F = MODULE + ":postCreate: ";
			console.log(F, "started",arguments);
		},
		
		//-----------------------------------------------------------------------------------------
		destroy: function() {		
			var F = MODULE + ":destroy:";
			//console.log(F, arguments);
			this.inherited(arguments);
		},
		startup:function()
		{
			var F = MODULE + ":startup:";
			this.inherited(arguments);
		}
		
	});
});

