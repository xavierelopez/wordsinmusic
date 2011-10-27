define(['order!vendor/underscore-1.1.7', 'order!vendor/underscore.string'], function() {
	return {
		log: function(message) {
			console.log(message);
		},
		capitalizeWords : function(string) {
			return _(string).chain()
					.words()
					.map(function(word) {
						return _.capitalize(word);
					})
					.value().join(' ');
		}
	};	
});
	
