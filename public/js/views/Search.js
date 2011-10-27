define(['jquery', 'util', 'order!vendor/underscore-1.1.7', 'order!vendor/underscore.string', 'order!vendor/backbone-0.5.3'], function($, util) {	
	return Backbone.View.extend({
		class: 'row',
		events: {
			'click #searchSong':'searchSong'
		},
		initialize: function() {
			var templateHTML = $('#search-template').html();
			this.template = _.template(templateHTML);				
		},		
		render: function() {
			var data = {};
			var renderedContent = this.template(data);
			$(this.el).html(renderedContent);
			return this;		
		},
		searchSong: function() {
			var artist = util.capitalizeWords(_.trim($('input[name="artist"]').val())),
				name = util.capitalizeWords(_.trim($('input[name="song"]').val())),
				noBlanks = !_.isBlank(artist) && !_.isBlank(name),
				model = this.model;
				
			model.set({artist: artist, name: name, id: encodeURI(name) + '-' + encodeURI(artist), topWords: []});	
			if (noBlanks) { 
				model.set({isBeingSearched: true}); 
				model.fetch({
					success: function() {
						model.set({isBeingSearched: false});
					},
					error: function() {
						model.set({isBeingSearched: false});
					}
				}); 
			}
		}
	});
});