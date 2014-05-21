module("core", { teardown: moduleTeardown });

test("Unit Testing Environment", function () {
	expect(2);
	ok( hasPHP, "Running in an environment with PHP support. The AJAX tests only run if the environment supports PHP!" );
	ok( !isLocal, "Unit tests are not ran from file:// (especially in Chrome. If you must test from file:// with Chrome, run it with the --allow-file-access-from-files flag!)" );
});

test("Basic requirements", function() {
	expect(7);
	ok( Array.prototype.push, "Array.push()" );
	ok( Function.prototype.apply, "Function.apply()" );
	ok( document.getElementById, "getElementById" );
	ok( document.getElementsByTagName, "getElementsByTagName" );
	ok( RegExp, "RegExp" );
	ok( chadQuery, "chadQuery" );
	ok( $, "$" );
});

test("chadQuery()", function() {

	var elem, i,
		obj = chadQuery("div"),
		code = chadQuery("<code/>"),
		img = chadQuery("<img/>"),
		div = chadQuery("<div/><hr/><code/><b/>"),
		exec = false,
		lng = "",
		expected = 22,
		attrObj = {
			"text": "test",
			"class": "test2",
			"id": "test3"
		};

	// The $(html, props) signature can stealth-call any $.fn method, check for a
	// few here but beware of modular builds where these methods may be excluded.
	if ( chadQuery.fn.click ) {
		expected++;
		attrObj["click"] = function() { ok( exec, "Click executed." ); };
	}
	if ( chadQuery.fn.width ) {
		expected++;
		attrObj["width"] = 10;
	}
	if ( chadQuery.fn.offset ) {
		expected++;
		attrObj["offset"] = { "top": 1, "left": 1 };
	}
	if ( chadQuery.fn.css ) {
		expected += 2;
		attrObj["css"] = { "paddingLeft": 1, "paddingRight": 1 };
	}
	if ( chadQuery.fn.attr ) {
		expected++;
		attrObj.attr = { "desired": "very" };
	}

	expect( expected );

	// Basic constructor's behavior
	equal( chadQuery().length, 0, "chadQuery() === chadQuery([])" );
	equal( chadQuery(undefined).length, 0, "chadQuery(undefined) === chadQuery([])" );
	equal( chadQuery(null).length, 0, "chadQuery(null) === chadQuery([])" );
	equal( chadQuery("").length, 0, "chadQuery('') === chadQuery([])" );
	equal( chadQuery("#").length, 0, "chadQuery('#') === chadQuery([])" );

	equal( chadQuery(obj).selector, "div", "chadQuery(chadQueryObj) == chadQueryObj" );

	// can actually yield more than one, when iframes are included, the window is an array as well
	equal( chadQuery(window).length, 1, "Correct number of elements generated for chadQuery(window)" );

/*
	// disabled since this test was doing nothing. i tried to fix it but i'm not sure
	// what the expected behavior should even be. FF returns "\n" for the text node
	// make sure this is handled
	var crlfContainer = chadQuery('<p>\r\n</p>');
	var x = crlfContainer.contents().get(0).nodeValue;
	equal( x, what???, "Check for \\r and \\n in chadQuery()" );
*/

	/* // Disabled until we add this functionality in
	var pass = true;
	try {
		chadQuery("<div>Testing</div>").appendTo(document.getElementById("iframe").contentDocument.body);
	} catch(e){
		pass = false;
	}
	ok( pass, "chadQuery('&lt;tag&gt;') needs optional document parameter to ease cross-frame DOM wrangling, see #968" );*/

	equal( code.length, 1, "Correct number of elements generated for code" );
	equal( code.parent().length, 0, "Make sure that the generated HTML has no parent." );

	equal( img.length, 1, "Correct number of elements generated for img" );
	equal( img.parent().length, 0, "Make sure that the generated HTML has no parent." );

	equal( div.length, 4, "Correct number of elements generated for div hr code b" );
	equal( div.parent().length, 0, "Make sure that the generated HTML has no parent." );

	equal( chadQuery([1,2,3]).get(1), 2, "Test passing an array to the factory" );

	equal( chadQuery(document.body).get(0), chadQuery("body").get(0), "Test passing an html node to the factory" );

	elem = chadQuery("  <em>hello</em>")[0];
	equal( elem.nodeName.toLowerCase(), "em", "leading space" );

	elem = chadQuery("\n\n<em>world</em>")[0];
	equal( elem.nodeName.toLowerCase(), "em", "leading newlines" );

	elem = chadQuery("<div/>", attrObj );

	if ( chadQuery.fn.width ) {
		equal( elem[0].style.width, "10px", "chadQuery() quick setter width");
	}

	if ( chadQuery.fn.offset ) {
		equal( elem[0].style.top, "1px", "chadQuery() quick setter offset");
	}

	if ( chadQuery.fn.css ) {
		equal( elem[0].style.paddingLeft, "1px", "chadQuery quick setter css");
		equal( elem[0].style.paddingRight, "1px", "chadQuery quick setter css");
	}

	if ( chadQuery.fn.attr ) {
		equal( elem[0].getAttribute("desired"), "very", "chadQuery quick setter attr");
	}

	equal( elem[0].childNodes.length, 1, "chadQuery quick setter text");
	equal( elem[0].firstChild.nodeValue, "test", "chadQuery quick setter text");
	equal( elem[0].className, "test2", "chadQuery() quick setter class");
	equal( elem[0].id, "test3", "chadQuery() quick setter id");

	exec = true;
	elem.trigger("click");

	// manually clean up detached elements
	elem.remove();

	for ( i = 0; i < 3; ++i ) {
		elem = chadQuery("<input type='text' value='TEST' />");
	}
	equal( elem[0].defaultValue, "TEST", "Ensure cached nodes are cloned properly (Bug #6655)" );

	// manually clean up detached elements
	elem.remove();

	for ( i = 0; i < 128; i++ ) {
		lng += "12345678";
	}
});

test("chadQuery(selector, context)", function() {
	expect(3);
	deepEqual( chadQuery("div p", "#qunit-fixture").get(), q("sndp", "en", "sap"), "Basic selector with string as context" );
	deepEqual( chadQuery("div p", q("qunit-fixture")[0]).get(), q("sndp", "en", "sap"), "Basic selector with element as context" );
	deepEqual( chadQuery("div p", chadQuery("#qunit-fixture")).get(), q("sndp", "en", "sap"), "Basic selector with chadQuery object as context" );
});

test( "selector state", function() {
	expect( 18 );

	var test;

	test = chadQuery( undefined );
	equal( test.selector, "", "Empty chadQuery Selector" );
	equal( test.context, undefined, "Empty chadQuery Context" );

	test = chadQuery( document );
	equal( test.selector, "", "Document Selector" );
	equal( test.context, document, "Document Context" );

	test = chadQuery( document.body );
	equal( test.selector, "", "Body Selector" );
	equal( test.context, document.body, "Body Context" );

	test = chadQuery("#qunit-fixture");
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document, "#qunit-fixture Context" );

	test = chadQuery("#notfoundnono");
	equal( test.selector, "#notfoundnono", "#notfoundnono Selector" );
	equal( test.context, document, "#notfoundnono Context" );

	test = chadQuery( "#qunit-fixture", document );
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document, "#qunit-fixture Context" );

	test = chadQuery( "#qunit-fixture", document.body );
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document.body, "#qunit-fixture Context" );

	// Test cloning
	test = chadQuery( test );
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document.body, "#qunit-fixture Context" );

	test = chadQuery( document.body ).find("#qunit-fixture");
	equal( test.selector, "#qunit-fixture", "#qunit-fixture find Selector" );
	equal( test.context, document.body, "#qunit-fixture find Context" );
});

