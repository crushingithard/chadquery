define([
	"../core",
	"../queue",
	"../effects" // Delay is optional because of this dependency
], function( chadQuery ) {

// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/chadquery-delay/
chadQuery.fn.delay = function( time, type ) {
	time = chadQuery.fx ? chadQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};

return chadQuery.fn.delay;
});
