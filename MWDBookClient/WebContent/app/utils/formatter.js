define(["dojo/currency",
	
], function(currencyFormatter) {
	
	var MODULE = "app/utils/formatter";
	
	var formatter = {
			formatDate:function(date)
			{
				return new Date(date).toDateString();
			},
			formatAmount:function(amount,currency)
			{
				
				return currencyFormatter.format(amount,{currency:currency});
			}
	}
	return formatter;
});