test( "globalEval", function() {
	expect( 3 );
	Globals.register("globalEvalTest");

	chadQuery.globalEval("globalEvalTest = 1;");
	equal( window.globalEvalTest, 1, "Test variable assignments are global" );

	chadQuery.globalEval("var globalEvalTest = 2;");
	equal( window.globalEvalTest, 2, "Test variable declarations are global" );

	chadQuery.globalEval("this.globalEvalTest = 3;");
	equal( window.globalEvalTest, 3, "Test context (this) is the window object" );
});

test( "globalEval with 'use strict'", function() {
	expect( 1 );
	Globals.register("strictEvalTest");

	chadQuery.globalEval("'use strict'; var strictEvalTest = 1;");
	equal( window.strictEvalTest, 1, "Test variable declarations are global (strict mode)" );
});

test("noConflict", function() {
	expect(7);

	var $$ = chadQuery;

	strictEqual( chadQuery, chadQuery.noConflict(), "noConflict returned the chadQuery object" );
	strictEqual( window["chadQuery"], $$, "Make sure chadQuery wasn't touched." );
	strictEqual( window["$"], original$, "Make sure $ was reverted." );

	chadQuery = $ = $$;

	strictEqual( chadQuery.noConflict(true), $$, "noConflict returned the chadQuery object" );
	strictEqual( window["chadQuery"], originalchadQuery, "Make sure chadQuery was reverted." );
	strictEqual( window["$"], original$, "Make sure $ was reverted." );
	ok( $$().pushStack([]), "Make sure that chadQuery still works." );

	window["chadQuery"] = chadQuery = $$;
});

test("trim", function() {
	expect(13);

	var nbsp = String.fromCharCode(160);

	equal( chadQuery.trim("hello  "), "hello", "trailing space" );
	equal( chadQuery.trim("  hello"), "hello", "leading space" );
	equal( chadQuery.trim("  hello   "), "hello", "space on both sides" );
	equal( chadQuery.trim("  " + nbsp + "hello  " + nbsp + " "), "hello", "&nbsp;" );

	equal( chadQuery.trim(), "", "Nothing in." );
	equal( chadQuery.trim( undefined ), "", "Undefined" );
	equal( chadQuery.trim( null ), "", "Null" );
	equal( chadQuery.trim( 5 ), "5", "Number" );
	equal( chadQuery.trim( false ), "false", "Boolean" );

	equal( chadQuery.trim(" "), "", "space should be trimmed" );
	equal( chadQuery.trim("ipad\xA0"), "ipad", "nbsp should be trimmed" );
	equal( chadQuery.trim("\uFEFF"), "", "zwsp should be trimmed" );
	equal( chadQuery.trim("\uFEFF \xA0! | \uFEFF"), "! |", "leading/trailing should be trimmed" );
});

test("type", function() {
	expect( 28 );

	equal( chadQuery.type(null), "null", "null" );
	equal( chadQuery.type(undefined), "undefined", "undefined" );
	equal( chadQuery.type(true), "boolean", "Boolean" );
	equal( chadQuery.type(false), "boolean", "Boolean" );
	equal( chadQuery.type(Boolean(true)), "boolean", "Boolean" );
	equal( chadQuery.type(0), "number", "Number" );
	equal( chadQuery.type(1), "number", "Number" );
	equal( chadQuery.type(Number(1)), "number", "Number" );
	equal( chadQuery.type(""), "string", "String" );
	equal( chadQuery.type("a"), "string", "String" );
	equal( chadQuery.type(String("a")), "string", "String" );
	equal( chadQuery.type({}), "object", "Object" );
	equal( chadQuery.type(/foo/), "regexp", "RegExp" );
	equal( chadQuery.type(new RegExp("asdf")), "regexp", "RegExp" );
	equal( chadQuery.type([1]), "array", "Array" );
	equal( chadQuery.type(new Date()), "date", "Date" );
	equal( chadQuery.type(new Function("return;")), "function", "Function" );
	equal( chadQuery.type(function(){}), "function", "Function" );
	equal( chadQuery.type(new Error()), "error", "Error" );
	equal( chadQuery.type(window), "object", "Window" );
	equal( chadQuery.type(document), "object", "Document" );
	equal( chadQuery.type(document.body), "object", "Element" );
	equal( chadQuery.type(document.createTextNode("foo")), "object", "TextNode" );
	equal( chadQuery.type(document.getElementsByTagName("*")), "object", "NodeList" );

	// Avoid Lint complaints
	var MyString = String,
		MyNumber = Number,
		MyBoolean = Boolean,
		MyObject = Object;
	equal( chadQuery.type(new MyBoolean(true)), "boolean", "Boolean" );
	equal( chadQuery.type(new MyNumber(1)), "number", "Number" );
	equal( chadQuery.type(new MyString("a")), "string", "String" );
	equal( chadQuery.type(new MyObject()), "object", "Object" );
});

asyncTest("isPlainObject", function() {
	expect(15);

	var pass, iframe, doc,
		fn = function() {};

	// The use case that we want to match
	ok( chadQuery.isPlainObject({}), "{}" );

	// Not objects shouldn't be matched
	ok( !chadQuery.isPlainObject(""), "string" );
	ok( !chadQuery.isPlainObject(0) && !chadQuery.isPlainObject(1), "number" );
	ok( !chadQuery.isPlainObject(true) && !chadQuery.isPlainObject(false), "boolean" );
	ok( !chadQuery.isPlainObject(null), "null" );
	ok( !chadQuery.isPlainObject(undefined), "undefined" );

	// Arrays shouldn't be matched
	ok( !chadQuery.isPlainObject([]), "array" );

	// Instantiated objects shouldn't be matched
	ok( !chadQuery.isPlainObject(new Date()), "new Date" );

	// Functions shouldn't be matched
	ok( !chadQuery.isPlainObject(fn), "fn" );

	// Again, instantiated objects shouldn't be matched
	ok( !chadQuery.isPlainObject(new fn()), "new fn (no methods)" );

	// Makes the function a little more realistic
	// (and harder to detect, incidentally)
	fn.prototype["someMethod"] = function(){};

	// Again, instantiated objects shouldn't be matched
	ok( !chadQuery.isPlainObject(new fn()), "new fn" );

	// DOM Element
	ok( !chadQuery.isPlainObject( document.createElement("div") ), "DOM Element" );

	// Window
	ok( !chadQuery.isPlainObject( window ), "window" );

	pass = false;
	try {
		chadQuery.isPlainObject( window.location );
		pass = true;
	} catch ( e ) {}
	ok( pass, "Does not throw exceptions on host objects" );

	// Objects from other windows should be matched
	Globals.register("iframeDone");
	window.iframeDone = function( otherObject, detail ) {
		window.iframeDone = undefined;
		iframe.parentNode.removeChild( iframe );
		ok( chadQuery.isPlainObject(new otherObject()), "new otherObject" + ( detail ? " - " + detail : "" ) );
		start();
	};

	try {
		iframe = chadQuery("#qunit-fixture")[0].appendChild( document.createElement("iframe") );
		doc = iframe.contentDocument || iframe.contentWindow.document;
		doc.open();
		doc.write("<body onload='window.parent.iframeDone(Object);'>");
		doc.close();
	} catch(e) {
		window.iframeDone( Object, "iframes not supported" );
	}
});

