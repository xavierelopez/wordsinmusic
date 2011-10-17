define(function() {
	return {
		topWords:'<h2>Words Most Used</h2> \
				 <span class="songTitle"><%= name %></span> - <span class="artist"><%=artist%></span> \
			  	 <p>These are the words most used:</p> \
			     <p id="wordsMostUsed"></p> \
			     <ul id="words"> \
				 <% _.each(topWords, function(word) { %> \
				 	<li><%= word.word %> - <%= word.count %></li> \
				 <% }); %>',
	    header:  '<div class="hero-unit"> \
		         <h1>Welcome to Words in Music!</h1> \
        		 <p>Search your favorite songs for the most used words in seconds. Try it in any of the modes below.</p> \
        		 </div> ',
		search: '<div class="hero-unit"> \
	          	 <h2>Search for a Song</h2> \
	          	 <p>Want to know the words most used by your favorite song? Enter the song title here to find out.</p> \
	          	 <p><label> Song Title: </label><input type="search" class="input" name="song"></input></p> \
	          	 <p><label> Artist Name: </label><input type="search" class="input" name="artist"></input></p> \
	          	 <a id = "searchSong" class="btn primary" href="#">Search</a>\
	       		 </div>',
	    footer:  '<p>&copy; Words In Music 2011</p>'
	};
});
	
		