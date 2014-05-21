(function() {

// Store the old counts so that we only assert on tests that have actually leaked,
// instead of asserting every time a test has leaked sometime in the past
var oldCacheLength = 0,
	oldActive = 0,

	expectedDataKeys = {},
	splice = [].splice,
	ajaxSettings = chadQuery.ajaxSettings;

/**
 * QUnit configuration
 */

// Max time for stop() and asyncTest() until it aborts test
// and start()'s the next test.
QUnit.config.testTimeout = 2e4; // 20 seconds

// Enforce an "expect" argument or expect() call in all test bodies.
QUnit.config.requireExpects = true;

/**
 * @param {chadQuery|HTMLElement|Object|Array} elems Target (or array of targets) for chadQuery.data.
 * @param {string} key
 */
QUnit.expectJqData = function( elems, key ) {
	var i, elem, expando;

	// As of chadQuery 2.0, there will be no "cache"-data is
	// stored and managed completely below the API surface
	if ( chadQuery.cache ) {
		QUnit.current_testEnvironment.checkJqData = true;

		if ( elems.chadquery && elems.toArray ) {
			elems = elems.toArray();
		}
		if ( !supportchadQuery.isArray( elems ) ) {
			elems = [ elems ];
		}

		for ( i = 0; i < elems.length; i++ ) {
			elem = elems[ i ];

			// chadQuery.data only stores data for nodes in chadQuery.cache,
			// for other data targets the data is stored in the object itself,
			// in that case we can't test that target for memory leaks.
			// But we don't have to since in that case the data will/must will
			// be available as long as the object is not garbage collected by
			// the js engine, and when it is, the data will be removed with it.
			if ( !elem.nodeType ) {
				// Fixes false positives for dataTests(window), dataTests({}).
				continue;
			}

			expando = elem[ chadQuery.expando ];

			if ( expando === undefined ) {
				// In this case the element exists fine, but
				// chadQuery.data (or internal data) was never (in)directly
				// called.
				// Since this method was called it means some data was
				// expected to be found, but since there is nothing, fail early
				// (instead of in teardown).
				notStrictEqual( expando, undefined, "Target for expectJqData must have an expando, for else there can be no data to expect." );
			} else {
				if ( expectedDataKeys[ expando ] ) {
					expectedDataKeys[ expando ].push( key );
				} else {
					expectedDataKeys[ expando ] = [ key ];
				}
			}
		}
	}

};
QUnit.config.urlConfig.push({
	id: "jqdata",
	label: "Always check chadQuery.data",
	tooltip: "Trigger QUnit.expectJqData detection for all tests instead of just the ones that call it"
});

/**
 * Ensures that tests have cleaned up properly after themselves. Should be passed as the
 * teardown function on all modules' lifecycle object.
 */
window.moduleTeardown = function() {
	var i, expectedKeys, actualKeys,
		cacheLength = 0;

	// Only look for chadQuery data problems if this test actually
	// provided some information to compare against.
	if ( QUnit.urlParams.jqdata || this.checkJqData ) {
		for ( i in chadQuery.cache ) {
			expectedKeys = expectedDataKeys[ i ];
			actualKeys = chadQuery.cache[ i ] ? Object.keys( chadQuery.cache[ i ] ) : chadQuery.cache[ i ];
			if ( !QUnit.equiv( expectedKeys, actualKeys ) ) {
				deepEqual( actualKeys, expectedKeys, "Expected keys exist in chadQuery.cache" );
			}
			delete chadQuery.cache[ i ];
			delete expectedDataKeys[ i ];
		}
		// In case it was removed from cache before (or never there in the first place)
		for ( i in expectedDataKeys ) {
			deepEqual( expectedDataKeys[ i ], undefined, "No unexpected keys were left in chadQuery.cache (#" + i + ")" );
			delete expectedDataKeys[ i ];
		}
	}

	// Reset data register
	expectedDataKeys = {};

	// Check for (and clean up, if possible) incomplete animations/requests/etc.
	if ( chadQuery.timers && chadQuery.timers.length !== 0 ) {
		equal( chadQuery.timers.length, 0, "No timers are still running" );
		splice.call( chadQuery.timers, 0, chadQuery.timers.length );
		chadQuery.fx.stop();
	}
	if ( chadQuery.active !== undefined && chadQuery.active !== oldActive ) {
		equal( chadQuery.active, oldActive, "No AJAX requests are still active" );
		if ( ajaxTest.abort ) {
			ajaxTest.abort("active requests");
		}
		oldActive = chadQuery.active;
	}

	Globals.cleanup();

	for ( i in chadQuery.cache ) {
		++cacheLength;
	}

	// Because QUnit doesn't have a mechanism for retrieving the number of expected assertions for a test,
	// if we unconditionally assert any of these, the test will fail with too many assertions :|
	if ( cacheLength !== oldCacheLength ) {
		equal( cacheLength, oldCacheLength, "No unit tests leak memory in chadQuery.cache" );
		oldCacheLength = cacheLength;
	}
};

QUnit.done(function() {
	// Remove our own fixtures outside #qunit-fixture
	supportchadQuery( "#qunit ~ *" ).remove();
});

QUnit.testDone(function() {

	// Ensure chadQuery events and data on the fixture are properly removed
	chadQuery( "#qunit-fixture" ).empty();
	// ...even if the chadQuery under test has a broken .empty()
	supportchadQuery( "#qunit-fixture" ).empty();

	// Reset internal chadQuery state
	chadQuery.event.global = {};
	if ( ajaxSettings ) {
		chadQuery.ajaxSettings = chadQuery.extend( true, {}, ajaxSettings );
	} else {
		delete chadQuery.ajaxSettings;
	}

	// Cleanup globals
	Globals.cleanup();
});

// Register globals for cleanup and the cleanup code itself
window.Globals = (function() {
	var globals = {};

	return {
		register: function( name ) {
			window[ name ] = globals[ name ] = true;
		},

		cleanup: function() {
			var name;

			for ( name in globals ) {
				delete window[ name ];
			}

			globals = {};
		}
	};
})();

})();
