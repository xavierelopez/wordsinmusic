/**
*
* Lyrics module.
* Contains functions for getting and manipulating lyric strings.
*/
var restler = require('restler');
var _ = require('underscore');

module.exports = (function() {
	return {	
		isWordAllowed: function(word) { 
			return wordsm.blockedWords[word] === undefined;
		},
		
		getTopWords: function(options, callback) {
			var initializedOn = new Date(),
				apiURL = 'http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist='+options.artist+'&song='+options.song,
				that = this;
			restler.get(apiURL, {parser: restler.parsers.xml}).on('complete', function(data) {
				console.log('API call + xml parsing took: ' + (new Date().getTime() - initializedOn.getTime()) + ' ms.');				
				if (_.isString(data.Lyric) ) {
					that.extractWords({lyrics:data.Lyric}, callback);
				} 
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
			 that.chooseTopWords({wordCounts: wordCounts}, callback);
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
			callback(topWords);		
		}
	};
})();
