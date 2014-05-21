// Use the right chadQuery source on the test page (and iframes)
(function() {
	/* global loadTests: false */

	var src,
		path = window.location.pathname.split( "test" )[ 0 ],
		QUnit = window.QUnit || parent.QUnit,
		require = window.require || parent.require;

	// iFrames won't load AMD (the iframe tests synchronously expect chadQuery to be there)
	QUnit.config.urlConfig.push({
		id: "amd",
		label: "Load with AMD",
		tooltip: "Load the AMD chadQuery file (and its dependencies)"
	});
	// If QUnit is on window, this is the main window
	// This detection allows AMD tests to be run in an iframe
	if ( QUnit.urlParams.amd && window.QUnit ) {
		require.config({
			baseUrl: path,
			paths: {
				sizzle: "src/sizzle/dist/sizzle"
			}
		});
		src = "src/chadquery";
		// Include tests if specified
		if ( typeof loadTests !== "undefined" ) {
			require( [ src ], loadTests );
		} else {
			require( [ src ] );
		}
		return;
	}

	// Config parameter to use minified chadQuery
	QUnit.config.urlConfig.push({
		id: "dev",
		label: "Load unminified",
		tooltip: "Load the development (unminified) chadQuery file"
	});
	if ( QUnit.urlParams.dev ) {
		src = "dist/chadquery.js";
	} else {
		src = "dist/chadquery.min.js";
	}

	// Load chadQuery
	document.write( "<script id='chadquery-js' src='" + path + src + "'><\x2Fscript>" );

	// Synchronous-only tests
	// Other tests are loaded from the test page
	if ( typeof loadTests !== "undefined" ) {
		document.write( "<script src='" + path + "test/unit/ready.js'><\x2Fscript>");
	}

})();