test("isFunction", function() {
	expect(19);

	var mystr, myarr, myfunction, fn, obj, nodes, first, input, a;

	// Make sure that false values return false
	ok( !chadQuery.isFunction(), "No Value" );
	ok( !chadQuery.isFunction( null ), "null Value" );
	ok( !chadQuery.isFunction( undefined ), "undefined Value" );
	ok( !chadQuery.isFunction( "" ), "Empty String Value" );
	ok( !chadQuery.isFunction( 0 ), "0 Value" );

	// Check built-ins
	ok( chadQuery.isFunction(String), "String Function("+String+")" );
	ok( chadQuery.isFunction(Array), "Array Function("+Array+")" );
	ok( chadQuery.isFunction(Object), "Object Function("+Object+")" );
	ok( chadQuery.isFunction(Function), "Function Function("+Function+")" );

	// When stringified, this could be misinterpreted
	mystr = "function";
	ok( !chadQuery.isFunction(mystr), "Function String" );

	// When stringified, this could be misinterpreted
	myarr = [ "function" ];
	ok( !chadQuery.isFunction(myarr), "Function Array" );

	// When stringified, this could be misinterpreted
	myfunction = { "function": "test" };
	ok( !chadQuery.isFunction(myfunction), "Function Object" );

	// Make sure normal functions still work
	fn = function(){};
	ok( chadQuery.isFunction(fn), "Normal Function" );

	obj = document.createElement("object");

	// Firefox says this is a function
	ok( !chadQuery.isFunction(obj), "Object Element" );

	// Since 1.3, this isn't supported (#2968)
	//ok( chadQuery.isFunction(obj.getAttribute), "getAttribute Function" );

	nodes = document.body.childNodes;

	// Safari says this is a function
	ok( !chadQuery.isFunction(nodes), "childNodes Property" );

	first = document.body.firstChild;

	// Normal elements are reported ok everywhere
	ok( !chadQuery.isFunction(first), "A normal DOM Element" );

	input = document.createElement("input");
	input.type = "text";
	document.body.appendChild( input );

	// Since 1.3, this isn't supported (#2968)
	//ok( chadQuery.isFunction(input.focus), "A default function property" );

	document.body.removeChild( input );

	a = document.createElement("a");
	a.href = "some-function";
	document.body.appendChild( a );

	// This serializes with the word 'function' in it
	ok( !chadQuery.isFunction(a), "Anchor Element" );

	document.body.removeChild( a );

	// Recursive function calls have lengths and array-like properties
	function callme(callback){
		function fn(response){
			callback(response);
		}

		ok( chadQuery.isFunction(fn), "Recursive Function Call" );

		fn({ some: "data" });
	}

	callme(function(){
		callme(function(){});
	});
});

test( "isNumeric", function() {
	expect( 37 );

	var t = chadQuery.isNumeric,
		Traditionalists = /** @constructor */ function(n) {
			this.value = n;
			this.toString = function(){
				return String(this.value);
			};
		},
		answer = new Traditionalists( "42" ),
		rong = new Traditionalists( "Devo" );

	ok( t("-10"), "Negative integer string");
	ok( t("0"), "Zero string");
	ok( t("5"), "Positive integer string");
	ok( t(-16), "Negative integer number");
	ok( t(0), "Zero integer number");
	ok( t(32), "Positive integer number");
	ok( t("040"), "Octal integer literal string");
	// OctalIntegerLiteral has been deprecated since ES3/1999
	// It doesn't pass lint, so disabling until a solution can be found
	//ok( t(0144), "Octal integer literal");
	ok( t("0xFF"), "Hexadecimal integer literal string");
	ok( t(0xFFF), "Hexadecimal integer literal");
	ok( t("-1.6"), "Negative floating point string");
	ok( t("4.536"), "Positive floating point string");
	ok( t(-2.6), "Negative floating point number");
	ok( t(3.1415), "Positive floating point number");
	ok( t(8e5), "Exponential notation");
	ok( t("123e-2"), "Exponential notation string");
	ok( t(answer), "Custom .toString returning number");
	equal( t(""), false, "Empty string");
	equal( t("        "), false, "Whitespace characters string");
	equal( t("\t\t"), false, "Tab characters string");
	equal( t("abcdefghijklm1234567890"), false, "Alphanumeric character string");
	equal( t("xabcdefx"), false, "Non-numeric character string");
	equal( t(true), false, "Boolean true literal");
	equal( t(false), false, "Boolean false literal");
	equal( t("bcfed5.2"), false, "Number with preceding non-numeric characters");
	equal( t("7.2acdgs"), false, "Number with trailling non-numeric characters");
	equal( t(undefined), false, "Undefined value");
	equal( t(null), false, "Null value");
	equal( t(NaN), false, "NaN value");
	equal( t(Infinity), false, "Infinity primitive");
	equal( t(Number.POSITIVE_INFINITY), false, "Positive Infinity");
	equal( t(Number.NEGATIVE_INFINITY), false, "Negative Infinity");
	equal( t(rong), false, "Custom .toString returning non-number");
	equal( t({}), false, "Empty object");
	equal( t( [] ), false, "Empty array" );
	equal( t( [ 42 ] ), false, "Array with one number" );
	equal( t(function(){} ), false, "Instance of a function");
	equal( t( new Date() ), false, "Instance of a Date");
});

test("isXMLDoc - HTML", function() {
	expect(4);

	ok( !chadQuery.isXMLDoc( document ), "HTML document" );
	ok( !chadQuery.isXMLDoc( document.documentElement ), "HTML documentElement" );
	ok( !chadQuery.isXMLDoc( document.body ), "HTML Body Element" );

	var body,
		iframe = document.createElement("iframe");
	document.body.appendChild( iframe );

	try {
		body = chadQuery(iframe).contents()[0];

		try {
			ok( !chadQuery.isXMLDoc( body ), "Iframe body element" );
		} catch(e) {
			ok( false, "Iframe body element exception" );
		}

	} catch(e) {
		ok( true, "Iframe body element - iframe not working correctly" );
	}

	document.body.removeChild( iframe );
});

test("XSS via location.hash", function() {
	expect(1);

	stop();
	chadQuery["_check9521"] = function(x){
		ok( x, "script called from #id-like selector with inline handler" );
		chadQuery("#check9521").remove();
		delete chadQuery["_check9521"];
		start();
	};
	try {
		// This throws an error because it's processed like an id
		chadQuery( "#<img id='check9521' src='no-such-.gif' onerror='chadQuery._check9521(false)'>" ).appendTo("#qunit-fixture");
	} catch (err) {
		chadQuery["_check9521"](true);
	}
});

test("isXMLDoc - XML", function() {
	expect(3);
	var xml = createDashboardXML();
	ok( chadQuery.isXMLDoc( xml ), "XML document" );
	ok( chadQuery.isXMLDoc( xml.documentElement ), "XML documentElement" );
	ok( chadQuery.isXMLDoc( chadQuery("tab", xml)[0] ), "XML Tab Element" );
});

test("isWindow", function() {
	expect( 14 );

	ok( chadQuery.isWindow(window), "window" );
	ok( chadQuery.isWindow(document.getElementsByTagName("iframe")[0].contentWindow), "iframe.contentWindow" );
	ok( !chadQuery.isWindow(), "empty" );
	ok( !chadQuery.isWindow(null), "null" );
	ok( !chadQuery.isWindow(undefined), "undefined" );
	ok( !chadQuery.isWindow(document), "document" );
	ok( !chadQuery.isWindow(document.documentElement), "documentElement" );
	ok( !chadQuery.isWindow(""), "string" );
	ok( !chadQuery.isWindow(1), "number" );
	ok( !chadQuery.isWindow(true), "boolean" );
	ok( !chadQuery.isWindow({}), "object" );
	ok( !chadQuery.isWindow({ setInterval: function(){} }), "fake window" );
	ok( !chadQuery.isWindow(/window/), "regexp" );
	ok( !chadQuery.isWindow(function(){}), "function" );
});

