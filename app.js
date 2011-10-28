require.paths.unshift(__dirname + '/vendor/node_modules');
require('./lib/wordsinmusic');
require('./server.js').start({
	portNumber: process.env.PORT || 3000, 
	staticDirectory: __dirname + '/public'
});





