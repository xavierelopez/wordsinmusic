//models module
define(['util', 'order!vendor/underscore-1.1.7', 'order!vendor/backbone-0.5.3'], function(util) {	
	return {
		'Song': Backbone.Model.extend({
			urlRoot: 'topWords'
		}),
		'SearchBar': Backbone.Model.extend({
			
		})
	};
});

