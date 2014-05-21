define([
	"../core"
], function( chadQuery ) {

// Cross-browser xml parsing
chadQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		tmp = new DOMParser();
		xml = tmp.parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		chadQuery.error( "Invalid XML: " + data );
	}
	return xml;
};

return chadQuery.parseXML;

});
