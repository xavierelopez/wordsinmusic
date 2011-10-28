var nano = require('nano')('http://wordsm:icom5arqui8@wordsm.iriscouch.com');
module.exports = (function() {
	var songs = nano.use('songs');
	return {
		getTopWords: function(songInfo, callback) {
			var params = {'key': '"' + songInfo.song + '-' + songInfo.artist + '"'};	
			//var params = {'key': '"Let Down-Radiohead"'};
			songs.view('topWords', 'topWordsBySong', params, function(error, body, headers) {
				if (error) {
					console.log(error);
					callback(new Error('Error accessing database.\n'));
				} else if (body.rows){
					if (body.rows.length === 0) { 
						callback(new Error('Song not found in database')); 
					} else {
						callback(null, body.rows[0].value);
					}
				}
			});
		},
		
		saveTopWords: function(songInfo, callback) {
			console.log('Inserting into database...');
			songs.insert({song:songInfo.song, artist:songInfo.artist, 
					topWords: songInfo.topWords, lyrics: songInfo.lyrics}, function(e, b, h) {
				console.log((b.ok)? 'Successfully saved to database.':'Data was not saved to database.');
			});
		}	
	};	
})();