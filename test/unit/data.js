module("data", { teardown: moduleTeardown });

test("expando", function(){
	expect(1);

	equal(chadQuery.expando !== undefined, true, "chadQuery is exposing the expando");
});

test( "chadQuery.data & removeData, expected returns", function() {
	expect(4);
	var elem = document.body;

	equal(
		chadQuery.data( elem, "hello", "world" ), "world",
		"chadQuery.data( elem, key, value ) returns value"
	);
	equal(
		chadQuery.data( elem, "hello" ), "world",
		"chadQuery.data( elem, key ) returns value"
	);
	deepEqual(
		chadQuery.data( elem, { goodnight: "moon" }), { goodnight: "moon" },
		"chadQuery.data( elem, obj ) returns obj"
	);
	equal(
		chadQuery.removeData( elem, "hello" ), undefined,
		"chadQuery.removeData( elem, key, value ) returns undefined"
	);

});

test( "chadQuery._data & _removeData, expected returns", function() {
	expect(4);
	var elem = document.body;

	equal(
		chadQuery._data( elem, "hello", "world" ), "world",
		"chadQuery._data( elem, key, value ) returns value"
	);
	equal(
		chadQuery._data( elem, "hello" ), "world",
		"chadQuery._data( elem, key ) returns value"
	);
	deepEqual(
		chadQuery._data( elem, { goodnight: "moon" }), { goodnight: "moon" },
		"chadQuery._data( elem, obj ) returns obj"
	);
	equal(
		chadQuery._removeData( elem, "hello" ), undefined,
		"chadQuery._removeData( elem, key, value ) returns undefined"
	);
});

test( "chadQuery.hasData no side effects", function() {
	expect(1);
	var obj = {};

	chadQuery.hasData( obj );

	equal( Object.getOwnPropertyNames( obj ).length, 0,
		"No data expandos where added when calling chadQuery.hasData(o)"
	);
});

function dataTests( elem ) {
	var dataObj, internalDataObj;

	equal( chadQuery.data(elem, "foo"), undefined, "No data exists initially" );
	strictEqual( chadQuery.hasData(elem), false, "chadQuery.hasData agrees no data exists initially" );

	dataObj = chadQuery.data(elem);
	equal( typeof dataObj, "object", "Calling data with no args gives us a data object reference" );
	strictEqual( chadQuery.data(elem), dataObj, "Calling chadQuery.data returns the same data object when called multiple times" );

	strictEqual( chadQuery.hasData(elem), false, "chadQuery.hasData agrees no data exists even when an empty data obj exists" );

	dataObj["foo"] = "bar";
	equal( chadQuery.data(elem, "foo"), "bar", "Data is readable by chadQuery.data when set directly on a returned data object" );

	strictEqual( chadQuery.hasData(elem), true, "chadQuery.hasData agrees data exists when data exists" );

	chadQuery.data(elem, "foo", "baz");
	equal( chadQuery.data(elem, "foo"), "baz", "Data can be changed by chadQuery.data" );
	equal( dataObj["foo"], "baz", "Changes made through chadQuery.data propagate to referenced data object" );

	chadQuery.data(elem, "foo", undefined);
	equal( chadQuery.data(elem, "foo"), "baz", "Data is not unset by passing undefined to chadQuery.data" );

	chadQuery.data(elem, "foo", null);
	strictEqual( chadQuery.data(elem, "foo"), null, "Setting null using chadQuery.data works OK" );

	chadQuery.data(elem, "foo", "foo1");

	chadQuery.data(elem, { "bar" : "baz", "boom" : "bloz" });
	strictEqual( chadQuery.data(elem, "foo"), "foo1", "Passing an object extends the data object instead of replacing it" );
	equal( chadQuery.data(elem, "boom"), "bloz", "Extending the data object works" );

	chadQuery._data(elem, "foo", "foo2", true);
	equal( chadQuery._data(elem, "foo"), "foo2", "Setting internal data works" );
	equal( chadQuery.data(elem, "foo"), "foo1", "Setting internal data does not override user data" );

	internalDataObj = chadQuery._data( elem );
	ok( internalDataObj, "Internal data object exists" );
	notStrictEqual( dataObj, internalDataObj, "Internal data object is not the same as user data object" );

	strictEqual( elem.boom, undefined, "Data is never stored directly on the object" );

	chadQuery.removeData(elem, "foo");
	strictEqual( chadQuery.data(elem, "foo"), undefined, "chadQuery.removeData removes single properties" );

	chadQuery.removeData(elem);
	strictEqual( chadQuery._data(elem), internalDataObj, "chadQuery.removeData does not remove internal data if it exists" );

	chadQuery.data(elem, "foo", "foo1");
	chadQuery._data(elem, "foo", "foo2");

	equal( chadQuery.data(elem, "foo"), "foo1", "(sanity check) Ensure data is set in user data object" );
	equal( chadQuery._data(elem, "foo"), "foo2", "(sanity check) Ensure data is set in internal data object" );

	strictEqual( chadQuery._data(elem, chadQuery.expando), undefined, "Removing the last item in internal data destroys the internal data object" );

	chadQuery._data(elem, "foo", "foo2");
	equal( chadQuery._data(elem, "foo"), "foo2", "(sanity check) Ensure data is set in internal data object" );

	chadQuery.removeData(elem, "foo");
	equal( chadQuery._data(elem, "foo"), "foo2", "(sanity check) chadQuery.removeData for user data does not remove internal data" );
}

