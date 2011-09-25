/**
*
* Lyrics module.
* Contains functions for getting and manipulating lyric strings.
*/
var rest = require('restler');
var _ = require('underscore');

module.exports = (function() {
	return {	
		isWordAllowed: function(word) { 
			return wordsm.blockedWords[word] === undefined;
		},
		
		getTopWords: function(options, callback) {
			var that = this;
			wordsm.db.getTopWords({song: options.song, artist: options.artist}, function(error, data) {
				if (!error) {
					console.log('Sending data from DB');
					callback(null, data);
				} else {
					that.getLyrics({song: options.song, artist: options.artist}, function(err, data) {
						if(data) {
							callback(null, data.topWords);
							wordsm.db.saveTopWords({song: options.song, artist: options.artist, 
								topWords: data.topWords, lyrics: data.lyrics});	
						} else  {
							callback(wordsm.util.error());
						}			
					});
				}
			});
		},	
		
		getLyrics: function(options, callback) {
			var initializedOn = new Date(),
				apiURL = 'http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist='+
							encodeURI(options.artist)+'&song='+encodeURI(options.song),
				that = this;
			console.log(apiURL);
			rest.get(apiURL, {parser: rest.parsers.xml}).on('complete', function(data) {
				console.log('API call + xml parsing took: ' + (new Date().getTime() - initializedOn.getTime()) + ' ms.');	
				var thelyrics = data.Lyric;
				if (thelyrics !== {} && (_.isString(thelyrics) && thelyrics !== '') ) {
					that.extractWords({lyrics:thelyrics}, callback);
				} else {
					callback(wordsm.util.error());
				}			
			}).on('error', function(data) {
				callback(wordsm.util.error());			
			});		
		},
		
		extractWords: function(options, callback) {
			var wordsArray, wordCounts, topWords;
			var initializedOn = new Date(),
				that = this;
			wordsArray = options.lyrics.split(' ');
			wordCounts = _(wordsArray).chain()
						.map(function(word) {
						//This regex pattern can be improved
							return word.toLowerCase().replace(/,/g, '').replace(/\./g, '')
								.replace(/\'re/g, ' are').replace(/\'ve/g, ' have').replace(/\'m/g, ' am')
								.replace(/\'s/g, ' is').replace(/\?/g, '').replace(/\'ll/g,' will')
								.replace(/\'d/g, ' would').replace(/\(/g, '').replace(/\)/g, '').replace(/n\'t/g,' not')
								.split(' ');	
							//replace(/[,\.\'re\'ve\'m\'s\?\'ll\(\)]/g, '');	
						})
						.flatten()
			 			.select(function(word){
							return that.isWordAllowed(word);
			 			})
  			 			.reduce(function(wordCount, word) {
	  			 			if (wordCount[word] === undefined) {
		  			 			wordCount[word] = {'word': word, 'count': 1};
		  			 		} else {
			  					wordCount[word].count = (wordCount[word].count || 0) + 1;
			  				}
    						return wordCount;
			 			}, {})
			 			.value();	
			 console.log('extractWords took: ' + (new Date().getTime() - initializedOn.getTime()) + ' ms.');
			 that.chooseTopWords({lyrics: options.lyrics, wordCounts: wordCounts}, callback);
		},
		
		chooseTopWords: function(options, callback) {
			var initializedOn = new Date();
				topWords =  _(options.wordCounts).chain()
					 		.toArray()
						 	.sort(wordsm.util.sortByWordCount)
							.reverse()
							.first(15)
							.value();
			console.log('chooseTopWords took: ' + (new Date().getTime() - initializedOn.getTime()) + ' ms.');
			callback(null, {lyrics: options.lyrics, topWords: topWords});		
		}
	};
})();
