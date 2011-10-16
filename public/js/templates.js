define({
	topWords:'<h2>Words Most Used</h2> \
		  	 <p>These are the words most used:</p> \
		     <p id="wordsMostUsed"></p> \
		     <ul id="words"> \
			 <% _.each(data.topWords, function(word) { %> \
			 	<li><%= word.word %> - <%= word.count %></li> \
			 <% }); %>',
	search: '<div class="span8 columns offset5"> \
          	 <h2>Search for a Song</h2> \
          	 <p>Want to know the words most used by your favorite song? Enter the song title here to find out.</p> \
          	 <p><input type="search" class="input-xlarge" name="song"></input><a class="btn primary" href="#">Search</a></p> \
       		 </div>',
    navBar:  '<div class="topbar"> \
      		    <div class="fill"> \
        	      <div class="container"> \
                    <h3><a href="#">Words in Music</a></h3> \
                      <ul class="nav"> \
                      <% _.each(data.links, function(link) { %> \
			 			<li><a href="<%= link.url %>"><%= link.title %></li> \
			 		  <% }); %> \                     
			          </ul> \
			      </div> \
			    </div> \
			  </div>'
});
	
		