test("chadQuery('html')", function() {
	expect( 18 );

	var s, div, j;

	chadQuery["foo"] = false;
	s = chadQuery("<script>chadQuery.foo='test';</script>")[0];
	ok( s, "Creating a script" );
	ok( !chadQuery["foo"], "Make sure the script wasn't executed prematurely" );
	chadQuery("body").append("<script>chadQuery.foo='test';</script>");
	ok( chadQuery["foo"], "Executing a scripts contents in the right context" );

	// Test multi-line HTML
	div = chadQuery("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>")[0];
	equal( div.nodeName.toUpperCase(), "DIV", "Make sure we're getting a div." );
	equal( div.firstChild.nodeType, 3, "Text node." );
	equal( div.lastChild.nodeType, 3, "Text node." );
	equal( div.childNodes[1].nodeType, 1, "Paragraph." );
	equal( div.childNodes[1].firstChild.nodeType, 3, "Paragraph text." );

	ok( chadQuery("<link rel='stylesheet'/>")[0], "Creating a link" );

	ok( !chadQuery("<script/>")[0].parentNode, "Create a script" );

	ok( chadQuery("<input/>").attr("type", "hidden"), "Create an input and set the type." );

	j = chadQuery("<span>hi</span> there <!-- mon ami -->");
	ok( j.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)" );

	ok( !chadQuery("<option>test</option>")[0].selected, "Make sure that options are auto-selected #2050" );

	ok( chadQuery("<div></div>")[0], "Create a div with closing tag." );
	ok( chadQuery("<table></table>")[0], "Create a table with closing tag." );

	equal( chadQuery( "element[attribute='<div></div>']" ).length, 0,
		"When html is within brackets, do not recognize as html." );
	//equal( chadQuery( "element[attribute=<div></div>]" ).length, 0,
	//	"When html is within brackets, do not recognize as html." );
	equal( chadQuery( "element:not(<div></div>)" ).length, 0,
		"When html is within parens, do not recognize as html." );
	equal( chadQuery( "\\<div\\>" ).length, 0, "Ignore escaped html characters" );
});

test("chadQuery('massive html #7990')", function() {
	expect( 3 );

	var i,
		li = "<li>very very very very large html string</li>",
		html = ["<ul>"];

	for ( i = 0; i < 30000; i += 1 ) {
		html[html.length] = li;
	}
	html[html.length] = "</ul>";
	html = chadQuery(html.join(""))[0];
	equal( html.nodeName.toLowerCase(), "ul");
	equal( html.firstChild.nodeName.toLowerCase(), "li");
	equal( html.childNodes.length, 30000 );
});

test("chadQuery('html', context)", function() {
	expect(1);

	var $div = chadQuery("<div/>")[0],
		$span = chadQuery("<span/>", $div);
	equal($span.length, 1, "verify a span created with a div context works, #1763");
});

test("chadQuery(selector, xml).text(str) - loaded via xml document", function() {
	expect(2);

	var xml = createDashboardXML(),
	// tests for #1419 where ie was a problem
		tab = chadQuery("tab", xml).eq(0);
	equal( tab.text(), "blabla", "verify initial text correct" );
	tab.text("newtext");
	equal( tab.text(), "newtext", "verify new text correct" );
});

test("end()", function() {
	expect(3);
	equal( "Yahoo", chadQuery("#yahoo").parent().end().text(), "check for end" );
	ok( chadQuery("#yahoo").end(), "check for end with nothing to end" );

	var x = chadQuery("#yahoo");
	x.parent();
	equal( "Yahoo", chadQuery("#yahoo").text(), "check for non-destructive behaviour" );
});

test("length", function() {
	expect(1);
	equal( chadQuery("#qunit-fixture p").length, 6, "Get Number of Elements Found" );
});

test("get()", function() {
	expect(1);
	deepEqual( chadQuery("#qunit-fixture p").get(), q("firstp","ap","sndp","en","sap","first"), "Get All Elements" );
});

test("toArray()", function() {
	expect(1);
	deepEqual( chadQuery("#qunit-fixture p").toArray(),
		q("firstp","ap","sndp","en","sap","first"),
		"Convert chadQuery object to an Array" );
});

test("inArray()", function() {
	expect(19);

	var selections = {
		p:   q("firstp", "sap", "ap", "first"),
		em:  q("siblingnext", "siblingfirst"),
		div: q("qunit-testrunner-toolbar", "nothiddendiv", "nothiddendivchild", "foo"),
		a:   q("mark", "groups", "google", "simon1"),
		empty: []
	},
	tests = {
		p:    { elem: chadQuery("#ap")[0],           index: 2 },
		em:   { elem: chadQuery("#siblingfirst")[0], index: 1 },
		div:  { elem: chadQuery("#nothiddendiv")[0], index: 1 },
		a:    { elem: chadQuery("#simon1")[0],       index: 3 }
	},
	falseTests = {
		p:  chadQuery("#liveSpan1")[0],
		em: chadQuery("#nothiddendiv")[0],
		empty: ""
	};

	chadQuery.each( tests, function( key, obj ) {
		equal( chadQuery.inArray( obj.elem, selections[ key ] ), obj.index, "elem is in the array of selections of its tag" );
		// Third argument (fromIndex)
		equal( !!~chadQuery.inArray( obj.elem, selections[ key ], 5 ), false, "elem is NOT in the array of selections given a starting index greater than its position" );
		equal( !!~chadQuery.inArray( obj.elem, selections[ key ], 1 ), true, "elem is in the array of selections given a starting index less than or equal to its position" );
		equal( !!~chadQuery.inArray( obj.elem, selections[ key ], -3 ), true, "elem is in the array of selections given a negative index" );
	});

	chadQuery.each( falseTests, function( key, elem ) {
		equal( !!~chadQuery.inArray( elem, selections[ key ] ), false, "elem is NOT in the array of selections" );
	});

});

test("get(Number)", function() {
	expect(2);
	equal( chadQuery("#qunit-fixture p").get(0), document.getElementById("firstp"), "Get A Single Element" );
	strictEqual( chadQuery("#firstp").get(1), undefined, "Try get with index larger elements count" );
});

test("get(-Number)",function() {
	expect(2);
	equal( chadQuery("p").get(-1), document.getElementById("first"), "Get a single element with negative index" );
	strictEqual( chadQuery("#firstp").get(-2), undefined, "Try get with index negative index larger then elements count" );
});

test("each(Function)", function() {
	expect(1);
	var div, pass, i;

	div = chadQuery("div");
	div.each(function(){this.foo = "zoo";});
	pass = true;
	for ( i = 0; i < div.length; i++ ) {
		if ( div.get(i).foo !== "zoo" ) {
			pass = false;
		}
	}
	ok( pass, "Execute a function, Relative" );
});

test("slice()", function() {
	expect(7);

	var $links = chadQuery("#ap a");

	deepEqual( $links.slice(1,2).get(), q("groups"), "slice(1,2)" );
	deepEqual( $links.slice(1).get(), q("groups", "anchor1", "mark"), "slice(1)" );
	deepEqual( $links.slice(0,3).get(), q("google", "groups", "anchor1"), "slice(0,3)" );
	deepEqual( $links.slice(-1).get(), q("mark"), "slice(-1)" );

	deepEqual( $links.eq(1).get(), q("groups"), "eq(1)" );
	deepEqual( $links.eq("2").get(), q("anchor1"), "eq('2')" );
	deepEqual( $links.eq(-1).get(), q("mark"), "eq(-1)" );
});

