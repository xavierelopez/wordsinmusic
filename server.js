module.exports = (function() {
	var express = require('express'),
		app = express.createServer();
	return {
		configure: function(options) {		
			//General configuration
			app.configure(function() {
				app.use(express.methodOverride());
				app.use(express.bodyParser());
				app.use(app.router);
			});
			
			//Configuration for development only
			app.configure('development', function() {
				app.use(express.static(options.staticDirectory));
				app.use(express.compiler({ src: options.staticDirectory + '/less/', enable: ['less'] }));
				app.use(express.errorHandler({dumbExceptions: true, showStack: true}));
			});
			
			//Configuration for production only
			app.configure('production', function() {
				var oneYear = 31557600000;
				app.use(express.static(options.staticDirectory, {maxAge: oneYear}));
			});	
		},
		setRoutes: function(options) {			
			app.get('/topWords/:song-:artist', function(req, res) {
				var artist = req.params.artist,
					song   = req.params.song;
				//console.log('Request for '+artist + '/' + song + ' received.');
				wordsm.lyrics.getTopWords({artist: artist, song: song}, function(err, topWords) {
					if (err === null) {
						res.send(JSON.stringify(topWords) + '\n');
					} else {
						//console.log('Got error');
						res.send('{"error":' + err.message + '}\n');					
						return;
					}
				});
			});
			
			app.get('/test-similarity', function(req, res) {
				var array1, array2, word1, word2, word3, word4, options;
				word1 = {'word':'testword1', 'count': 1};
				word2 = {'word':'testword2', 'count': 1};
				word3 = {'word':'testword3', 'count': 1};
				word4 = {'word':'testword4', 'count': 1};
				
				array1 = [word1, word2];
				array2 = [word2, word1];
				options = {'byProperty': 'word', 'usingFrequency': 'count'};
				wordsm.util.findSimilarity(array1, array2, options, function(result) {
					res.send(JSON.stringify(result));			
				});		
			});
		},
		
		start: function(options) {			
			this.configure({staticDirectory: options.staticDirectory});
			this.setRoutes({});
			app.listen(options.portNumber);
			//app.logger.log('Server now listening on port ' + options.portNumber +'.');
			console.log('Server now listening on port ' + options.portNumber +'.');
		}
	};	
})();
	
		