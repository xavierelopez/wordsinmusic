module.exports = (function() {
	var express = require('express');
	var app = express.createServer();
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
				app.use(express.errorHandler({dumbExceptions: true, showStack: true}));
			});
			
			//Configuration for production only
			app.configure('production', function() {
				var oneYear = 31557600000;
				app.use(express.static(options.staticDirectory, {maxAge: oneYear}));
			});	
		},
		setRoutes: function(options) {
			app.get('/test', function(req, res) {
				console.log('Request Received.');
				res.send('hello world');
			});
			app.get('/:artistName/:songName', function(req, res) {
				console.log('Request for song + artist received.');
				var artistName = req.params.artistName.replace(/\s/g, '%20');
				var songName = req.params.songName.replace(/\s/g, '%20');
				wordsm.lyrics.getLyricText({artist: artistName, song: songName}, function(string) {
					res.send(JSON.stringify(wordsm.lyrics.extractWords(string)));
				});
			});
		},
		start: function(options) {			
			this.configure({staticDirectory: options.staticDirectory});
			this.setRoutes({});
			app.listen(options.portNumber);
			console.log('Server now listening on port ' + options.portNumber +'.');
		}
	};	
})();
	
		