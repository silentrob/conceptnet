var concept = require("../index")();

concept.constructSurface("hammer", "build", function(err, res){
	// We are going to cheat and just return the sentense.
	// var x = getRandomInt(0,res.length - 1)
	console.log(err, res);
});

// concept.hasPrerequisiteForward("smoke", function(err, res){
// 	console.log("Pre", res);
// });

// concept.causesForward("fight", function(err, res){
// 	console.log("Cause", res);
// });

// // Finds the intersection of two concepts
// concept.relatedConcepts("cat", "mouse", function(err, res){
// 	console.log("Related", res);
// });

// // What is the color of the ocean
// concept.resolveFact("animal", "milk", function(err, res){
// 	console.log("animal + milk", res);
// });

// concept.resolveFact("color", "sky", function(err, res){
// 	console.log("color + sky", res);
// });

// concept.hasPropertyForward("toolbox", function(err, res){
// 	console.log("hasPropertyForward");
// 	console.log(res);
// })

// concept.atLocationForward("hammer", function(err, res){
// 	console.log("atLocationForward");
// 	console.log(res);
// })

// concept.isAForward("toolbox", function(err, res){
// 	console.log("isAForward, toolbox");
// 	console.log(res);
// })

// concept.conceptLookup("What is the capital of spain?", function(err, concepts){
// 	console.log("CL: What is the capital of spain?")
// 	console.log(concepts);
// })

// concept.usedForForward("taxi", function(err, result){
// 	console.log("UF Taxi", result[0].sentense)
// })

// concept.putConcept("car", function(err, res){
// 	console.log("Where would I put a car?");
// 	console.log(err, res)
// })
