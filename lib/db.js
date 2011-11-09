var nano = require('nano')('http://wordsm:cmnkmn@wordsm.iriscouch.com');
var _ = require('underscore');

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
		
		saveSong: function(songInfo, callback) {
			console.log('Inserting into database...');
			songs.insert({song:songInfo.song, artist:songInfo.artist, 
					topWords: songInfo.topWords, lyrics: songInfo.lyrics}, function(e, b, h) {
				console.log((b.ok)? 'Successfully saved to database.':'Data was not saved to database.');
			});
		},
		
		getAllSongs: function(callback) {
			var songs = [];
			//TODO
			callback(songs);		
			
		},
	
		compareSongs: function(song, otherSong, callback) {
			
			
		},
	
		addNewScore: function(song, score, callback) {
		
	
		},	
		
		saveSimilarSongs: function(song, similarSongs, callback) {
		
	
		},
		
		getRandomSong: function() {
			
		},
		
		//Needs work.
		findSimilarSongs: function(song, number, callback) {
			var similarSongs, that = this, minSimilarity = 0.5;
			
			that.getRandomSong(function(songs) {
				if (_.isArray(songs) && songs.length === 0) { 				
					callback(songs); 
				} else {
					similarSongs = []
					_.each(songs, function(song) {
						that.compareSongs(song, newSong, function(result) {
							if(result.score > wordsm.util.minScore(similarSongs)) {
								wordsm.util.removeMin(similarSongs);
								similarSongs.push(result);
							}
							if(result.score > wordsm.util.minScore(song.similarSongs)) {
								that.addNewScore(song, result, function() {})
							}
						});
					});
				}	
				that.saveSimilarSongs(song, similarSongs)
				callback(result)
			})
		}
	};	
})();