/**
*
* Lyrics module.
* Contains functions for getting and manipulating lyric strings.
*/
var restler = require('restler');
var _ = require('underscore');

module.exports = (function() {
	//Private vars and functions
	function chooseTopWords(wordCounts) {
		var initializedOn = new Date();
		var topWords =  _(wordCounts).chain()
			 	.toArray()
			 	.sort(wordsm.util.sortByWordCount)
				.reverse()
				.first(10)
				.value();
		console.log('chooseTopWords took: ' + (new Date().getTime() - initializedOn.getTime()) + ' ms.');
		return topWords;		
	}
	function isAllowed(word) { 
		return wordsm.blockedWords[word] === undefined;
	}
	
	return {
		getLyricText: function(options, callback) {
			var initializedOn = new Date();
			var apiURL = 'http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist='+options.artist+'&song='+options.song;
			restler.get(apiURL, {parser: restler.parsers.xml}).on('complete', function(data) {
				console.log('API call + xml parsing took: ' + (new Date().getTime() - initializedOn.getTime()) + ' ms.');				
				if (_.isString(data.Lyric) ) {
					callback({lyrics:data.Lyric});
				} 
			});
		},			
		extractWords: function(options) {
			var wordsArray, wordCounts, topWords;
			var initializedOn = new Date();
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
							return isAllowed(word);
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
	 		 //console.log(wordCounts);
			 return chooseTopWords(wordCounts);
		}	
	};
})();
