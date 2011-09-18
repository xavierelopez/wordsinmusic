//WordsInMusic MODULE STYLE ANOTHERCHANGE
wordsm = module.exports = (function() {
	var wmutil = require('./util'),
		wmlyrics = require('./lyrics'),
		blockedWords = wmutil.convertArrayToObject(['you', 'about', 'after', 'all', 'also', 
						'an', 'and', 'another', 'any', 'are', 'as','at', 'be', 'because', 
						'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 
						'can', 'come', 'could', 'did', 'do', 'does', 'each', 'else', 'for',
						'from', 'get','got', 'had', 'has', 'have', 'he', 'her', 'here','him',
						'himself', 'his', 'how', 'if', 'in', 'into', 'is', 'it', 'its','just',
						'like', 'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must',
						'my', 'never', 'no', 'now', 'of', 'on', 'only', 'or', 'other', 'our',
						'out', 'over', 're', 'said', 'same', 'see', 'should', 'since', 'so',
						'some', 'still', 'such', 'take', 'than', 'that', 'the', 'their', 'them',
						'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
						'under', 'up', 'use', 'very', 'want', 'was','way', 'we', 'well', 'were',
						'what', 'when', 'where', 'which', 'while', 'who', 'will',
						'with', 'would', 'you', 'your', 'i', 'a', 'am', 'not', 'let']);
	return {
		blockedWords: blockedWords,
		util: wmutil,
		lyrics: wmlyrics	
	};	
})();

