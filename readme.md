# Conceptnet

This projects helps setup Concept 4 Database with MySQL and provides some sugar for getting some data out.
Concept Net provides over 610,000 facts of "common sense knowledge" More information about ConceptNet 4 can be found here: http://csc.media.mit.edu/docs/conceptnet/

ConceptNet 5 information can be found here: http://conceptnet5.media.mit.edu/

It should be noted, this is not the entire DB only the parts I needed, I have included these tables:

		assertion
		concept
		frame
		rawassertion
		relation
		sentence
		surfaceform

ConceptNet is a Web providing nodes and relations between the archs, these are the relations:

		IsA                   | What kind of thing is it?									| 94606
		HasA                  | What does it possess?											| 22782
		PartOf                | What is it part of?												|  4648
		UsedFor               | What do you use it for?   								| 50392 
		AtLocation            | Where would you find it?									| 45138
		CapableOf             | What can it do?														| 39237
		MadeOf                | What is it made of?												|  1509
		CreatedBy             | How do you bring it into existence?  			|   544
		HasSubevent           | What do you do to accomplish it? 					| 25433
		HasFirstSubevent      | What do you do first to accomplish it?    |  4116
		HasLastSubevent       | What do you do last to accomplish it?  		|  2968
		HasPrerequisite       | What do you need to do first? 						| 23379
		MotivatedByGoal       | Why would you do it? 											| 15094
		Causes                | What does it make happen?  								| 18211
		Desires               | What does it want?												|  9055
		CausesDesire          | What does it make you want to do? 				|  4974
		HasProperty           | What properties does it have?							| 82384
		ReceivesAction        | What can you do to it? 										| 10838
		DefinedAs             | How do you define it? 										|  6420
		SymbolOf              | What does it represent?										|   166
		LocatedNear           | What is it typically near? 								|  5024
		ConceptuallyRelatedTo | What is related to it in an unknown way?	| 23010
		InheritsFrom          | (not stored, but used in some applications)

I have also removed the language relation, and the database only supports English.

    npm install conceptnet

    * UnZip and import the SQL Data from the ./data folder

