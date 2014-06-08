
var mocha = require("mocha");
var should = require("should");

var options = {host:'127.0.0.1', user:'root', pass:''}

var concept = require("../")(options);

describe("It should connect", function(){

	it("should have a few functions", function(done){
		concept.usedForForward.should.be.Function;
		concept.usedForReverse.should.be.Function;
		concept.isAForward.should.be.Function;
		concept.isAReverse.should.be.Function;
		
		concept.assertionLookupForward.should.be.Function;
		concept.putConcept.should.be.Function;
		concept.assersionTest.should.be.Function;
		concept.resolveFact.should.be.Function;

		concept.relatedConcepts.should.be.Function;
		concept.constructSurface.should.be.Function;
		done()
	});

	it.only("should pull out concepts from string", function(done){
		concept.conceptLookup("Who is the current president?", function(err, reply){
			reply.length.should.eql(2);
			done();
		});
	});
});