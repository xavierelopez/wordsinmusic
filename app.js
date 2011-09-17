require.paths.unshift(__dirname + '/vendor/node_modules');

require('./lib/wordsinmusic');

wm.init({
	portNumber: 3000,
	staticDirectory: __dirname + '/public'
});






