define([
	"../core"
], function( chadQuery ) {

// Register as a named AMD module, since chadQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase chadquery is used because AMD module names are
// derived from file names, and chadQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of chadQuery, it will work.

// Note that for maximum portability, libraries that are not chadQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. chadQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "chadquery", [], function() {
		return chadQuery;
	});
}

});
