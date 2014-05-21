define([
	"../core",
	"../var/strundefined"
], function( chadQuery, strundefined ) {

var
	// Map over chadQuery in case of overwrite
	_chadQuery = window.chadQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

chadQuery.noConflict = function( deep ) {
	if ( window.$ === chadQuery ) {
		window.$ = _$;
	}

	if ( deep && window.chadQuery === chadQuery ) {
		window.chadQuery = _chadQuery;
	}

	return chadQuery;
};

// Expose chadQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/chadquery/chadquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.chadQuery = window.$ = chadQuery;
}

});
