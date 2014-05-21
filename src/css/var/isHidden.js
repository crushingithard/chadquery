define([
	"../../core",
	"../../selector"
	// css is assumed
], function( chadQuery ) {

	return function( elem, el ) {
		// isHidden might be called from chadQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return chadQuery.css( elem, "display" ) === "none" || !chadQuery.contains( elem.ownerDocument, elem );
	};
});
