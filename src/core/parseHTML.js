define([
	"../core",
	"./var/rsingleTag",
	"../manipulation" // buildFragment
], function( chadQuery, rsingleTag ) {

// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
chadQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = chadQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		chadQuery( scripts ).remove();
	}

	return chadQuery.merge( [], parsed.childNodes );
};

return chadQuery.parseHTML;

});
