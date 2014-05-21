define([
	"./core",
	"./traversing"
], function( chadQuery ) {

// The number of elements contained in the matched element set
chadQuery.fn.size = function() {
	return this.length;
};

chadQuery.fn.andSelf = chadQuery.fn.addBack;

});