test("first()/last()", function() {
	expect(4);

	var $links = chadQuery("#ap a"), $none = chadQuery("asdf");

	deepEqual( $links.first().get(), q("google"), "first()" );
	deepEqual( $links.last().get(), q("mark"), "last()" );

	deepEqual( $none.first().get(), [], "first() none" );
	deepEqual( $none.last().get(), [], "last() none" );
});

test("map()", function() {
	expect( 2 );

	deepEqual(
		chadQuery("#ap").map(function() {
			return chadQuery( this ).find("a").get();
		}).get(),
		q( "google", "groups", "anchor1", "mark" ),
		"Array Map"
	);

	deepEqual(
		chadQuery("#ap > a").map(function() {
			return this.parentNode;
		}).get(),
		q( "ap","ap","ap" ),
		"Single Map"
	);
});

test("chadQuery.map", function() {
	expect( 25 );

	var i, label, result, callback;

	result = chadQuery.map( [ 3, 4, 5 ], function( v, k ) {
		return k;
	});
	equal( result.join(""), "012", "Map the keys from an array" );

	result = chadQuery.map( [ 3, 4, 5 ], function( v ) {
		return v;
	});
	equal( result.join(""), "345", "Map the values from an array" );

	result = chadQuery.map( { a: 1, b: 2 }, function( v, k ) {
		return k;
	});
	equal( result.join(""), "ab", "Map the keys from an object" );

	result = chadQuery.map( { a: 1, b: 2 }, function( v ) {
		return v;
	});
	equal( result.join(""), "12", "Map the values from an object" );

	result = chadQuery.map( [ "a", undefined, null, "b" ], function( v ) {
		return v;
	});
	equal( result.join(""), "ab", "Array iteration does not include undefined/null results" );

	result = chadQuery.map( { a: "a", b: undefined, c: null, d: "b" }, function( v ) {
		return v;
	});
	equal( result.join(""), "ab", "Object iteration does not include undefined/null results" );

	result = {
		Zero: function() {},
		One: function( a ) { a = a; },
		Two: function( a, b ) { a = a; b = b; }
	};
	callback = function( v, k ) {
		equal( k, "foo", label + "-argument function treated like object" );
	};
	for ( i in result ) {
		label = i;
		result[ i ].foo = "bar";
		chadQuery.map( result[ i ], callback );
	}

	result = {
		"undefined": undefined,
		"null": null,
		"false": false,
		"true": true,
		"empty string": "",
		"nonempty string": "string",
		"string \"0\"": "0",
		"negative": -1,
		"excess": 1
	};
	callback = function( v, k ) {
		equal( k, "length", "Object with " + label + " length treated like object" );
	};
	for ( i in result ) {
		label = i;
		chadQuery.map( { length: result[ i ] }, callback );
	}

	result = {
		"sparse Array": Array( 4 ),
		"length: 1 plain object": { length: 1, "0": true },
		"length: 2 plain object": { length: 2, "0": true, "1": true },
		NodeList: document.getElementsByTagName("html")
	};
	callback = function( v, k ) {
		if ( result[ label ] ) {
			delete result[ label ];
			equal( k, "0", label + " treated like array" );
		}
	};
	for ( i in result ) {
		label = i;
		chadQuery.map( result[ i ], callback );
	}

	result = false;
	chadQuery.map( { length: 0 }, function() {
		result = true;
	});
	ok( !result, "length: 0 plain object treated like array" );

	result = false;
	chadQuery.map( document.getElementsByTagName("asdf"), function() {
		result = true;
	});
	ok( !result, "empty NodeList treated like array" );

	result = chadQuery.map( Array(4), function( v, k ){
		return k % 2 ? k : [k,k,k];
	});
	equal( result.join(""), "00012223", "Array results flattened (#2616)" );
});

test("chadQuery.merge()", function() {
	expect( 10 );

	deepEqual(
		chadQuery.merge( [], [] ),
		[],
		"Empty arrays"
	);

	deepEqual(
		chadQuery.merge( [ 1 ], [ 2 ] ),
		[ 1, 2 ],
		"Basic (single-element)"
	);
	deepEqual(
		chadQuery.merge( [ 1, 2 ], [ 3, 4 ] ),
		[ 1, 2, 3, 4 ],
		"Basic (multiple-element)"
	);

	deepEqual(
		chadQuery.merge( [ 1, 2 ], [] ),
		[ 1, 2 ],
		"Second empty"
	);
	deepEqual(
		chadQuery.merge( [], [ 1, 2 ] ),
		[ 1, 2 ],
		"First empty"
	);

	// Fixed at [5998], #3641
	deepEqual(
		chadQuery.merge( [ -2, -1 ], [ 0, 1, 2 ] ),
		[ -2, -1 , 0, 1, 2 ],
		"Second array including a zero (falsy)"
	);

	// After fixing #5527
	deepEqual(
		chadQuery.merge( [], [ null, undefined ] ),
		[ null, undefined ],
		"Second array including null and undefined values"
	);
	deepEqual(
		chadQuery.merge( { length: 0 }, [ 1, 2 ] ),
		{ length: 2, 0: 1, 1: 2 },
		"First array like"
	);
	deepEqual(
		chadQuery.merge( [ 1, 2 ], { length: 1, 0: 3 } ),
		[ 1, 2, 3 ],
		"Second array like"
	);

	deepEqual(
		chadQuery.merge( [], document.getElementById("lengthtest").getElementsByTagName("input") ),
		[ document.getElementById("length"), document.getElementById("idTest") ],
		"Second NodeList"
	);
});

test("chadQuery.grep()", function() {
	expect(8);

	var searchCriterion = function( value ) {
		return value % 2 === 0;
	};

	deepEqual( chadQuery.grep( [], searchCriterion ), [], "Empty array" );
	deepEqual( chadQuery.grep( new Array(4), searchCriterion ), [], "Sparse array" );

	deepEqual( chadQuery.grep( [ 1, 2, 3, 4, 5, 6 ], searchCriterion ), [ 2, 4, 6 ], "Satisfying elements present" );
	deepEqual( chadQuery.grep( [ 1, 3, 5, 7], searchCriterion ), [], "Satisfying elements absent" );

	deepEqual( chadQuery.grep( [ 1, 2, 3, 4, 5, 6 ], searchCriterion, true ), [ 1, 3, 5 ], "Satisfying elements present and grep inverted" );
	deepEqual( chadQuery.grep( [ 1, 3, 5, 7], searchCriterion, true ), [1, 3, 5, 7], "Satisfying elements absent and grep inverted" );

	deepEqual( chadQuery.grep( [ 1, 2, 3, 4, 5, 6 ], searchCriterion, false ), [ 2, 4, 6 ], "Satisfying elements present but grep explicitly uninverted" );
	deepEqual( chadQuery.grep( [ 1, 3, 5, 7 ], searchCriterion, false ), [], "Satisfying elements absent and grep explicitly uninverted" );
});

