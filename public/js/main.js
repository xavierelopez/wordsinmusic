require(["jquery", "models", "views"], function($, models, views) {
    $(function() {
	    
        var song = new models.Song({artist: 'Radiohead', name: 'Creep', id:'Creep-Radiohead', topWords: []});
        song.fetch();
        
        var headerView = new views.HeaderView();
        var searchView = new views.SearchBarView();
        var songView = new views.SongView({model: song});    
        var footerView = new views.FooterView();
        
        $('#wordsm').append(headerView.render().el)
        			.append(searchView.render().el)
        			.append(songView.render().el)
        			.append(footerView.render().el);        
    });
});