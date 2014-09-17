define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/SampleWidget.html"
], function(declare, _WidgetBase, _TemplatedMixin, template) {

	var MODULE = "samples/SampleWidget";
	
	return declare([_WidgetBase, _TemplatedMixin], {

		// templateString : String
		//		a string representing the HTML of the template
		templateString: template,
		
		// cssBase : String
		//		Base CSS class rule name (used in template)
		cssBase : "SomeWidget",
		
		// title : String
		//		Dynamic Title value
		title : "Default Title",
		
		_onTitleClick : function( /*Event*/ evt ) {
			// summary
			//		Handle click of the title section
			console.log(MODULE,":_onTitleClick:", evt);
			alert("Title clicked: " + this.get("titleNode").innerHTML);
		}
		
	});

});