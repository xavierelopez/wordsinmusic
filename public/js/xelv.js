//Create my namespace
//Every app will be a property of this global XELV object
window.xelv = (function () {
	var that;
	that = {};
		
	var log = function(message) {
		console.log(message);
	};	
	
	that.log = log;
	return that;
})();
	