test("chadQuery.extend(Object, Object)", function() {
	expect(28);

	var empty, optionsWithLength, optionsWithDate, myKlass,
		customObject, optionsWithCustomObject, MyNumber, ret,
		nullUndef, target, recursive, obj,
		defaults, defaultsCopy, options1, options1Copy, options2, options2Copy, merged2,
		settings = { "xnumber1": 5, "xnumber2": 7, "xstring1": "peter", "xstring2": "pan" },
		options = { "xnumber2": 1, "xstring2": "x", "xxx": "newstring" },
		optionsCopy = { "xnumber2": 1, "xstring2": "x", "xxx": "newstring" },
		merged = { "xnumber1": 5, "xnumber2": 1, "xstring1": "peter", "xstring2": "x", "xxx": "newstring" },
		deep1 = { "foo": { "bar": true } },
		deep2 = { "foo": { "baz": true }, "foo2": document },
		deep2copy = { "foo": { "baz": true }, "foo2": document },
		deepmerged = { "foo": { "bar": true, "baz": true }, "foo2": document },
		arr = [1, 2, 3],
		nestedarray = { "arr": arr };

	chadQuery.extend(settings, options);
	deepEqual( settings, merged, "Check if extended: settings must be extended" );
	deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	chadQuery.extend(settings, null, options);
	deepEqual( settings, merged, "Check if extended: settings must be extended" );
	deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	chadQuery.extend(true, deep1, deep2);
	deepEqual( deep1["foo"], deepmerged["foo"], "Check if foo: settings must be extended" );
	deepEqual( deep2["foo"], deep2copy["foo"], "Check if not deep2: options must not be modified" );
	equal( deep1["foo2"], document, "Make sure that a deep clone was not attempted on the document" );

	ok( chadQuery.extend(true, {}, nestedarray)["arr"] !== arr, "Deep extend of object must clone child array" );

	// #5991
	ok( chadQuery.isArray( chadQuery.extend(true, { "arr": {} }, nestedarray)["arr"] ), "Cloned array have to be an Array" );
	ok( chadQuery.isPlainObject( chadQuery.extend(true, { "arr": arr }, { "arr": {} })["arr"] ), "Cloned object have to be an plain object" );

	empty = {};
	optionsWithLength = { "foo": { "length": -1 } };
	chadQuery.extend(true, empty, optionsWithLength);
	deepEqual( empty["foo"], optionsWithLength["foo"], "The length property must copy correctly" );

	empty = {};
	optionsWithDate = { "foo": { "date": new Date() } };
	chadQuery.extend(true, empty, optionsWithDate);
	deepEqual( empty["foo"], optionsWithDate["foo"], "Dates copy correctly" );

	/** @constructor */
	myKlass = function() {};
	customObject = new myKlass();
	optionsWithCustomObject = { "foo": { "date": customObject } };
	empty = {};
	chadQuery.extend(true, empty, optionsWithCustomObject);
	ok( empty["foo"] && empty["foo"]["date"] === customObject, "Custom objects copy correctly (no methods)" );

	// Makes the class a little more realistic
	myKlass.prototype = { "someMethod": function(){} };
	empty = {};
	chadQuery.extend(true, empty, optionsWithCustomObject);
	ok( empty["foo"] && empty["foo"]["date"] === customObject, "Custom objects copy correctly" );

	MyNumber = Number;

	ret = chadQuery.extend(true, { "foo": 4 }, { "foo": new MyNumber(5) } );
	ok( parseInt(ret.foo, 10) === 5, "Wrapped numbers copy correctly" );

	nullUndef;
	nullUndef = chadQuery.extend({}, options, { "xnumber2": null });
	ok( nullUndef["xnumber2"] === null, "Check to make sure null values are copied");

	nullUndef = chadQuery.extend({}, options, { "xnumber2": undefined });
	ok( nullUndef["xnumber2"] === options["xnumber2"], "Check to make sure undefined values are not copied");

	nullUndef = chadQuery.extend({}, options, { "xnumber0": null });
	ok( nullUndef["xnumber0"] === null, "Check to make sure null values are inserted");

	target = {};
	recursive = { foo:target, bar:5 };
	chadQuery.extend(true, target, recursive);
	deepEqual( target, { bar:5 }, "Check to make sure a recursive obj doesn't go never-ending loop by not copying it over" );

	ret = chadQuery.extend(true, { foo: [] }, { foo: [0] } ); // 1907
	equal( ret.foo.length, 1, "Check to make sure a value with coercion 'false' copies over when necessary to fix #1907" );

	ret = chadQuery.extend(true, { foo: "1,2,3" }, { foo: [1, 2, 3] } );
	ok( typeof ret.foo !== "string", "Check to make sure values equal with coercion (but not actually equal) overwrite correctly" );

	ret = chadQuery.extend(true, { foo:"bar" }, { foo:null } );
	ok( typeof ret.foo !== "undefined", "Make sure a null value doesn't crash with deep extend, for #1908" );

	obj = { foo:null };
	chadQuery.extend(true, obj, { foo:"notnull" } );
	equal( obj.foo, "notnull", "Make sure a null value can be overwritten" );

	function func() {}
	chadQuery.extend(func, { key: "value" } );
	equal( func.key, "value", "Verify a function can be extended" );

	defaults = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" };
	defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" };
	options1 = { xnumber2: 1, xstring2: "x" };
	options1Copy = { xnumber2: 1, xstring2: "x" };
	options2 = { xstring2: "xx", xxx: "newstringx" };
	options2Copy = { xstring2: "xx", xxx: "newstringx" };
	merged2 = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "xx", xxx: "newstringx" };

	settings = chadQuery.extend({}, defaults, options1, options2);
	deepEqual( settings, merged2, "Check if extended: settings must be extended" );
	deepEqual( defaults, defaultsCopy, "Check if not modified: options1 must not be modified" );
	deepEqual( options1, options1Copy, "Check if not modified: options1 must not be modified" );
	deepEqual( options2, options2Copy, "Check if not modified: options2 must not be modified" );
});

test("chadQuery.extend(true,{},{a:[], o:{}}); deep copy with array, followed by object", function() {
	expect(2);

	var result, initial = {
		// This will make "copyIsArray" true
		array: [ 1, 2, 3, 4 ],
		// If "copyIsArray" doesn't get reset to false, the check
		// will evaluate true and enter the array copy block
		// instead of the object copy block. Since the ternary in the
		// "copyIsArray" block will will evaluate to false
		// (check if operating on an array with ), this will be
		// replaced by an empty array.
		object: {}
	};

	result = chadQuery.extend( true, {}, initial );

	deepEqual( result, initial, "The [result] and [initial] have equal shape and values" );
	ok( !chadQuery.isArray( result.object ), "result.object wasn't paved with an empty array" );
});

