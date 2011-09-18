require.paths.unshift(__dirname + '/vendor/node_modules');
require('./lib/wordsinmusic');
require('./server.js').start({
	portNumber: 3000, 
	staticDirectory: __dirname + '/public'
});





