var nano = require('nano')('http://localhost:5984');

module.exports = (function() {
	return {
		getTopWords: function(songInfo, callback) {
			var songs = nano.use('songs');
			var params = {'key': '"' + songInfo.song + '-' + songInfo.artist + '"'};	
			//var params = {'key': '"Let Down-Radiohead"'};
			songs.view('topWords', 'topWordsBySong', params, function(error, body, headers) {
				if (error) {
					console.log(error);
					callback(new Error('Error accessing database.\n'));
				} else {
					if (body.rows && body.rows.length === 0) { 
						callback(new Error('Song not found in database')); 
					} else {
						callback(null, body);
					}
				}
			});
		}		
	};	
})();