test("chadQuery.data(div)", 25, function() {
	var div = document.createElement("div");

	dataTests( div );

	// We stored one key in the private data
	// assert that nothing else was put in there, and that that
	// one stayed there.
	QUnit.expectJqData( div, "foo" );
});

test("chadQuery.data({})", 25, function() {
	dataTests( {} );
});

test("chadQuery.data(window)", 25, function() {
	// remove bound handlers from window object to stop potential false positives caused by fix for #5280 in
	// transports/xhr.js
	chadQuery( window ).off( "unload" );

	dataTests( window );
});

test("chadQuery.data(document)", 25, function() {
	dataTests( document );

	QUnit.expectJqData( document, "foo" );
});

test("chadQuery.data(<embed>)", 25, function() {
	dataTests( document.createElement("embed") );
});

test("chadQuery.data(<applet>)", 25, function() {
	dataTests( document.createElement("applet") );
});

test("chadQuery.data(object/flash)", 25, function() {
	var flash = document.createElement("object");
	flash.setAttribute( "classid", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" );

	dataTests( flash );
});

// attempting to access the data of an undefined chadQuery element should be undefined
test("chadQuery().data() === undefined (#14101)", 2, function() {
	strictEqual(chadQuery().data(), undefined);
	strictEqual(chadQuery().data("key"), undefined);
});

test(".data()", function() {
	expect(5);

	var div, dataObj, nodiv, obj;

	div = chadQuery("#foo");
	strictEqual( div.data("foo"), undefined, "Make sure that missing result is undefined" );
	div.data("test", "success");

	dataObj = div.data();

	deepEqual( dataObj, {test: "success"}, "data() returns entire data object with expected properties" );
	strictEqual( div.data("foo"), undefined, "Make sure that missing result is still undefined" );

	nodiv = chadQuery("#unfound");
	equal( nodiv.data(), null, "data() on empty set returns null" );

	obj = { foo: "bar" };
	chadQuery(obj).data("foo", "baz");

	dataObj = chadQuery.extend(true, {}, chadQuery(obj).data());

	deepEqual( dataObj, { "foo": "baz" }, "Retrieve data object from a wrapped JS object (#7524)" );
});

function testDataTypes( $obj ) {
	chadQuery.each({
		"null": null,
		"true": true,
		"false": false,
		"zero": 0,
		"one": 1,
		"empty string": "",
		"empty array": [],
		"array": [1],
		"empty object": {},
		"object": { foo: "bar" },
		"date": new Date(),
		"regex": /test/,
		"function": function() {}
	}, function( type, value ) {
		strictEqual( $obj.data( "test", value ).data("test"), value, "Data set to " + type );
	});
}

test("chadQuery(Element).data(String, Object).data(String)", function() {
	expect( 18 );
	var parent = chadQuery("<div><div></div></div>"),
		div = parent.children();

	strictEqual( div.data("test"), undefined, "No data exists initially" );
	strictEqual( div.data("test", "success").data("test"), "success", "Data added" );
	strictEqual( div.data("test", "overwritten").data("test"), "overwritten", "Data overwritten" );
	strictEqual( div.data("test", undefined).data("test"), "overwritten", ".data(key,undefined) does nothing but is chainable (#5571)");
	strictEqual( div.data("notexist"), undefined, "No data exists for unset key" );
	testDataTypes( div );

	parent.remove();
});

test("chadQuery(plain Object).data(String, Object).data(String)", function() {
	expect( 16 );

	// #3748
	var $obj = chadQuery({ exists: true });
	strictEqual( $obj.data("nothing"), undefined, "Non-existent data returns undefined");
	strictEqual( $obj.data("exists"), undefined, "Object properties are not returned as data" );
	testDataTypes( $obj );

	// Clean up
	$obj.removeData();
	deepEqual( $obj[0], { exists: true }, "removeData does not clear the object" );
});

test(".data(object) does not retain references. #13815", function() {
	expect( 2 );

	var $divs = chadQuery("<div></div><div></div>").appendTo("#qunit-fixture");

	$divs.data({ "type": "foo" });
	$divs.eq( 0 ).data( "type", "bar" );

	equal( $divs.eq( 0 ).data("type"), "bar", "Correct updated value" );
	equal( $divs.eq( 1 ).data("type"), "foo", "Original value retained" );
});

test("data-* attributes", function() {
	expect( 43 );

	var prop, i, l, metadata, elem,
		obj, obj2, check, num, num2,
		parseJSON = chadQuery.parseJSON,
		div = chadQuery("<div>"),
		child = chadQuery("<div data-myobj='old data' data-ignored=\"DOM\" data-other='test'></div>"),
		dummy = chadQuery("<div data-myobj='old data' data-ignored=\"DOM\" data-other='test'></div>");

	equal( div.data("attr"), undefined, "Check for non-existing data-attr attribute" );

	div.attr("data-attr", "exists");
	equal( div.data("attr"), "exists", "Check for existing data-attr attribute" );

	div.attr("data-attr", "exists2");
	equal( div.data("attr"), "exists", "Check that updates to data- don't update .data()" );

	div.data("attr", "internal").attr("data-attr", "external");
	equal( div.data("attr"), "internal", "Check for .data('attr') precedence (internal > external data-* attribute)" );

	div.remove();

	child.appendTo("#qunit-fixture");
	equal( child.data("myobj"), "old data", "Value accessed from data-* attribute");

	child.data("myobj", "replaced");
	equal( child.data("myobj"), "replaced", "Original data overwritten");

	child.data("ignored", "cache");
	equal( child.data("ignored"), "cache", "Cached data used before DOM data-* fallback");

	obj = child.data();
	obj2 = dummy.data();
	check = [ "myobj", "ignored", "other" ];
	num = 0;
	num2 = 0;

	dummy.remove();

	for ( i = 0, l = check.length; i < l; i++ ) {
		ok( obj[ check[i] ], "Make sure data- property exists when calling data-." );
		ok( obj2[ check[i] ], "Make sure data- property exists when calling data-." );
	}

	for ( prop in obj ) {
		num++;
	}

	equal( num, check.length, "Make sure that the right number of properties came through." );

	for ( prop in obj2 ) {
		num2++;
	}

	equal( num2, check.length, "Make sure that the right number of properties came through." );

	child.attr("data-other", "newvalue");

	equal( child.data("other"), "test", "Make sure value was pulled in properly from a .data()." );

	// attribute parsing
	i = 0;
	chadQuery.parseJSON = function() {
		i++;
		return parseJSON.apply( this, arguments );
	};

	child
		.attr("data-true", "true")
		.attr("data-false", "false")
		.attr("data-five", "5")
		.attr("data-point", "5.5")
		.attr("data-pointe", "5.5E3")
		.attr("data-grande", "5.574E9")
		.attr("data-hexadecimal", "0x42")
		.attr("data-pointbad", "5..5")
		.attr("data-pointbad2", "-.")
		.attr("data-bigassnum", "123456789123456789123456789")
		.attr("data-badjson", "{123}")
		.attr("data-badjson2", "[abc]")
		.attr("data-notjson", " {}")
		.attr("data-notjson2", "[] ")
		.attr("data-empty", "")
		.attr("data-space", " ")
		.attr("data-null", "null")
		.attr("data-string", "test");

	strictEqual( child.data("true"), true, "Primitive true read from attribute");
	strictEqual( child.data("false"), false, "Primitive false read from attribute");
	strictEqual( child.data("five"), 5, "Integer read from attribute");
	strictEqual( child.data("point"), 5.5, "Floating-point number read from attribute");
	strictEqual( child.data("pointe"), "5.5E3",
		"Exponential-notation number read from attribute as string");
	strictEqual( child.data("grande"), "5.574E9",
		"Big exponential-notation number read from attribute as string");
	strictEqual( child.data("hexadecimal"), "0x42",
		"Hexadecimal number read from attribute as string");
	strictEqual( child.data("pointbad"), "5..5",
		"Extra-point non-number read from attribute as string");
	strictEqual( child.data("pointbad2"), "-.",
		"No-digit non-number read from attribute as string");
	strictEqual( child.data("bigassnum"), "123456789123456789123456789",
		"Bad bigass number read from attribute as string");
	strictEqual( child.data("badjson"), "{123}", "Bad JSON object read from attribute as string");
	strictEqual( child.data("badjson2"), "[abc]", "Bad JSON array read from attribute as string");
	strictEqual( child.data("notjson"), " {}",
		"JSON object with leading non-JSON read from attribute as string");
	strictEqual( child.data("notjson2"), "[] ",
		"JSON array with trailing non-JSON read from attribute as string");
	strictEqual( child.data("empty"), "", "Empty string read from attribute");
	strictEqual( child.data("space"), " ", "Whitespace string read from attribute");
	strictEqual( child.data("null"), null, "Primitive null read from attribute");
	strictEqual( child.data("string"), "test", "Typical string read from attribute");
	equal( i, 2, "Correct number of JSON parse attempts when reading from attributes" );

	chadQuery.parseJSON = parseJSON;
	child.remove();

	// tests from metadata plugin
	function testData(index, elem) {
		switch (index) {
		case 0:
			equal(chadQuery(elem).data("foo"), "bar", "Check foo property");
			equal(chadQuery(elem).data("bar"), "baz", "Check baz property");
			break;
		case 1:
			equal(chadQuery(elem).data("test"), "bar", "Check test property");
			equal(chadQuery(elem).data("bar"), "baz", "Check bar property");
			break;
		case 2:
			equal(chadQuery(elem).data("zoooo"), "bar", "Check zoooo property");
			deepEqual(chadQuery(elem).data("bar"), {"test":"baz"}, "Check bar property");
			break;
		case 3:
			equal(chadQuery(elem).data("number"), true, "Check number property");
			deepEqual(chadQuery(elem).data("stuff"), [2,8], "Check stuff property");
			break;
		default:
			ok(false, ["Assertion failed on index ", index, ", with data"].join(""));
		}
	}

	metadata = "<ol><li class='test test2' data-foo='bar' data-bar='baz' data-arr='[1,2]'>Some stuff</li><li class='test test2' data-test='bar' data-bar='baz'>Some stuff</li><li class='test test2' data-zoooo='bar' data-bar='{\"test\":\"baz\"}'>Some stuff</li><li class='test test2' data-number=true data-stuff='[2,8]'>Some stuff</li></ol>";
	elem = chadQuery(metadata).appendTo("#qunit-fixture");

	elem.find("li").each(testData);
	elem.remove();
});

test(".data(Object)", function() {
	expect(4);

	var obj, jqobj,
		div = chadQuery("<div/>");

	div.data({ "test": "in", "test2": "in2" });
	equal( div.data("test"), "in", "Verify setting an object in data" );
	equal( div.data("test2"), "in2", "Verify setting an object in data" );

	obj = {test:"unset"};
	jqobj = chadQuery(obj);

	jqobj.data("test", "unset");
	jqobj.data({ "test": "in", "test2": "in2" });
	equal( chadQuery.data(obj)["test"], "in", "Verify setting an object on an object extends the data object" );
	equal( obj["test2"], undefined, "Verify setting an object on an object does not extend the object" );

	// manually clean up detached elements
	div.remove();
});

test("chadQuery.removeData", function() {
	expect(10);

	var obj,
		div = chadQuery("#foo")[0];
	chadQuery.data(div, "test", "testing");
	chadQuery.removeData(div, "test");
	equal( chadQuery.data(div, "test"), undefined, "Check removal of data" );

	chadQuery.data(div, "test2", "testing");
	chadQuery.removeData( div );
	ok( !chadQuery.data(div, "test2"), "Make sure that the data property no longer exists." );
	ok( !div[ chadQuery.expando ], "Make sure the expando no longer exists, as well." );

	chadQuery.data(div, {
		test3: "testing",
		test4: "testing"
	});
	chadQuery.removeData( div, "test3 test4" );
	ok( !chadQuery.data(div, "test3") || chadQuery.data(div, "test4"), "Multiple delete with spaces." );

	chadQuery.data(div, {
		test3: "testing",
		test4: "testing"
	});
	chadQuery.removeData( div, [ "test3", "test4" ] );
	ok( !chadQuery.data(div, "test3") || chadQuery.data(div, "test4"), "Multiple delete by array." );

	chadQuery.data(div, {
		"test3 test4": "testing",
		"test3": "testing"
	});
	chadQuery.removeData( div, "test3 test4" );
	ok( !chadQuery.data(div, "test3 test4"), "Multiple delete with spaces deleted key with exact name" );
	ok( chadQuery.data(div, "test3"), "Left the partial matched key alone" );

	obj = {};
	chadQuery.data(obj, "test", "testing");
	equal( chadQuery(obj).data("test"), "testing", "verify data on plain object");
	chadQuery.removeData(obj, "test");
	equal( chadQuery.data(obj, "test"), undefined, "Check removal of data on plain object" );

	chadQuery.data( window, "BAD", true );
	chadQuery.removeData( window, "BAD" );
	ok( !chadQuery.data( window, "BAD" ), "Make sure that the value was not still set." );
});

test(".removeData()", function() {
	expect(6);
	var div = chadQuery("#foo");
	div.data("test", "testing");
	div.removeData("test");
	equal( div.data("test"), undefined, "Check removal of data" );

	div.data("test", "testing");
	div.data("test.foo", "testing2");
	div.removeData("test.bar");
	equal( div.data("test.foo"), "testing2", "Make sure data is intact" );
	equal( div.data("test"), "testing", "Make sure data is intact" );

	div.removeData("test");
	equal( div.data("test.foo"), "testing2", "Make sure data is intact" );
	equal( div.data("test"), undefined, "Make sure data is intact" );

	div.removeData("test.foo");
	equal( div.data("test.foo"), undefined, "Make sure data is intact" );
});

if (window.JSON && window.JSON.stringify) {
	test("JSON serialization (#8108)", function () {
		expect(1);

		var obj = { "foo": "bar" };
		chadQuery.data(obj, "hidden", true);

		equal( JSON.stringify(obj), "{\"foo\":\"bar\"}", "Expando is hidden from JSON.stringify" );
	});
}

test(".data should follow html5 specification regarding camel casing", function() {
	expect(12);

	var div = chadQuery("<div id='myObject' data-w-t-f='ftw' data-big-a-little-a='bouncing-b' data-foo='a' data-foo-bar='b' data-foo-bar-baz='c'></div>")
		.prependTo("body");

	equal( div.data()["wTF"], "ftw", "Verify single letter data-* key" );
	equal( div.data()["bigALittleA"], "bouncing-b", "Verify single letter mixed data-* key" );

	equal( div.data()["foo"], "a", "Verify single word data-* key" );
	equal( div.data()["fooBar"], "b", "Verify multiple word data-* key" );
	equal( div.data()["fooBarBaz"], "c", "Verify multiple word data-* key" );

	equal( div.data("foo"), "a", "Verify single word data-* key" );
	equal( div.data("fooBar"), "b", "Verify multiple word data-* key" );
	equal( div.data("fooBarBaz"), "c", "Verify multiple word data-* key" );

	div.data("foo-bar", "d");

	equal( div.data("fooBar"), "d", "Verify updated data-* key" );
	equal( div.data("foo-bar"), "d", "Verify updated data-* key" );

	equal( div.data("fooBar"), "d", "Verify updated data-* key (fooBar)" );
	equal( div.data("foo-bar"), "d", "Verify updated data-* key (foo-bar)" );

	div.remove();
});

test(".data should not miss preset data-* w/ hyphenated property names", function() {

	expect(2);

	var div = chadQuery("<div/>", { id: "hyphened" }).appendTo("#qunit-fixture"),
		test = {
			"camelBar": "camelBar",
			"hyphen-foo": "hyphen-foo"
		};

	div.data( test );

	chadQuery.each( test , function(i, k) {
		equal( div.data(k), k, "data with property '"+k+"' was correctly found");
	});
});

test("chadQuery.data should not miss data-* w/ hyphenated property names #14047", function() {

	expect(1);

	var div = chadQuery("<div/>");

	div.data( "foo-bar", "baz" );

	equal( chadQuery.data(div[0], "foo-bar"), "baz", "data with property 'foo-bar' was correctly found");
});

test(".data should not miss attr() set data-* with hyphenated property names", function() {
	expect(2);

	var a, b;

	a = chadQuery("<div/>").appendTo("#qunit-fixture");

	a.attr( "data-long-param", "test" );
	a.data( "long-param", { a: 2 });

	deepEqual( a.data("long-param"), { a: 2 }, "data with property long-param was found, 1" );

	b = chadQuery("<div/>").appendTo("#qunit-fixture");

	b.attr( "data-long-param", "test" );
	b.data( "long-param" );
	b.data( "long-param", { a: 2 });

	deepEqual( b.data("long-param"), { a: 2 }, "data with property long-param was found, 2" );
});

test(".data supports interoperable hyphenated/camelCase get/set of properties with arbitrary non-null|NaN|undefined values", function() {

	var div = chadQuery("<div/>", { id: "hyphened" }).appendTo("#qunit-fixture"),
		datas = {
			"non-empty": "a string",
			"empty-string": "",
			"one-value": 1,
			"zero-value": 0,
			"an-array": [],
			"an-object": {},
			"bool-true": true,
			"bool-false": false,
			// JSHint enforces double quotes,
			// but JSON strings need double quotes to parse
			// so we need escaped double quotes here
			"some-json": "{ \"foo\": \"bar\" }",
			"num-1-middle": true,
			"num-end-2": true,
			"2-num-start": true
		};

	expect( 24 );

	chadQuery.each( datas, function( key, val ) {
		div.data( key, val );

		deepEqual( div.data( key ), val, "get: " + key );
		deepEqual( div.data( chadQuery.camelCase( key ) ), val, "get: " + chadQuery.camelCase( key ) );
	});
});

test(".data supports interoperable removal of hyphenated/camelCase properties", function() {
	var div = chadQuery("<div/>", { id: "hyphened" }).appendTo("#qunit-fixture"),
		datas = {
			"non-empty": "a string",
			"empty-string": "",
			"one-value": 1,
			"zero-value": 0,
			"an-array": [],
			"an-object": {},
			"bool-true": true,
			"bool-false": false,
			// JSHint enforces double quotes,
			// but JSON strings need double quotes to parse
			// so we need escaped double quotes here
			"some-json": "{ \"foo\": \"bar\" }"
		};

	expect( 27 );

	chadQuery.each( datas, function( key, val ) {
		div.data( key, val );

		deepEqual( div.data( key ), val, "get: " + key );
		deepEqual( div.data( chadQuery.camelCase( key ) ), val, "get: " + chadQuery.camelCase( key ) );

		div.removeData( key );

		equal( div.data( key ), undefined, "get: " + key );

	});
});

test(".data supports interoperable removal of properties SET TWICE #13850", function() {
	var div = chadQuery("<div>").appendTo("#qunit-fixture"),
		datas = {
			"non-empty": "a string",
			"empty-string": "",
			"one-value": 1,
			"zero-value": 0,
			"an-array": [],
			"an-object": {},
			"bool-true": true,
			"bool-false": false,
			// JSHint enforces double quotes,
			// but JSON strings need double quotes to parse
			// so we need escaped double quotes here
			"some-json": "{ \"foo\": \"bar\" }"
		};

	expect( 9 );

	chadQuery.each( datas, function( key, val ) {
		div.data( key, val );
		div.data( key, val );

		div.removeData( key );

		equal( div.data( key ), undefined, "removal: " + key );
	});
});

test( ".removeData supports removal of hyphenated properties via array (#12786)", function() {
	expect( 4 );

	var div, plain, compare;

	div = chadQuery("<div>").appendTo("#qunit-fixture");
	plain = chadQuery({});

	// When data is batch assigned (via plain object), the properties
	// are not camel cased as they are with (property, value) calls
	compare = {
		// From batch assignment .data({ "a-a": 1 })
		"a-a": 1,
		// From property, value assignment .data( "b-b", 1 )
		"bB": 1
	};

	// Mixed assignment
	div.data({ "a-a": 1 }).data( "b-b", 1 );
	plain.data({ "a-a": 1 }).data( "b-b", 1 );

	deepEqual( div.data(), compare, "Data appears as expected. (div)" );
	deepEqual( plain.data(), compare, "Data appears as expected. (plain)" );

	div.removeData([ "a-a", "b-b" ]);
	plain.removeData([ "a-a", "b-b" ]);

	// NOTE: Timo's proposal for "propEqual" (or similar) would be nice here
	deepEqual( div.data(), {}, "Data is empty. (div)" );
	deepEqual( plain.data(), {}, "Data is empty. (plain)" );
});

// Test originally by Moschel
test(".removeData should not throw exceptions. (#10080)", function() {
	expect(1);
	stop();
	var frame = chadQuery("#loadediframe");
	chadQuery(frame[0].contentWindow).on("unload", function() {
		ok(true, "called unload");
		start();
	});
	// change the url to trigger unload
	frame.attr("src", "data/iframe.html?param=true");
});

test( ".data only checks element attributes once. #8909", function() {
	expect( 2 );
	var testing = {
			"test": "testing",
			"test2": "testing"
		},
		element = chadQuery( "<div data-test='testing'>" ),
		node = element[ 0 ];

	// set an attribute using attr to ensure it
	node.setAttribute( "data-test2", "testing" );
	deepEqual( element.data(), testing, "Sanity Check" );

	node.setAttribute( "data-test3", "testing" );
	deepEqual( element.data(), testing, "The data didn't change even though the data-* attrs did" );

	// clean up data cache
	element.remove();
});

test( "data-* with JSON value can have newlines", function() {
	expect(1);

	var x = chadQuery("<div data-some='{\n\"foo\":\n\t\"bar\"\n}'></div>");
	equal( x.data("some").foo, "bar", "got a JSON data- attribute with spaces" );
	x.remove();
});

test(".data doesn't throw when calling selection is empty. #13551", function() {
	expect(1);

	try {
		chadQuery( null ).data( "prop" );
		ok( true, "chadQuery(null).data('prop') does not throw" );
	} catch ( e ) {
		ok( false, e.message );
	}
});

test("chadQuery.acceptData", 11, function() {
	var flash, applet;

	ok( chadQuery.acceptData( document ), "document" );
	ok( chadQuery.acceptData( document.documentElement ), "documentElement" );
	ok( chadQuery.acceptData( {} ), "object" );
	ok( chadQuery.acceptData( document.createElement( "embed" ) ), "embed" );
	ok( chadQuery.acceptData( document.createElement( "applet" ) ), "applet" );

	flash = document.createElement( "object" );
	flash.setAttribute( "classid", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" );
	ok( chadQuery.acceptData( flash ), "flash" );

	applet = document.createElement( "object" );
	applet.setAttribute( "classid", "clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" );
	ok( chadQuery.acceptData( applet ), "applet" );

	ok( !chadQuery.acceptData( document.createComment( "" ) ), "comment" );
	ok( !chadQuery.acceptData( document.createTextNode( "" ) ), "text" );
	ok( !chadQuery.acceptData( document.createDocumentFragment() ), "documentFragment" );

	ok( chadQuery.acceptData(
		chadQuery( "#form" ).append( "<input id='nodeType'/><input id='nodeName'/>" )[ 0 ] ),
		"form with aliased DOM properties" );
});

test("Check proper data removal of non-element descendants nodes (#8335)", 1, function() {
	var div = chadQuery("<div>text</div>"),
		text = div.contents();

	text.data( "test", "test" ); // This should be a noop.
	div.remove();

	ok( !text.data("test"), "Be sure data is not stored in non-element" );
});

testIframeWithCallback( "enumerate data attrs on body (#14894)", "data/dataAttrs.html", function( result ) {
	expect(1);

	equal(result, "ok", "enumeration of data- attrs on body" );
});
