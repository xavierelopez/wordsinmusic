define(['jquery', 'util', 'order!vendor/underscore-1.1.7', 'order!vendor/backbone-0.5.3'], function($, util) {	
	return Backbone.View.extend({
		class: 'row',
		initialize: function() {
			var templateHTML = $('#header-template').html();
			this.template = _.template(templateHTML);				
		},		
		render: function() {
			var data = {};
			var renderedContent = this.template(data);
			$(this.el).html(renderedContent);
			return this;		
		}
	});
});