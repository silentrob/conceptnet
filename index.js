// This is the new and improved mysql Version, smaller and MUCH faster
var async 			= require("async");
var Knex 				= require("knex");
var _ 					= require("underscore");
var debug				= require("debug")("ConceptNet");

var stopwords = ["for", "like", "use", "an", "if", "of", "to", "the", "is", "a", "i", "are", "and", "who", "what", "where", "when","how", "would", "which", "or", "do", "my", "bob"];

var basicFind = function() {
	return knex('assertion')
	.join('concept as c1', 'c1.id', '=' ,'assertion.concept1_id', 'left')
	.join('concept as c2', 'c2.id', '=' ,'assertion.concept2_id', 'left')
	.join('surfaceform as f1', 'f1.id', '=' ,'assertion.best_surface1_id', 'left')
	.join('surfaceform as f2', 'f2.id', '=' ,'assertion.best_surface2_id', 'left')
	.join('frame as frame', 'frame.id', '=' ,'assertion.best_frame_id', 'left')
	.join('rawassertion as raw', 'raw.id', '=' ,'assertion.best_raw_id', 'left')
		.join('sentence', 'sentence.id', '=' ,'raw.sentence_id', 'left')
	.select('c1.text as c1_text', 'c2.text as c2_text', 'c2.num_assertions', 'f1.text as frame1', 'f2.text as frame2', 'sentence.text as sentense', 'frame.text as frame_text' )
	.where('assertion.score', '>', 0)
	.whereNotNull('f1.text')
	.whereNotNull('f2.text')
	.orderBy('c2.num_assertions', 'desc')
	.limit(90).clone();
};

var hasPrerequisite = function() {
	return basicFind().andWhere('assertion.relation_id', 3).clone();
}
var causes = function() {
	return basicFind().andWhere('assertion.relation_id', 18).clone();
}
var atLocation = function() {
	return basicFind().andWhere('assertion.relation_id', 6).clone();
}
var hasProperty = function() {
	return basicFind().andWhere('assertion.relation_id', 20).clone();
}
var usedFor = function() {
	return basicFind().andWhere('assertion.relation_id', 7).clone();
}
var isA = function() {
	return basicFind().andWhere('assertion.relation_id', 5).clone();
}

// Generic Fwd / Back
var basicForward = function(term) {
	return basicFind().andWhere('c1.text', term).clone();
}
var basicReverse = function(term) {
	return basicFind().andWhere('c2.text', term).clone();
}


// Relationship Fwd / Back
var hasPrerequisiteForward = function(term, callback) {
	hasPrerequisite().andWhere('c1.text', term).exec(callback);
}
var hasPrerequisiteReverse = function(term, callback) {
	hasPrerequisite().andWhere('c2.text', term).exec(callback);
}

var causesForward = function(term, callback) {
	causes().andWhere('c1.text', term).exec(callback);
}
var causesReverse = function(term, callback) {
	causes().andWhere('c1.text', term).exec(callback);
}

var atLocationForward = function(term, callback) {
	atLocation().andWhere('c1.text', term).exec(callback);
}
var atLocationReverse = function(term, callback) {
	atLocation().andWhere('c2.text', term).exec(callback);
}

var hasPropertyForward = function(term, callback) {
	hasProperty().andWhere('c1.text', term).exec(callback);
}

var hasPropertyReverse = function(term, callback) {
	hasProperty().andWhere('c2.text', term).exec(callback);
}

var usedForForward = function(term, callback) {
	usedFor().andWhere('c1.text', term).exec(callback);
}

var usedForReverse =  function(term, callback) {
	usedFor().andWhere('c2.text', term).exec(callback);
}

var isAForward = function(term, callback) {
	isA().andWhere('c1.text', term).exec(callback);
}

var isAReverse =  function(term, callback) {
	isA().andWhere('c2.text', term).exec(callback);
}


var getAssertion = function(term1, term2, callback) {
	basicForward(term1).andWhere('c2.text', term2).exec(callback);
}

var assertionLookupForward = function(term, callback) {
	basicForward(term).exec(callback);
}

// PUT IN or PUT ON
// What do you use to put X in 
// food => dish
// nail => hammer
// car => garage
var putConcept  = function(term, callback) {
	usedForReverse(term, function(err, concepts){
		var map = {};
		var itor = function(item, cb) {
			var concept = item.c1_text;
			usedForForward(concept, function(err, concepts2) {			
				map[concept] = 0;
				for (var n = 0; n < concepts2.length; n++) {
					if (concepts2[n].c2_text.indexOf(term) !== -1) {
						map[concept] += 1;
					}
				}
				cb(null, map);
			});
		}

		async.map(concepts, itor, function(err, result){
			var set = result[0];
			var keysSorted = Object.keys(set).sort(function(a,b){return set[b]-set[a]});
			// TODO, if the top items are equal maybe pick one randomly
			callback(null, keysSorted[0]);
		});
	});
}

