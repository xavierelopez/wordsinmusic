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
				console.log('Request for '+artist + '/' + song + ' received.');
				wordsm.lyrics.getTopWords({artist: artist, song: song}, function(err, topWords) {
					if (err === null) {
						res.send(JSON.stringify(topWords) + '\n');
					} else {
						res.send('{"error":' + err.message + '}\n');					
						return;
					}
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
	
		