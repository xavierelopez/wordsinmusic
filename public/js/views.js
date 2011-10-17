//views module
define(['util', 'models', 'templates', 'order!vendor/underscore-1.1.7', 'order!vendor/backbone-0.5.3'], function(util, models, templates) {	
	return {

		HeaderView: Backbone.View.extend({
			class: 'row',
			initialize: function() {
				this.template = _.template(templates.header);				
			},		
			render: function() {
				var data = {};
				var renderedContent = this.template(data);
				$(this.el).html(renderedContent);
				return this;		
			}
		}),
		
		SearchBarView: Backbone.View.extend({
			class: 'row',
			initialize: function() {
				this.template = _.template(templates.search);				
			},		
			render: function() {
				var data = {};
				var renderedContent = this.template(data);
				$(this.el).html(renderedContent);
				return this;		
			}
		}),
		
		SongView: Backbone.View.extend({
			class: 'row',
			initialize: function() {
				_.bindAll(this, 'render');
				this.model.bind('change', this.render);
				this.template = _.template(templates.topWords);			
			},
			render: function() {
				var data = this.model.toJSON();
				var renderedContent = this.template(data);
				$(this.el).html(renderedContent);
				return this;
			} 
		}),
		
		FooterView: Backbone.View.extend({
			tag: 'footer',
			initialize: function() {
				this.template = _.template(templates.footer);				
			},		
			render: function() {
				var data = {};
				var renderedContent = this.template(data);
				$(this.el).html(renderedContent);
				return this;		
			}		
		})
	};
});