var assersionTest = function(term1, term2, cb ) {
	
	isAForward(term1, function(err, concepts2) {
		var lcount = 0, ecount = 0;
		for (var i = 0; i < concepts2.length; i++) {
			if (concepts2[i].c2_text == term2) {
				ecount++
			}
			if (concepts2[i].c2_text.indexOf(term2) !== -1) {
				lcount++
			}
		}

		cb(null, (lcount / concepts2.length))
	});
}

var resolveFact = function(term1, term2, cb ) {
	isAForward(term1, function(err, concepts2) {
		
		// Remove dups
		var uniq = _.uniq(concepts2.map(function(item){return item.c2_text}));
		
		var map = [];
		var itor = function(concept, callback) {
			assersionTest(concept, term2, function(err, val){
				if (val > 0.01) {
					map.push([concept, val]);
				}
				callback(null)
			});
		}

		async.each(uniq, itor, function() {
			var keysSorted = map.sort(function(a,b){return b[1] - a[1]});
			debug("resolveFact", keysSorted);
			if (keysSorted.length != 0)
				cb(null, keysSorted[0][0]);
			else {
				cb(null, null);
			}
		});
	});
}

var conceptLookup = function(msg, callback) {
	
	var words1 = ngrams(msg, 1);
	var words2 = ngrams(msg, 2);
	var words3 = ngrams(msg, 3);

	words2 = words2.concat(words1);
	words3 = words3.concat(words2);

	words3 = _.map(words3, function(key, item) { return key.join(" "); });
	words3 = _.reject(words3, function(word) { return _.contains(stopwords, word.toLowerCase()) });

	debug("Searching Concepts for", words3);

	var itor = function(item, cb) {
		knex('concept')
			.select('text', 'num_assertions', 'visible')
			.where('num_assertions', '!=', 0)
			.andWhere('text', item )
			.exec(function(err, res){
				cb(err, res);
			});
	}
	
	async.mapSeries(words3, itor, function(err, res){
		var concepts = _.filter(_.flatten(res), Boolean);
		var newWords = _.map(_.filter(concepts, Boolean), function(item){ return item.text});
		newWords = _.reject(newWords, function(word) { return _.contains(stopwords, word) });
		callback(null, concepts)
	});
}

// How are 2 concepts Related
// Returns an array of objects with num_assersions
var relatedConcepts = function(term1, term2, callback) {
	var terms = [];
	isAForward(term1, function(err, res1){
		isAForward(term2, function(err, res2){
			var map1 = [], map2 = [];

			_.each(res1, function(item){
				map1.push({text:item.c2_text, num: item.num_assertions})
			});

			_.each(res2, function(item){
				map2.push({text:item.c2_text, num: item.num_assertions})
			});

			var results = _.uniq(_.intersect(map1, map2));
			callback(null, results)
		});
	});
}

var constructSurface = function(term1, term2, callback) {
	getAssertion(term1, term2, function(err, fullconcept){
		var x = getRandomInt(0, fullconcept.length - 1);
		callback(null, fullconcept[x].sentense);
	});
};

module.exports = function(options) {
	options = options || {}
	knex = Knex.initialize({
	  client: 'mysql',
	  connection: {
	    host     : options.host 		|| "localhost",
	    user     : options.user 		|| "root",
	    password : options.pass 		|| "",
	    database : options.database || "conceptnet"
	  }
	});

	return {

		// Forward, Reverse Relations
		hasPrerequisiteForward: hasPrerequisiteForward, 
		hasPrerequisiteReverse: hasPrerequisiteReverse,
		
		causesForward: causesForward, 
		causesReverse: causesReverse,

		atLocationForward: atLocationForward,
		atLocationReverse: atLocationReverse,

		hasPropertyForward: hasPropertyForward,
		hasPropertyReverse: hasPropertyReverse,

		isAForward: isAForward,
		isAReverse: isAReverse,

		usedForForward: usedForForward,
		usedForReverse: usedForReverse,


		// More complicated things :)
		putConcept: putConcept,

		constructSurface : constructSurface,
		relatedConcepts: relatedConcepts,
		conceptLookup: conceptLookup,
		resolveFact:  resolveFact,
		assersionTest: assersionTest,
		assertionLookupForward: assertionLookupForward
	}
}

// Helper, intersect Objects
_.intersect = function(array) {
  var slice = Array.prototype.slice; // added this line as a utility
  var rest = slice.call(arguments, 1);
  return _.filter(_.uniq(array), function(item) {
    return _.every(rest, function(other) {
      return _.any(other, function(element) { return _.isEqual(element, item); });
    });
  });
};

var getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

var ngrams = function(sequence, n) {
  var result = [], words = [], count;
	words = sequence.split(/\W+/);
	words = _.without(words, '', ' ')
  count = _.max([0, words.length - n + 1]);
  for (var i = 0; i < count; i++) {
		result.push(words.slice(i, i + n));
  }
  return result;
};