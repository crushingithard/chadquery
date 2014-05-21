define([
	"../core",
	"../core/init",
	"../deferred"
], function( chadQuery ) {

// The deferred used on DOM ready
var readyList;

chadQuery.fn.ready = function( fn ) {
	// Add the callback
	chadQuery.ready.promise().done( fn );

	return this;
};

chadQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			chadQuery.readyWait++;
		} else {
			chadQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --chadQuery.readyWait : chadQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		chadQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --chadQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ chadQuery ] );

		// Trigger any bound ready events
		if ( chadQuery.fn.triggerHandler ) {
			chadQuery( document ).triggerHandler( "ready" );
			chadQuery( document ).off( "ready" );
		}
	}
});

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed, false );
	window.removeEventListener( "load", completed, false );
	chadQuery.ready();
}

chadQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = chadQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.chadquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( chadQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
chadQuery.ready.promise();

});
