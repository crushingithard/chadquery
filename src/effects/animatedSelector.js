define([
	"../core",
	"../selector",
	"../effects"
], function( chadQuery ) {

chadQuery.expr.filters.animated = function( elem ) {
	return chadQuery.grep(chadQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};

});
