define(['jquery', 'util', 'views/Header', 'views/Search', 'views/SongResults', 'views/Footer', 
'models/Song', 'order!vendor/underscore-1.1.7', 'order!vendor/backbone-0.5.3'], 
function($, util, HeaderView, SearchView, SongResultsView, FooterView, Song) {	
		return Backbone.View.extend({
			el: $("#wordsm"),
			
			initialize: function() {
				var song = new Song();
				this.headerView = new HeaderView();
				this.searchView = new SearchView({model: song});
		      	this.resultView = new SongResultsView({model: song});
		      	this.footerView = new FooterView(); 
		     	this.render(); 		     	
			},
			render: function() {
	      		$(this.el).append(this.headerView.render().el)
	        			  .append(this.searchView.render().el)
	        			  .append(this.resultView.render().el)
	        			  .append(this.footerView.render().el);
	   		}	
		});
});