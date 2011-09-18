
var express = require('express');	
var xml2js = require('xml2js');
var restler = require('restler');
var _ = require('underscore');

//WordsInMusic MODULE STYLE
wm = module.exports = (function() {
	var that = {}, 
		app = express.createServer()
		xmlparser = new xml2js.Parser(),
		blockedWords = ['you', 'about', 'after', 'all', 'also', 'an', 'and', 'another', 'any', 'are', 'as',
						'at', 'be', 'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 
						'came', 'can', 'come', 'could', 'did', 'do', 'does', 'each', 'else', 'for', 'from', 'get',
						'got', 'had', 'has', 'have', 'he', 'her', 'here', 'him', 'himself', 'his', 'how', 'if',
						'in', 'into', 'is', 'it', 'its', 'just', 'like', 'make', 'many', 'me', 'might', 'more',
						'most', 'much', 'must', 'my', 'never', 'no', 'now', 'of', 'on', 'only', 'or', 'other', 'our',
						'out', 'over', 're', 'said', 'same', 'see', 'should', 'since', 'so', 'some', 'still', 
						'such', 'take', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 
						'this', 'those', 'through', 'to', 'too', 'under', 'up', 'use', 'very', 'want', 'was',
						'way', 'we', 'well', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'will',
						'with', 'would', 'you', 'your', 'i', 'a', 'am', 'not'];

	//Public methods
	var init = function(options) {
		configureServer({staticDirectory: options.staticDirectory});
		configureRoutes();
		startServer({portNumber: options.portNumber});
		blockedWords = util.convertArrayToObject(blockedWords);	
	};
	
	var configureServer = function(options) {		
		//General configuration
		app.configure(function() {
			app.use(express.methodOverride());
			app.use(express.bodyParser());
			app.use(express.compiler({ src: options.staticDirectory + '/less', enable: ['less'] }))
			app.use(app.router);
		});
		
		//Configuration for development only
		app.configure('development', function() {
			app.use(express.static(options.staticDirectory));
			app.use(express.errorHandler({dumbExceptions: true, showStack: true}));
		});
		
		//Configuration for production only
		app.configure('production', function() {
			var oneYear = 31557600000;
			app.use(express.static(options.staticDirectory, {maxAge: oneYear}));
		});	
	};
	
	var configureRoutes = function(options) {
		app.get('/test', function(req, res) {
			console.log('Request Received.');
			res.send('hello world');
		});
		app.get('/artist=:artistName/song=:songName', function(req, res) {
			console.log('Request for song + artist received.');
			var artistName = req.params.artistName.replace(/\s/g, '%20');
			var songName = req.params.songName.replace(/\s/g, '%20');
			lyrics.getLyricText({artist: artistName, song: songName}, function(string) {
				res.send(JSON.stringify(lyrics.extractWords(string)));
			});
		});
	};
	
	var startServer = function(options) {
		app.listen(options.portNumber);
		console.log('Server now listening on port ' + options.portNumber +'.');
	};
	
	var images = (function() {
	
		
	})();
	
	var lyrics = (function() {
		var that, words, lyrics;
		that = {};
		words = [];
		lyrics = '';
		
		var getLyricText = function(options, callback) {
			var url = 'http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist='+options.artist+'&song='+options.song;
			console.log(url);
			restler.get(url, {parser: restler.parsers.xml}).on('complete', function(data) {
			if (!_.isString(data.Lyric) ) {
				callback(new Error("Lyrics not found"));
			} else {
				callback({lyrics:data.Lyric});
			}
			});		
			
		};
	
		var filterWords = function(options) {
			
			
			
		};
		
		var findLyric = function(options) {
			//TODO, for now using SearchLyricDirect
		};
	
		var extractWords = function(options) {
			var wordsArray, wordCounts, topWords;
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
			 		
			 console.log(wordCounts);
			 return getTopWords(wordCounts);
		};
		
		var getTopWords = function(wordCounts) {
			return  _(wordCounts).chain()
			 			.toArray()
			 			.sort(util.sortByWordCount)
				 		.reverse()
				 		.first(10)
				 		.value();				
		};
		
		var isAllowed = function(word) { 
			return blockedWords[word] === undefined;
		};
		
		that.getLyricText = getLyricText;
		that.filterWords = filterWords;
		that.findLyric = findLyric;
		that.extractWords = extractWords;
		return that;
	})();
	
	var util = (function() {
		var that = {};
		
		var convertArrayToObject = function(array) {
				newObject = {};
				for (var i = 0; i < array.length; i++) {
					newObject[array[i]] = array[i];
				}
				return newObject;
		};
		
		var sortByWordCount = function(oneWord, anotherWord) {
			if (oneWord.count === anotherWord.count) {
				return 0;
			} else if (oneWord.count < anotherWord.count) {
				return -1;
			} else if (oneWord.count > anotherWord.count) {
				return 1;
			}			
		};
		
		that.convertArrayToObject = convertArrayToObject;
		that.sortByWordCount = sortByWordCount;
		return that;		
	})();
	
	that.init = init;
	that.configureServer = configureServer;
	that.configureRoutes = configureRoutes;
	that.startServer = startServer;
	that.lyrics = lyrics;
	that.images = images;
	that.util = util;
	return that;
})();


