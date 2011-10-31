/**
*
* Utility module.
*/
_ = require('underscore');

module.exports = (function() {
	return {		
		convertArrayToObject: function(array) {
			newObject = {};
			for (var i = 0; i < array.length; i++) {
				newObject[array[i]] = array[i];
			}
			return newObject;
		},	
		
		sortByWordCount: function(oneWord, anotherWord) {
			if (oneWord.count === anotherWord.count) {
				return 0;
			} else if (oneWord.count < anotherWord.count) {
				return -1;
			} else if (oneWord.count > anotherWord.count) {
				return 1;
			}			
		},
		
		findSimilarity: function(array1, array2, options, callback) {
			var property = options.byProperty || 'word', 
				frequency = options.usingFrequency || 'count',
				dimensions, vector1, vector2, freq, result,
				dotproduct = 0, magnitude1, magnitude2;
			
			//Perform union on two arrays:
			//array1 = [{'word':'testword1', 'count': 1}]
			//array1 = [{'word':'testword2', 'count': 1}]
			dimensions = _.union(array1, array2); 

			//Now we have:
			//dimensions = [{'word':'testword1', 'count': 1}, {'word':'testword2', 'count': 1}]
			
			//Let's use that dimensions vector to map the frequency of the vector 
			//if it's in the original array, else set it to 0.
			vector1 = _.map(dimensions, function(object) {
							return _.include(array2, object) ? object[frequency] : 0;
					  });
		    vector2 = _.map(dimensions, function(object) {
							return _.include(array2, object) ? object[frequency] : 0;
					  });
	
			//vector1 = [1, 0]
			//vector2 = [0, 1]
			
			//Calculate dot product
			_.each(_.range(dimensions.length), function(index) {
				dotproduct += vector1[index] * vector2[index];
			});

			//Calculate magnitudes
			magnitude1 = Math.sqrt(_.reduce(vector1, function(memo, num) { return num*num + memo;}, 0));
			magnitude2 = Math.sqrt(_.reduce(vector2, function(memo, num) { return num*num + memo;}, 0));
			
			if (magnitude1 !== 0 && magnitude2 !== 0 && _.isFunction(callback)) {
				//Calculate cosine similarity
				callback(dotproduct/(magnitude1*magnitude2));	
			}				
		},
		
		error: function(msg) {
			if (msg === '' || msg === undefined) {
				msg = 'Something went wrong. It will be fixed sooner than you think. Please try again later.';
			}
			return new Error(msg);			
		}
	}		
})();