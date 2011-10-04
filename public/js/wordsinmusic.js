xelv.wordsm = (function() {
	var log = XELV.log;
	function model (options) {		
		return new (Backbone.Model.extend(options.properties))(options.params);	
	}
	function view (options) {		
		return new (Backbone.View.extend(options.properties))(options.params);	
	}
	
	//Models
	function song (options) {
		var options = options || {};
		options.properties = options.properties || {};
		options.params = params;
		options.properties.defaults = {
				song: 'Let Down',
				artist: 'Radiohead',
				topWords: [{word: 'down', count: '10'}]			
		};
		return model(options);			
	}
	
	function word (options) {
		var options = options || {};
		options.properties = options.properties || {};
		options.params = params;
		options.properties.defaults = {
				word: 'down',
				count: 10
		};
		return createModel(options);	

	}
	return {
		createModel: function(options) {
			switch(options.modelName) {
				case 'song': {return song(options.params);}
				case 'word': {return word(options.params);}
				return null;
			}
		}
	};
		

	
	
	//models END
	
	//Backbone Views
	
	var songView = function(params) {
		var options = options || {};
		options.properties = options.properties || {};
		options.properties.template = '#song-template';
        options.properties.tag = 'li';
        options.properties.className = 'song';
		return view(options);
	};
	
	that.createModel = createModel;
	return that;	
})();
