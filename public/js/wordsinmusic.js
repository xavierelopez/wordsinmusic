XELV.WordsInMusic = (function() {
	var that, log;
	that = {};
	log = XELV.log;
	
	//Private Vars

	
	//Public functions
	var createModel = function(spec) {
		switch(spec.modelName) {
			case 'song': {return song(spec.params);}
			case 'word': {return word(spec.params);}
			return null;
		}
	};
	
	//Private Functions
	
	//Backbone Models
	
	//constructor function for creating Backbone Models
	//models START
	var model = function(spec) {		
		return new (Backbone.Model.extend(spec.properties))(spec.params);	
	};
	
	var view = function(spec) {		
		return new (Backbone.View.extend(spec.properties))(spec.params);	
	};
	
	var song = function(params) {
		var spec = spec || {};
		spec.properties = spec.properties || {};
		spec.properties.params = params;
		spec.properties.defaults = {
				title: 'Let Down',
				artist: 'Radiohead',
				words: [{name: 'down', count: '10'}]			
		};
		return model(spec);	
	};
	
	
	var word = function(params) {
		var spec = spec || {};
		spec.properties = spec.properties || {};
		spec.properties.params = params;
		spec.properties.defaults = {
				word: 'down',
				count: 10
		};
		return model(spec);	
	};
	//models END
	
	//Backbone Views
	
	var songView = function(params) {
		var spec = spec || {};
		spec.properties = spec.properties || {};
		spec.properties.template = '#song-template';
        spec.properties.tag = 'li';
        spec.properties.className = 'song';
		return view(spec);
	};
	
	that.createModel = createModel;
	return that;	
})();
