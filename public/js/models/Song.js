define(['util', 'order!vendor/underscore-1.1.7', 'order!vendor/backbone-0.5.3'], function(util) {	
	return Backbone.Model.extend({
			defaults: {
				'name' : '',
				'artist' : '',
				'topWords' : [],
				'isBeingSearched': false
			},
			urlRoot: 'topWords'
	});		
});