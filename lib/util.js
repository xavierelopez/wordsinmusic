/**
*
* Utility module.
*/

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
		
		error: function(msg) {
			if (msg === '' || msg === undefined) {
				msg = 'Something went wrong. It will be fixed sooner than you think. Please try again later.';
			}
			return new Error(msg);			
		}
	}		
})();