define([
	"../core"
], function( chadQuery ) {

// Support: Android 2.3
// Workaround failure to string-cast null input
chadQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};

return chadQuery.parseJSON;

});
