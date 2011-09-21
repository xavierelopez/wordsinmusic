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
			app.get('/test', function(req, res) {
				console.log('Request Received.');
				res.send('hello world');
			});
			app.get('/:artistName/:songName', function(req, res) {
				console.log('Request for song + artist received.');
				var artistName = req.params.artistName.replace(/\s/g, '%20');
				var songName = req.params.songName.replace(/\s/g, '%20');
				wordsm.lyrics.getTopWords({artist: artistName, song: songName}, function(err, topWords) {
					if (!err) {
						res.send(JSON.stringify(topWords));
					}			
				});
				console.log('Proof that process is not being blocked');
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
	
		