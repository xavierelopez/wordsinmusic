/**
*
* Lyrics module.
* Contains functions for getting and manipulating lyric strings.
*/
var rest = require('restler');
var _ = require('underscore');
var $ = require('jquery');

module.exports = (function() {
	return {	
		constructAPIHandler: function(options) {
			var handler = handler || {};
			if(options.site === 'chartlyrics.com') {
				handler.url = 'http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist='+
										encodeURI(options.artist)+'&song='+encodeURI(options.song);
				handler.dataParser = function(res) {
					return res.Lyric || '';				
				};
			}
			if(options.site === 'lyricsmode.com') {
				handler.url = 'http://www.lyricsmode.com/lyrics/' + 
					options.artist.charAt(0).toLowerCase() + '/' + 
					options.artist.toLowerCase() + '/' + options.song + '.html'
				handler.dataParser = function(res, callback) {
					if (_.isFunction(callback)) {
						callback($(res).find('#iframe_lyrics').contents().find('#lyrics').text());
					}				
				};			
			}
			if(options.site === 'lyrdb.com') {
				var artist = options.artist.toLowerCase();
				var song = options.song.toLowerCase();			
				handler.url = 'http://webservices.lyrdb.com/lookup.php?q=' + artist + '|' + song + '&for=match';
				handler.dataParser = function(res, callback) {
					var errorRe = /^error/, idRe = /^\w+/;
					console.log(res);
					if(res === '') { 
						callback('');
					} else {
						var id = res.match(idRe);						
						rest.get('http://webservices.lyrdb.com/getlyr.php?q=' + id).on('complete', function(response) {						
							if(_.isFunction(callback)) {
								if(errorRe.test(response)) { 
									callback(''); 
								} else {
									callback(response);
								}	
							}
						});			
					}
					
				};				
			}
			if(options.site === 'lyrics.com') {
				var artist = decodeURI(options.artist).toLowerCase().replace(/\s+/g, '-');
				var song = decodeURI(options.song).toLowerCase().replace(/\s+/g, '-');
				handler.url = 'http://www.lyrics.com/' + song + '-lyrics-' + artist + '.html';
				handler.dataParser = function(res, callback) {
					callback( $(res).find('#lyric_space').text().replace(/---[\s\S]*/g, '').
			replace(/These lyrics are currently unavailable and we are working with the publisher to get the license for this song/g, ''));
				}
				
			}
			return handler;
		},
	
		removeSymbols: function(string) {
			//This regex pattern can be improved
			return string.replace(/\'cause/g, 'because')
						 .replace(/\'re/g, ' are').replace(/\'ve/g, ' have').replace(/\'m/g, ' am')
						 .replace(/\'s/g, ' is').replace(/\?/g, '').replace(/\'ll/g,' will')
						 .replace(/\'d/g, ' would').replace(/n\'t/g,' not')
						 .replace(/n\'/g, 'ng').replace(/[\.\$\(\)\@\#\%\^\&\*\!\¡\?\¿\:\>\<\;\-\,_\n\t\r]+/g, ' ');
		},
		
		isWordAllowed: function(word) { 
			return _.isUndefined(wordsm.blockedWords[word]) && word.length > 2;
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
							wordsm.db.saveSong({song: options.song, artist: options.artist, 
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
				apiHandler = this.constructAPIHandler({artist:options.artist, song:options.song, site:'lyrdb.com'}),
				that = this, thelyrics;
			
			console.log(apiHandler.url);
			rest.get(apiHandler.url).on('complete', function(response) {
				console.log('API call +  parsing took: ' + (new Date().getTime() - initializedOn.getTime()) + ' ms.');	
				apiHandler.dataParser(response, function(result) {
					thelyrics = result;
					console.log(thelyrics.length);
					if (_.isString(thelyrics) && thelyrics.length !== 0 ) {
						that.extractWords({lyrics:thelyrics}, callback);
					} else {
						callback(wordsm.util.error());
					}		
				});				
			}).on('error', function(data) {
				callback(wordsm.util.error());			
			});		
		},

		extractWords: function(options, callback) {
			var wordsArray, wordCounts, topWords, cleanWord;
			var initializedOn = new Date(),
				that = this;
			wordsArray = options.lyrics.split(' ');
			wordCounts = _(wordsArray).chain()
						.map(function(word) {
							cleanWord = word.toLowerCase();
							cleanWord = that.removeSymbols(cleanWord);
							return cleanWord.split(' ');
						})
						.flatten()
			 			.select(function(word){
							return that.isWordAllowed(word);
			 			})
  			 			.reduce(function(wordCount, word) {
	  			 			if (_.isUndefined(wordCount[word])) {
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
			var initializedOn = new Date(), o = {};
				o['topWords'] = _(options.wordCounts).chain()
					 			.toArray()
						 		.sort(wordsm.util.sortByWordCount)
								.reverse()
								.first(15)
								.value();
			console.log('chooseTopWords took: ' + (new Date().getTime() - initializedOn.getTime()) + ' ms.');
			callback(null, {lyrics: options.lyrics, topWords: o});		
		},
		
		getSimilarSongs: function(options, callback) {
				
			
		},		
		compareSongs: function(options, callback) {
			
		}
	};
})();
