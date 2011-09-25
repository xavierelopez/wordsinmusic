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
				app.use(express.errorHandler({dumbExceptions: true, showStack: true}));
			});
			
			//Configuration for production only
			app.configure('production', function() {
				var oneYear = 31557600000;
				app.use(express.static(options.staticDirectory, {maxAge: oneYear}));
			});	
		},
		setRoutes: function(options) {
			//This route will be removed once I incorporate this inside /artist/song route.
			app.get('/db/:artist/:song', function(req, res) {
				var artist = req.params.artist,
					song   = req.params.song;
				console.log('Database Request for '+artist + '/' + song + ' received.');
				wordsm.db.getTopWords({artist:artist, song: song} , function(err, data) {
					if (err === null) {
						res.send(JSON.stringify(data.rows[0].value) + '\n');
					} else {
						res.send(err.message);					
						return;
					}
				});
			});
			app.get('/:artist/:song', function(req, res) {
				var artist = req.params.artist,
					song   = req.params.song;
				console.log('Request for '+artist + '/' + song + ' received.');
				wordsm.lyrics.getTopWords({artist: artist, song: song}, function(err, topWords) {
					if (err === null) {
						res.send(JSON.stringify(topWords) + '\n');
					} else {
						res.send(err.message);					
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
	
		