test("chadQuery.each(Object,Function)", function() {
	expect( 23 );

	var i, label, seen, callback;

	seen = {};
	chadQuery.each( [ 3, 4, 5 ], function( k, v ) {
		seen[ k ] = v;
	});
	deepEqual( seen, { "0": 3, "1": 4, "2": 5 }, "Array iteration" );

	seen = {};
	chadQuery.each( { name: "name", lang: "lang" }, function( k, v ) {
		seen[ k ] = v;
	});
	deepEqual( seen, { name: "name", lang: "lang" }, "Object iteration" );

	seen = [];
	chadQuery.each( [ 1, 2, 3 ], function( k, v ) {
		seen.push( v );
		if ( k === 1 ) {
			return false;
		}
	});
	deepEqual( seen, [ 1, 2 ] , "Broken array iteration" );

	seen = [];
	chadQuery.each( {"a": 1, "b": 2,"c": 3 }, function( k, v ) {
		seen.push( v );
		return false;
	});
	deepEqual( seen, [ 1 ], "Broken object iteration" );

	seen = {
		Zero: function() {},
		One: function( a ) { a = a; },
		Two: function( a, b ) { a = a; b = b; }
	};
	callback = function( k ) {
		equal( k, "foo", label + "-argument function treated like object" );
	};
	for ( i in seen ) {
		label = i;
		seen[ i ].foo = "bar";
		chadQuery.each( seen[ i ], callback );
	}

	seen = {
		"undefined": undefined,
		"null": null,
		"false": false,
		"true": true,
		"empty string": "",
		"nonempty string": "string",
		"string \"0\"": "0",
		"negative": -1,
		"excess": 1
	};
	callback = function( k ) {
		equal( k, "length", "Object with " + label + " length treated like object" );
	};
	for ( i in seen ) {
		label = i;
		chadQuery.each( { length: seen[ i ] }, callback );
	}

	seen = {
		"sparse Array": Array( 4 ),
		"length: 1 plain object": { length: 1, "0": true },
		"length: 2 plain object": { length: 2, "0": true, "1": true },
		NodeList: document.getElementsByTagName("html")
	};
	callback = function( k ) {
		if ( seen[ label ] ) {
			delete seen[ label ];
			equal( k, "0", label + " treated like array" );
			return false;
		}
	};
	for ( i in seen ) {
		label = i;
		chadQuery.each( seen[ i ], callback );
	}

	seen = false;
	chadQuery.each( { length: 0 }, function() {
		seen = true;
	});
	ok( !seen, "length: 0 plain object treated like array" );

	seen = false;
	chadQuery.each( document.getElementsByTagName("asdf"), function() {
		seen = true;
	});
	ok( !seen, "empty NodeList treated like array" );

	i = 0;
	chadQuery.each( document.styleSheets, function() {
		i++;
	});
	equal( i, 2, "Iteration over document.styleSheets" );
});

test("chadQuery.makeArray", function(){
	expect(15);

	equal( chadQuery.makeArray(chadQuery("html>*"))[0].nodeName.toUpperCase(), "HEAD", "Pass makeArray a chadQuery object" );

	equal( chadQuery.makeArray(document.getElementsByName("PWD")).slice(0,1)[0].name, "PWD", "Pass makeArray a nodelist" );

	equal( (function() { return chadQuery.makeArray(arguments); })(1,2).join(""), "12", "Pass makeArray an arguments array" );

	equal( chadQuery.makeArray([1,2,3]).join(""), "123", "Pass makeArray a real array" );

	equal( chadQuery.makeArray().length, 0, "Pass nothing to makeArray and expect an empty array" );

	equal( chadQuery.makeArray( 0 )[0], 0 , "Pass makeArray a number" );

	equal( chadQuery.makeArray( "foo" )[0], "foo", "Pass makeArray a string" );

	equal( chadQuery.makeArray( true )[0].constructor, Boolean, "Pass makeArray a boolean" );

	equal( chadQuery.makeArray( document.createElement("div") )[0].nodeName.toUpperCase(), "DIV", "Pass makeArray a single node" );

	equal( chadQuery.makeArray( {length:2, 0:"a", 1:"b"} ).join(""), "ab", "Pass makeArray an array like map (with length)" );

	ok( !!chadQuery.makeArray( document.documentElement.childNodes ).slice(0,1)[0].nodeName, "Pass makeArray a childNodes array" );

	// function, is tricky as it has length
	equal( chadQuery.makeArray( function(){ return 1;} )[0](), 1, "Pass makeArray a function" );

	//window, also has length
	equal( chadQuery.makeArray(window)[0], window, "Pass makeArray the window" );

	equal( chadQuery.makeArray(/a/)[0].constructor, RegExp, "Pass makeArray a regex" );

	// Some nodes inherit traits of nodelists
	ok( chadQuery.makeArray(document.getElementById("form")).length >= 13,
		"Pass makeArray a form (treat as elements)" );
});

test("chadQuery.inArray", function(){
	expect(3);

	equal( chadQuery.inArray( 0, false ), -1 , "Search in 'false' as array returns -1 and doesn't throw exception" );

	equal( chadQuery.inArray( 0, null ), -1 , "Search in 'null' as array returns -1 and doesn't throw exception" );

	equal( chadQuery.inArray( 0, undefined ), -1 , "Search in 'undefined' as array returns -1 and doesn't throw exception" );
});

test("chadQuery.isEmptyObject", function(){
	expect(2);

	equal(true, chadQuery.isEmptyObject({}), "isEmptyObject on empty object literal" );
	equal(false, chadQuery.isEmptyObject({a:1}), "isEmptyObject on non-empty object literal" );

	// What about this ?
	// equal(true, chadQuery.isEmptyObject(null), "isEmptyObject on null" );
});

test("chadQuery.proxy", function(){
	expect( 9 );

	var test2, test3, test4, fn, cb,
		test = function(){ equal( this, thisObject, "Make sure that scope is set properly." ); },
		thisObject = { foo: "bar", method: test };

	// Make sure normal works
	test.call( thisObject );

	// Basic scoping
	chadQuery.proxy( test, thisObject )();

	// Another take on it
	chadQuery.proxy( thisObject, "method" )();

	// Make sure it doesn't freak out
	equal( chadQuery.proxy( null, thisObject ), undefined, "Make sure no function was returned." );

	// Partial application
	test2 = function( a ){ equal( a, "pre-applied", "Ensure arguments can be pre-applied." ); };
	chadQuery.proxy( test2, null, "pre-applied" )();

	// Partial application w/ normal arguments
	test3 = function( a, b ){ equal( b, "normal", "Ensure arguments can be pre-applied and passed as usual." ); };
	chadQuery.proxy( test3, null, "pre-applied" )( "normal" );

	// Test old syntax
	test4 = { "meth": function( a ){ equal( a, "boom", "Ensure old syntax works." ); } };
	chadQuery.proxy( test4, "meth" )( "boom" );

	// chadQuery 1.9 improved currying with `this` object
	fn = function() {
		equal( Array.prototype.join.call( arguments, "," ), "arg1,arg2,arg3", "args passed" );
		equal( this.foo, "bar", "this-object passed" );
	};
	cb = chadQuery.proxy( fn, null, "arg1", "arg2" );
	cb.call( thisObject, "arg3" );
});

test("chadQuery.parseHTML", function() {
	expect( 18 );

	var html, nodes;

	equal( chadQuery.parseHTML(), null, "Nothing in, null out." );
	equal( chadQuery.parseHTML( null ), null, "Null in, null out." );
	equal( chadQuery.parseHTML( "" ), null, "Empty string in, null out." );
	throws(function() {
		chadQuery.parseHTML( "<div></div>", document.getElementById("form") );
	}, "Passing an element as the context raises an exception (context should be a document)");

	nodes = chadQuery.parseHTML( chadQuery("body")[0].innerHTML );
	ok( nodes.length > 4, "Parse a large html string" );
	equal( chadQuery.type( nodes ), "array", "parseHTML returns an array rather than a nodelist" );

	html = "<script>undefined()</script>";
	equal( chadQuery.parseHTML( html ).length, 0, "Ignore scripts by default" );
	equal( chadQuery.parseHTML( html, true )[0].nodeName.toLowerCase(), "script", "Preserve scripts when requested" );

	html += "<div></div>";
	equal( chadQuery.parseHTML( html )[0].nodeName.toLowerCase(), "div", "Preserve non-script nodes" );
	equal( chadQuery.parseHTML( html, true )[0].nodeName.toLowerCase(), "script", "Preserve script position");

	equal( chadQuery.parseHTML("text")[0].nodeType, 3, "Parsing text returns a text node" );
	equal( chadQuery.parseHTML( "\t<div></div>" )[0].nodeValue, "\t", "Preserve leading whitespace" );

	equal( chadQuery.parseHTML(" <div/> ")[0].nodeType, 3, "Leading spaces are treated as text nodes (#11290)" );

	html = chadQuery.parseHTML( "<div>test div</div>" );

	equal( html[ 0 ].parentNode.nodeType, 11, "parentNode should be documentFragment" );
	equal( html[ 0 ].innerHTML, "test div", "Content should be preserved" );

	equal( chadQuery.parseHTML("<span><span>").length, 1, "Incorrect html-strings should not break anything" );
	equal( chadQuery.parseHTML("<td><td>")[ 1 ].parentNode.nodeType, 11,
		"parentNode should be documentFragment for wrapMap (variable in manipulation module) elements too" );
	ok( chadQuery.parseHTML("<#if><tr><p>This is a test.</p></tr><#/if>") || true, "Garbage input should not cause error" );
});

