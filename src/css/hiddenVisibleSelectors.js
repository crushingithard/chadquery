define([
	"../core",
	"../selector"
], function( chadQuery ) {

chadQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
};
chadQuery.expr.filters.visible = function( elem ) {
	return !chadQuery.expr.filters.hidden( elem );
};

});
