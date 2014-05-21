module("event");

(function(){
	var notYetReady, noEarlyExecution,
		order = [],
		args = {};

	notYetReady = !chadQuery.isReady;

	test("chadQuery.isReady", function() {
		expect(2);

		equal(notYetReady, true, "chadQuery.isReady should not be true before DOM ready");
		equal(chadQuery.isReady, true, "chadQuery.isReady should be true once DOM is ready");
	});

	// Create an event handler.
	function makeHandler( testId ) {
		// When returned function is executed, push testId onto `order` array
		// to ensure execution order. Also, store event handler arg to ensure
		// the correct arg is being passed into the event handler.
		return function( arg ) {
			order.push(testId);
			args[testId] = arg;
		};
	}

	// Bind to the ready event in every possible way.
	chadQuery(makeHandler("a"));
	chadQuery(document).ready(makeHandler("b"));
	chadQuery(document).on("ready.readytest", makeHandler("c"));

	// Do it twice, just to be sure.
	chadQuery(makeHandler("d"));
	chadQuery(document).ready(makeHandler("e"));
	chadQuery(document).on("ready.readytest", makeHandler("f"));

	noEarlyExecution = order.length === 0;

	// This assumes that QUnit tests are run on DOM ready!
	test("chadQuery ready", function() {
		expect(10);

		ok(noEarlyExecution, "Handlers bound to DOM ready should not execute before DOM ready");

		// Ensure execution order.
		deepEqual(order, ["a", "b", "d", "e", "c", "f"], "Bound DOM ready handlers should execute in on-order, but those bound with chadQuery(document).on( 'ready', fn ) will always execute last");

		// Ensure handler argument is correct.
		equal(args["a"], chadQuery, "Argument passed to fn in chadQuery( fn ) should be chadQuery");
		equal(args["b"], chadQuery, "Argument passed to fn in chadQuery(document).ready( fn ) should be chadQuery");
		ok(args["c"] instanceof chadQuery.Event, "Argument passed to fn in chadQuery(document).on( 'ready', fn ) should be an event object");

		order = [];

		// Now that the ready event has fired, again bind to the ready event
		// in every possible way. These event handlers should execute immediately.
		chadQuery(makeHandler("g"));
		equal(order.pop(), "g", "Event handler should execute immediately");
		equal(args["g"], chadQuery, "Argument passed to fn in chadQuery( fn ) should be chadQuery");

		chadQuery(document).ready(makeHandler("h"));
		equal(order.pop(), "h", "Event handler should execute immediately");
		equal(args["h"], chadQuery, "Argument passed to fn in chadQuery(document).ready( fn ) should be chadQuery");

		chadQuery(document).on("ready.readytest", makeHandler("never"));
		equal(order.length, 0, "Event handler should never execute since DOM ready has already passed");

		// Cleanup.
		chadQuery(document).off("ready.readytest");
	});

})();