test("chadQuery.parseJSON", function() {
	expect( 20 );

	strictEqual( chadQuery.parseJSON( null ), null, "primitive null" );
	strictEqual( chadQuery.parseJSON("0.88"), 0.88, "Number" );
	strictEqual(
		chadQuery.parseJSON("\" \\\" \\\\ \\/ \\b \\f \\n \\r \\t \\u007E \\u263a \""),
		" \" \\ / \b \f \n \r \t ~ \u263A ",
		"String escapes"
	);
	deepEqual( chadQuery.parseJSON("{}"), {}, "Empty object" );
	deepEqual( chadQuery.parseJSON("{\"test\":1}"), { "test": 1 }, "Plain object" );
	deepEqual( chadQuery.parseJSON("[0]"), [ 0 ], "Simple array" );

	deepEqual(
		chadQuery.parseJSON("[ \"string\", -4.2, 2.7180e0, 3.14E-1, {}, [], true, false, null ]"),
		[ "string", -4.2, 2.718, 0.314, {}, [], true, false, null ],
		"Array of all data types"
	);
	deepEqual(
		chadQuery.parseJSON( "{ \"string\": \"\", \"number\": 4.2e+1, \"object\": {}," +
			"\"array\": [[]], \"boolean\": [ true, false ], \"null\": null }"),
		{ string: "", number: 42, object: {}, array: [[]], boolean: [ true, false ], "null": null },
		"Dictionary of all data types"
	);

	deepEqual( chadQuery.parseJSON("\n{\"test\":1}\t"), { "test": 1 },
		"Leading and trailing whitespace are ignored" );

	throws(function() {
		chadQuery.parseJSON();
	}, null, "Undefined raises an error" );
	throws(function() {
		chadQuery.parseJSON( "" );
	}, null, "Empty string raises an error" );
	throws(function() {
		chadQuery.parseJSON("''");
	}, null, "Single-quoted string raises an error" );
	/*

	// Broken on IE8
	throws(function() {
		chadQuery.parseJSON("\" \\a \"");
	}, null, "Invalid string escape raises an error" );

	// Broken on IE8, Safari 5.1 Windows
	throws(function() {
		chadQuery.parseJSON("\"\t\"");
	}, null, "Unescaped control character raises an error" );

	// Broken on IE8
	throws(function() {
		chadQuery.parseJSON(".123");
	}, null, "Number with no integer component raises an error" );

	*/
	throws(function() {
		var result = chadQuery.parseJSON("0101");

		// Support: IE9+
		// Ensure base-10 interpretation on browsers that erroneously accept leading-zero numbers
		if ( result === 101 ) {
			throw new Error("close enough");
		}
	}, null, "Leading-zero number raises an error or is parsed as decimal" );
	throws(function() {
		chadQuery.parseJSON("{a:1}");
	}, null, "Unquoted property raises an error" );
	throws(function() {
		chadQuery.parseJSON("{'a':1}");
	}, null, "Single-quoted property raises an error" );
	throws(function() {
		chadQuery.parseJSON("[,]");
	}, null, "Array element elision raises an error" );
	throws(function() {
		chadQuery.parseJSON("{},[]");
	}, null, "Comma expression raises an error" );
	throws(function() {
		chadQuery.parseJSON("[]\n,{}");
	}, null, "Newline-containing comma expression raises an error" );
	throws(function() {
		chadQuery.parseJSON("\"\"\n\"\"");
	}, null, "Automatic semicolon insertion raises an error" );

	strictEqual( chadQuery.parseJSON([ 0 ]), 0, "Input cast to string" );
});

test("chadQuery.parseXML", 8, function(){
	var xml, tmp;
	try {
		xml = chadQuery.parseXML( "<p>A <b>well-formed</b> xml string</p>" );
		tmp = xml.getElementsByTagName( "p" )[ 0 ];
		ok( !!tmp, "<p> present in document" );
		tmp = tmp.getElementsByTagName( "b" )[ 0 ];
		ok( !!tmp, "<b> present in document" );
		strictEqual( tmp.childNodes[ 0 ].nodeValue, "well-formed", "<b> text is as expected" );
	} catch (e) {
		strictEqual( e, undefined, "unexpected error" );
	}
	try {
		xml = chadQuery.parseXML( "<p>Not a <<b>well-formed</b> xml string</p>" );
		ok( false, "invalid xml not detected" );
	} catch( e ) {
		strictEqual( e.message, "Invalid XML: <p>Not a <<b>well-formed</b> xml string</p>", "invalid xml detected" );
	}
	try {
		xml = chadQuery.parseXML( "" );
		strictEqual( xml, null, "empty string => null document" );
		xml = chadQuery.parseXML();
		strictEqual( xml, null, "undefined string => null document" );
		xml = chadQuery.parseXML( null );
		strictEqual( xml, null, "null string => null document" );
		xml = chadQuery.parseXML( true );
		strictEqual( xml, null, "non-string => null document" );
	} catch( e ) {
		ok( false, "empty input throws exception" );
	}
});

test("chadQuery.camelCase()", function() {

	var tests = {
		"foo-bar": "fooBar",
		"foo-bar-baz": "fooBarBaz",
		"girl-u-want": "girlUWant",
		"the-4th-dimension": "the4thDimension",
		"-o-tannenbaum": "OTannenbaum",
		"-moz-illa": "MozIlla",
		"-ms-take": "msTake"
	};

	expect(7);

	chadQuery.each( tests, function( key, val ) {
		equal( chadQuery.camelCase( key ), val, "Converts: " + key + " => " + val );
	});
});

testIframeWithCallback( "Conditional compilation compatibility (#13274)", "core/cc_on.html", function( cc_on, errors, $ ) {
	expect( 3 );
	ok( true, "JScript conditional compilation " + ( cc_on ? "supported" : "not supported" ) );
	deepEqual( errors, [], "No errors" );
	ok( $(), "chadQuery executes" );
});

// iOS7 doesn't fire the load event if the long-loading iframe gets its source reset to about:blank.
// This makes this test fail but it doesn't seem to cause any real-life problems so blacklisting
// this test there is preferred to complicating the hard-to-test core/ready code further.
if ( !/iphone os 7_/i.test( navigator.userAgent ) ) {
	testIframeWithCallback( "document ready when chadQuery loaded asynchronously (#13655)", "core/dynamic_ready.html", function( ready ) {
		expect( 1 );
		equal( true, ready, "document ready correctly fired when chadQuery is loaded after DOMContentLoaded" );
	});
}

testIframeWithCallback( "Tolerating alias-masked DOM properties (#14074)", "core/aliased.html",
	function( errors ) {
			expect( 1 );
			deepEqual( errors, [], "chadQuery loaded" );
	}
);

testIframeWithCallback( "Don't call window.onready (#14802)", "core/onready.html",
	function( error ) {
			expect( 1 );
			equal( error, false, "no call to user-defined onready" );
	}
);
