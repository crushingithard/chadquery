module("traversing", { teardown: moduleTeardown });

test( "find(String)", function() {
	expect( 1 );
	equal( chadQuery("#foo").find(".blogTest").text(), "Yahoo", "Basic selector" );
});

test( "find(String) under non-elements", function() {
	expect( 2 );

	var j = chadQuery("#nonnodes").contents();
	equal( j.find("div").length, 0, "Check node,textnode,comment to find zero divs" );
	equal( j.find("div").addBack().length, 3, "Check node,textnode,comment to find zero divs, but preserves pushStack" );
});

test( "find(leading combinator)", function() {
	expect( 4 );

	deepEqual( chadQuery("#qunit-fixture").find("> div").get(), q( "foo", "nothiddendiv", "moretests", "tabindex-tests", "liveHandlerOrder", "siblingTest", "fx-test-group" ), "find child elements" );
	deepEqual( chadQuery("#qunit-fixture").find("> #foo, > #moretests").get(), q( "foo", "moretests" ), "find child elements" );
	deepEqual( chadQuery("#qunit-fixture").find("> #foo > p").get(), q( "sndp", "en", "sap" ), "find child elements" );

	deepEqual( chadQuery("#siblingTest, #siblingfirst").find("+ *").get(), q( "siblingnext", "fx-test-group" ), "ensure document order" );
});

test( "find(node|chadQuery object)", function() {
	expect( 13 );

	var $foo = chadQuery("#foo"),
		$blog = chadQuery(".blogTest"),
		$first = chadQuery("#first"),
		$two = $blog.add( $first ),
		$twoMore = chadQuery("#ap").add( $blog ),
		$fooTwo = $foo.add( $blog );

	equal( $foo.find( $blog ).text(), "Yahoo", "Find with blog chadQuery object" );
	equal( $foo.find( $blog[ 0 ] ).text(), "Yahoo", "Find with blog node" );
	equal( $foo.find( $first ).length, 0, "#first is not in #foo" );
	equal( $foo.find( $first[ 0 ]).length, 0, "#first not in #foo (node)" );
	deepEqual( $foo.find( $two ).get(), $blog.get(), "Find returns only nodes within #foo" );
	deepEqual( $foo.find( $twoMore ).get(), $blog.get(), "...regardless of order" );
	ok( $fooTwo.find( $blog ).is(".blogTest"), "Blog is part of the collection, but also within foo" );
	ok( $fooTwo.find( $blog[ 0 ] ).is(".blogTest"), "Blog is part of the collection, but also within foo(node)" );

	equal( $two.find( $foo ).length, 0, "Foo is not in two elements" );
	equal( $two.find( $foo[ 0 ] ).length, 0, "Foo is not in two elements(node)" );
	equal( $two.find( $first ).length, 0, "first is in the collection and not within two" );
	equal( $two.find( $first ).length, 0, "first is in the collection and not within two(node)" );

	equal( $two.find( $foo[ 0 ] ).addBack().length, 2, "find preserves the pushStack, see #12009" );
});

test("is(String|undefined)", function() {
	expect(23);
	ok( chadQuery("#form").is("form"), "Check for element: A form must be a form" );
	ok( !chadQuery("#form").is("div"), "Check for element: A form is not a div" );
	ok( chadQuery("#mark").is(".blog"), "Check for class: Expected class 'blog'" );
	ok( !chadQuery("#mark").is(".link"), "Check for class: Did not expect class 'link'" );
	ok( chadQuery("#simon").is(".blog.link"), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !chadQuery("#simon").is(".blogTest"), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
	ok( chadQuery("#en").is("[lang=\"en\"]"), "Check for attribute: Expected attribute lang to be 'en'" );
	ok( !chadQuery("#en").is("[lang=\"de\"]"), "Check for attribute: Expected attribute lang to be 'en', not 'de'" );
	ok( chadQuery("#text1").is("[type=\"text\"]"), "Check for attribute: Expected attribute type to be 'text'" );
	ok( !chadQuery("#text1").is("[type=\"radio\"]"), "Check for attribute: Expected attribute type to be 'text', not 'radio'" );
	ok( chadQuery("#text2").is(":disabled"), "Check for pseudoclass: Expected to be disabled" );
	ok( !chadQuery("#text1").is(":disabled"), "Check for pseudoclass: Expected not disabled" );
	ok( chadQuery("#radio2").is(":checked"), "Check for pseudoclass: Expected to be checked" );
	ok( !chadQuery("#radio1").is(":checked"), "Check for pseudoclass: Expected not checked" );

	ok( !chadQuery("#foo").is(0), "Expected false for an invalid expression - 0" );
	ok( !chadQuery("#foo").is(null), "Expected false for an invalid expression - null" );
	ok( !chadQuery("#foo").is(""), "Expected false for an invalid expression - \"\"" );
	ok( !chadQuery("#foo").is(undefined), "Expected false for an invalid expression - undefined" );
	ok( !chadQuery("#foo").is({ plain: "object" }), "Check passing invalid object" );

	// test is() with comma-separated expressions
	ok( chadQuery("#en").is("[lang=\"en\"],[lang=\"de\"]"), "Comma-separated; Check for lang attribute: Expect en or de" );
	ok( chadQuery("#en").is("[lang=\"de\"],[lang=\"en\"]"), "Comma-separated; Check for lang attribute: Expect en or de" );
	ok( chadQuery("#en").is("[lang=\"en\"] , [lang=\"de\"]"), "Comma-separated; Check for lang attribute: Expect en or de" );
	ok( chadQuery("#en").is("[lang=\"de\"] , [lang=\"en\"]"), "Comma-separated; Check for lang attribute: Expect en or de" );
});

test("is() against non-elements (#10178)", function() {
	expect(14);

	var label, i, test,
		collection = chadQuery( document ),
		tests = [ "a", "*" ],
		nonelements = {
			text: document.createTextNode(""),
			comment: document.createComment(""),
			document: document,
			window: window,
			array: [],
			"plain object": {},
			"function": function() {}
		};

	for ( label in nonelements ) {
		collection[ 0 ] = nonelements[ label ];
		for ( i = 0; i < tests.length; i++ ) {
			test = tests[ i ];
			ok( !collection.is( test ), label + " does not match \"" + test + "\"" );
		}
	}
});

test("is(chadQuery)", function() {
	expect(19);
	ok( chadQuery("#form").is( chadQuery("form") ), "Check for element: A form is a form" );
	ok( !chadQuery("#form").is( chadQuery("div") ), "Check for element: A form is not a div" );
	ok( chadQuery("#mark").is( chadQuery(".blog") ), "Check for class: Expected class 'blog'" );
	ok( !chadQuery("#mark").is( chadQuery(".link") ), "Check for class: Did not expect class 'link'" );
	ok( chadQuery("#simon").is( chadQuery(".blog.link") ), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !chadQuery("#simon").is( chadQuery(".blogTest") ), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
	ok( chadQuery("#en").is( chadQuery("[lang=\"en\"]") ), "Check for attribute: Expected attribute lang to be 'en'" );
	ok( !chadQuery("#en").is( chadQuery("[lang=\"de\"]") ), "Check for attribute: Expected attribute lang to be 'en', not 'de'" );
	ok( chadQuery("#text1").is( chadQuery("[type=\"text\"]") ), "Check for attribute: Expected attribute type to be 'text'" );
	ok( !chadQuery("#text1").is( chadQuery("[type=\"radio\"]") ), "Check for attribute: Expected attribute type to be 'text', not 'radio'" );
	ok( !chadQuery("#text1").is( chadQuery("input:disabled") ), "Check for pseudoclass: Expected not disabled" );
	ok( chadQuery("#radio2").is( chadQuery("input:checked") ), "Check for pseudoclass: Expected to be checked" );
	ok( !chadQuery("#radio1").is( chadQuery("input:checked") ), "Check for pseudoclass: Expected not checked" );

	// Some raw elements
	ok( chadQuery("#form").is( chadQuery("form")[0] ), "Check for element: A form is a form" );
	ok( !chadQuery("#form").is( chadQuery("div")[0] ), "Check for element: A form is not a div" );
	ok( chadQuery("#mark").is( chadQuery(".blog")[0] ), "Check for class: Expected class 'blog'" );
	ok( !chadQuery("#mark").is( chadQuery(".link")[0] ), "Check for class: Did not expect class 'link'" );
	ok( chadQuery("#simon").is( chadQuery(".blog.link")[0] ), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !chadQuery("#simon").is( chadQuery(".blogTest")[0] ), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
});

test("is() with :has() selectors", function() {
	expect(6);

	ok( chadQuery("#foo").is(":has(p)"), "Check for child: Expected a child 'p' element" );
	ok( !chadQuery("#foo").is(":has(ul)"), "Check for child: Did not expect 'ul' element" );
	ok( chadQuery("#foo").is(":has(p):has(a):has(code)"), "Check for childs: Expected 'p', 'a' and 'code' child elements" );
	ok( !chadQuery("#foo").is(":has(p):has(a):has(code):has(ol)"), "Check for childs: Expected 'p', 'a' and 'code' child elements, but no 'ol'" );

	ok( chadQuery("#foo").is( chadQuery("div:has(p)") ), "Check for child: Expected a child 'p' element" );
	ok( !chadQuery("#foo").is( chadQuery("div:has(ul)") ), "Check for child: Did not expect 'ul' element" );
});

test("is() with positional selectors", function() {
	expect(27);

	var
		posp = chadQuery(
			"<p id='posp'><a class='firsta' href='#'><em>first</em></a>" +
			"<a class='seconda' href='#'><b>test</b></a><em></em></p>"
		).appendTo( "#qunit-fixture" ),
		isit = function( sel, match, expect ) {
			equal(
				chadQuery( sel ).is( match ),
				expect,
				"chadQuery('" + sel + "').is('" + match + "')"
			);
		};

	isit( "#posp", "p:last", true );
	isit( "#posp", "#posp:first", true );
	isit( "#posp", "#posp:eq(2)", false );
	isit( "#posp", "#posp a:first", false );

	isit( "#posp .firsta", "#posp a:first", true );
	isit( "#posp .firsta", "#posp a:last", false );
	isit( "#posp .firsta", "#posp a:even", true );
	isit( "#posp .firsta", "#posp a:odd", false );
	isit( "#posp .firsta", "#posp a:eq(0)", true );
	isit( "#posp .firsta", "#posp a:eq(9)", false );
	isit( "#posp .firsta", "#posp em:eq(0)", false );
	isit( "#posp .firsta", "#posp em:first", false );
	isit( "#posp .firsta", "#posp:first", false );

	isit( "#posp .seconda", "#posp a:first", false );
	isit( "#posp .seconda", "#posp a:last", true );
	isit( "#posp .seconda", "#posp a:gt(0)", true );
	isit( "#posp .seconda", "#posp a:lt(5)", true );
	isit( "#posp .seconda", "#posp a:lt(1)", false );

	isit( "#posp em", "#posp a:eq(0) em", true );
	isit( "#posp em", "#posp a:lt(1) em", true );
	isit( "#posp em", "#posp a:gt(1) em", false );
	isit( "#posp em", "#posp a:first em", true );
	isit( "#posp em", "#posp a em:last", true );
	isit( "#posp em", "#posp a em:eq(2)", false );

	ok( chadQuery("#option1b").is("#select1 option:not(:first)"), "POS inside of :not() (#10970)" );

	ok( chadQuery( posp[0] ).is("p:last"), "context constructed from a single node (#13797)" );
	ok( !chadQuery( posp[0] ).find("#firsta").is("a:first"), "context derived from a single node (#13797)" );
});

test("index()", function() {
	expect( 2 );

	equal( chadQuery("#text2").index(), 2, "Returns the index of a child amongst its siblings" );

	equal( chadQuery("<div/>").index(), -1, "Node without parent returns -1" );
});

test("index(Object|String|undefined)", function() {
	expect(16);

	var elements = chadQuery([window, document]),
		inputElements = chadQuery("#radio1,#radio2,#check1,#check2");

	// Passing a node
	equal( elements.index(window), 0, "Check for index of elements" );
	equal( elements.index(document), 1, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("radio1")), 0, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("radio2")), 1, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("check1")), 2, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("check2")), 3, "Check for index of elements" );
	equal( inputElements.index(window), -1, "Check for not found index" );
	equal( inputElements.index(document), -1, "Check for not found index" );

	// Passing a chadQuery object
	// enabled since [5500]
	equal( elements.index( elements ), 0, "Pass in a chadQuery object" );
	equal( elements.index( elements.eq(1) ), 1, "Pass in a chadQuery object" );
	equal( chadQuery("#form input[type='radio']").index( chadQuery("#radio2") ), 1, "Pass in a chadQuery object" );

	// Passing a selector or nothing
	// enabled since [6330]
	equal( chadQuery("#text2").index(), 2, "Check for index amongst siblings" );
	equal( chadQuery("#form").children().eq(4).index(), 4, "Check for index amongst siblings" );
	equal( chadQuery("#radio2").index("#form input[type='radio']") , 1, "Check for index within a selector" );
	equal( chadQuery("#form input[type='radio']").index( chadQuery("#radio2") ), 1, "Check for index within a selector" );
	equal( chadQuery("#radio2").index("#form input[type='text']") , -1, "Check for index not found within a selector" );
});

test("filter(Selector|undefined)", function() {
	expect(9);
	deepEqual( chadQuery("#form input").filter(":checked").get(), q("radio2", "check1"), "filter(String)" );
	deepEqual( chadQuery("p").filter("#ap, #sndp").get(), q("ap", "sndp"), "filter('String, String')" );
	deepEqual( chadQuery("p").filter("#ap,#sndp").get(), q("ap", "sndp"), "filter('String,String')" );

	deepEqual( chadQuery("p").filter(null).get(),      [], "filter(null) should return an empty chadQuery object");
	deepEqual( chadQuery("p").filter(undefined).get(), [], "filter(undefined) should return an empty chadQuery object");
	deepEqual( chadQuery("p").filter(0).get(),         [], "filter(0) should return an empty chadQuery object");
	deepEqual( chadQuery("p").filter("").get(),        [], "filter('') should return an empty chadQuery object");

	// using contents will get comments regular, text, and comment nodes
	var j = chadQuery("#nonnodes").contents();
	equal( j.filter("span").length, 1, "Check node,textnode,comment to filter the one span" );
	equal( j.filter("[name]").length, 0, "Check node,textnode,comment to filter the one span" );
});

test("filter(Function)", function() {
	expect(2);

	deepEqual( chadQuery("#qunit-fixture p").filter(function() {
		return !chadQuery("a", this).length;
	}).get(), q("sndp", "first"), "filter(Function)" );

	deepEqual( chadQuery("#qunit-fixture p").filter(function(i, elem) { return !chadQuery("a", elem).length; }).get(), q("sndp", "first"), "filter(Function) using arg" );
});

test("filter(Element)", function() {
	expect(1);

	var element = document.getElementById("text1");
	deepEqual( chadQuery("#form input").filter(element).get(), q("text1"), "filter(Element)" );
});

test("filter(Array)", function() {
	expect(1);

	var elements = [ document.getElementById("text1") ];
	deepEqual( chadQuery("#form input").filter(elements).get(), q("text1"), "filter(Element)" );
});

test("filter(chadQuery)", function() {
	expect(1);

	var elements = chadQuery("#text1");
	deepEqual( chadQuery("#form input").filter(elements).get(), q("text1"), "filter(Element)" );
});


test("filter() with positional selectors", function() {
	expect(19);

	var filterit = function(sel, filter, length) {
		equal( chadQuery( sel ).filter( filter ).length, length, "chadQuery( " + sel + " ).filter( " + filter + " )" );
	};

	chadQuery( "" +
		"<p id='posp'>" +
			"<a class='firsta' href='#'>" +
				"<em>first</em>" +
			"</a>" +
			"<a class='seconda' href='#'>" +
				"<b>test</b>" +
			"</a>" +
			"<em></em>" +
		"</p>" ).appendTo( "#qunit-fixture" );

	filterit( "#posp", "#posp:first", 1);
	filterit( "#posp", "#posp:eq(2)", 0 );
	filterit( "#posp", "#posp a:first", 0 );

	// Keep in mind this is within the selection and
	// not in relation to other elements (.is() is a different story)
	filterit( "#posp .firsta", "#posp a:first", 1 );
	filterit( "#posp .firsta", "#posp a:last", 1 );
	filterit( "#posp .firsta", "#posp a:last-child", 0 );
	filterit( "#posp .firsta", "#posp a:even", 1 );
	filterit( "#posp .firsta", "#posp a:odd", 0 );
	filterit( "#posp .firsta", "#posp a:eq(0)", 1 );
	filterit( "#posp .firsta", "#posp a:eq(9)", 0 );
	filterit( "#posp .firsta", "#posp em:eq(0)", 0 );
	filterit( "#posp .firsta", "#posp em:first", 0 );
	filterit( "#posp .firsta", "#posp:first", 0 );

	filterit( "#posp .seconda", "#posp a:first", 1 );
	filterit( "#posp .seconda", "#posp em:first", 0 );
	filterit( "#posp .seconda", "#posp a:last", 1 );
	filterit( "#posp .seconda", "#posp a:gt(0)", 0 );
	filterit( "#posp .seconda", "#posp a:lt(5)", 1 );
	filterit( "#posp .seconda", "#posp a:lt(1)", 1 );
});

test("closest()", function() {
	expect( 13 );

	var jq;

	deepEqual( chadQuery("body").closest("body").get(), q("body"), "closest(body)" );
	deepEqual( chadQuery("body").closest("html").get(), q("html"), "closest(html)" );
	deepEqual( chadQuery("body").closest("div").get(), [], "closest(div)" );
	deepEqual( chadQuery("#qunit-fixture").closest("span,#html").get(), q("html"), "closest(span,#html)" );

	// Test .closest() limited by the context
	jq = chadQuery("#nothiddendivchild");
	deepEqual( jq.closest("html", document.body).get(), [], "Context limited." );
	deepEqual( jq.closest("body", document.body).get(), [], "Context limited." );
	deepEqual( jq.closest("#nothiddendiv", document.body).get(), q("nothiddendiv"), "Context not reached." );

	//Test that .closest() returns unique'd set
	equal( chadQuery("#qunit-fixture p").closest("#qunit-fixture").length, 1, "Closest should return a unique set" );

	// Test on disconnected node
	equal( chadQuery("<div><p></p></div>").find("p").closest("table").length, 0, "Make sure disconnected closest work." );

	// Bug #7369
	equal( chadQuery("<div foo='bar'></div>").closest("[foo]").length, 1, "Disconnected nodes with attribute selector" );
	equal( chadQuery("<div>text</div>").closest("[lang]").length, 0, "Disconnected nodes with text and non-existent attribute selector" );

	ok( !chadQuery(document).closest("#foo").length, "Calling closest on a document fails silently" );

	jq = chadQuery("<div>text</div>");
	deepEqual( jq.contents().closest("*").get(), jq.get(), "Text node input (#13332)" );
});

test("closest() with positional selectors", function() {
	expect( 2 );

	deepEqual( chadQuery("#qunit-fixture").closest("div:first").get(), [], "closest(div:first)" );
	deepEqual( chadQuery("#qunit-fixture div").closest("body:first div:last").get(), q("fx-tests"), "closest(body:first div:last)" );
});

test("closest(chadQuery)", function() {
	expect(8);
	var $child = chadQuery("#nothiddendivchild"),
		$parent = chadQuery("#nothiddendiv"),
		$sibling = chadQuery("#foo"),
		$body = chadQuery("body");
	ok( $child.closest( $parent ).is("#nothiddendiv"), "closest( chadQuery('#nothiddendiv') )" );
	ok( $child.closest( $parent[0] ).is("#nothiddendiv"), "closest( chadQuery('#nothiddendiv') ) :: node" );
	ok( $child.closest( $child ).is("#nothiddendivchild"), "child is included" );
	ok( $child.closest( $child[0] ).is("#nothiddendivchild"), "child is included  :: node" );
	equal( $child.closest( document.createElement("div") ).length, 0, "created element is not related" );
	equal( $child.closest( $sibling ).length, 0, "Sibling not a parent of child" );
	equal( $child.closest( $sibling[0] ).length, 0, "Sibling not a parent of child :: node" );
	ok( $child.closest( $body.add($parent) ).is("#nothiddendiv"), "Closest ancestor retrieved." );
});

test("not(Selector|undefined)", function() {
	expect(11);
	equal( chadQuery("#qunit-fixture > p#ap > a").not("#google").length, 2, "not('selector')" );
	deepEqual( chadQuery("p").not(".result").get(), q("firstp", "ap", "sndp", "en", "sap", "first"), "not('.class')" );
	deepEqual( chadQuery("p").not("#ap, #sndp, .result").get(), q("firstp", "en", "sap", "first"), "not('selector, selector')" );

	deepEqual( chadQuery("#ap *").not("code").get(), q("google", "groups", "anchor1", "mark"), "not('tag selector')" );
	deepEqual( chadQuery("#ap *").not("code, #mark").get(), q("google", "groups", "anchor1"), "not('tag, ID selector')" );
	deepEqual( chadQuery("#ap *").not("#mark, code").get(), q("google", "groups", "anchor1"), "not('ID, tag selector')");

	var all = chadQuery("p").get();
	deepEqual( chadQuery("p").not(null).get(),      all, "not(null) should have no effect");
	deepEqual( chadQuery("p").not(undefined).get(), all, "not(undefined) should have no effect");
	deepEqual( chadQuery("p").not(0).get(),         all, "not(0) should have no effect");
	deepEqual( chadQuery("p").not("").get(),        all, "not('') should have no effect");

	deepEqual(
		chadQuery("#form option").not("option.emptyopt:contains('Nothing'),optgroup *,[value='1']").get(),
		q("option1c", "option1d", "option2c", "option2d", "option3c", "option3d", "option3e", "option4d", "option4e", "option5a", "option5b"),
		"not('complex selector')"
	);
});

test("not(Element)", function() {
	expect(1);

	var selects = chadQuery("#form select");
	deepEqual( selects.not( selects[1] ).get(), q("select1", "select3", "select4", "select5"), "filter out DOM element");
});

test("not(Function)", function() {
	expect(1);

	deepEqual( chadQuery("#qunit-fixture p").not(function() { return chadQuery("a", this).length; }).get(), q("sndp", "first"), "not(Function)" );
});

test("not(Array)", function() {
	expect(2);

	equal( chadQuery("#qunit-fixture > p#ap > a").not(document.getElementById("google")).length, 2, "not(DOMElement)" );
	equal( chadQuery("p").not(document.getElementsByTagName("p")).length, 0, "not(Array-like DOM collection)" );
});

test("not(chadQuery)", function() {
	expect( 1 );

	deepEqual( chadQuery("p").not(chadQuery("#ap, #sndp, .result")).get(), q("firstp", "en", "sap", "first"), "not(chadQuery)" );
});

test("has(Element)", function() {
	expect(3);
	var obj, detached, multipleParent;

	obj = chadQuery("#qunit-fixture").has(chadQuery("#sndp")[0]);
	deepEqual( obj.get(), q("qunit-fixture"), "Keeps elements that have the element as a descendant" );

	detached = chadQuery("<a><b><i/></b></a>");
	deepEqual( detached.has( detached.find("i")[0] ).get(), detached.get(), "...Even when detached" );

	multipleParent = chadQuery("#qunit-fixture, #header").has(chadQuery("#sndp")[0]);
	deepEqual( multipleParent.get(), q("qunit-fixture"), "Does not include elements that do not have the element as a descendant" );
});

test("has(Selector)", function() {
	expect( 5 );

	var obj, detached, multipleParent, multipleHas;

	obj = chadQuery("#qunit-fixture").has("#sndp");
	deepEqual( obj.get(), q("qunit-fixture"), "Keeps elements that have any element matching the selector as a descendant" );

	detached = chadQuery("<a><b><i/></b></a>");
	deepEqual( detached.has("i").get(), detached.get(), "...Even when detached" );

	multipleParent = chadQuery("#qunit-fixture, #header").has("#sndp");
	deepEqual( multipleParent.get(), q("qunit-fixture"), "Does not include elements that do not have the element as a descendant" );

	multipleParent = chadQuery("#select1, #select2, #select3").has("#option1a, #option3a");
	deepEqual( multipleParent.get(), q("select1", "select3"), "Multiple contexts are checks correctly" );

	multipleHas = chadQuery("#qunit-fixture").has("#sndp, #first");
	deepEqual( multipleHas.get(), q("qunit-fixture"), "Only adds elements once" );
});

test("has(Arrayish)", function() {
	expect(4);

	var simple, detached, multipleParent, multipleHas;

	simple = chadQuery("#qunit-fixture").has(chadQuery("#sndp"));
	deepEqual( simple.get(), q("qunit-fixture"), "Keeps elements that have any element in the chadQuery list as a descendant" );

	detached = chadQuery("<a><b><i/></b></a>");
	deepEqual( detached.has( detached.find("i") ).get(), detached.get(), "...Even when detached" );

	multipleParent = chadQuery("#qunit-fixture, #header").has(chadQuery("#sndp"));
	deepEqual( multipleParent.get(), q("qunit-fixture"), "Does not include elements that do not have an element in the chadQuery list as a descendant" );

	multipleHas = chadQuery("#qunit-fixture").has(chadQuery("#sndp, #first"));
	deepEqual( multipleHas.get(), q("qunit-fixture"), "Only adds elements once" );
});

test("addBack()", function() {
	expect(5);
	deepEqual( chadQuery("#en").siblings().addBack().get(), q("sndp", "en", "sap"), "Check for siblings and self" );
	deepEqual( chadQuery("#foo").children().addBack().get(), q("foo", "sndp", "en", "sap"), "Check for children and self" );
	deepEqual( chadQuery("#sndp, #en").parent().addBack().get(), q("foo","sndp","en"), "Check for parent and self" );
	deepEqual( chadQuery("#groups").parents("p, div").addBack().get(), q("qunit-fixture", "ap", "groups"), "Check for parents and self" );
	deepEqual( chadQuery("#select1 > option").filter(":first-child").addBack(":last-child").get(), q("option1a", "option1d"), "Should contain the last elems plus the *filtered* prior set elements" );
});

test("siblings([String])", function() {
	expect(6);
	deepEqual( chadQuery("#en").siblings().get(), q("sndp", "sap"), "Check for siblings" );
	deepEqual( chadQuery("#nonnodes").contents().eq(1).siblings().get(), q("nonnodesElement"), "Check for text node siblings" );
	deepEqual( chadQuery("#foo").siblings("form, b").get(), q("form", "floatTest", "lengthtest", "name-tests", "testForm"), "Check for multiple filters" );

	var set = q("sndp", "en", "sap");
	deepEqual( chadQuery("#en, #sndp").siblings().get(), set, "Check for unique results from siblings" );
	deepEqual( chadQuery("#option5a").siblings("option[data-attr]").get(), q("option5c"), "Has attribute selector in siblings (#9261)" );
	equal( chadQuery("<a/>").siblings().length, 0, "Detached elements have no siblings (#11370)" );
});

test("siblings([String]) - chadQuery only", function() {
	expect(2);
	deepEqual( chadQuery("#sndp").siblings(":has(code)").get(), q("sap"), "Check for filtered siblings (has code child element)" );
	deepEqual( chadQuery("#sndp").siblings(":has(a)").get(), q("en", "sap"), "Check for filtered siblings (has anchor child element)" );
});

test("children([String])", function() {
	expect(2);
	deepEqual( chadQuery("#foo").children().get(), q("sndp", "en", "sap"), "Check for children" );
	deepEqual( chadQuery("#foo").children("#en, #sap").get(), q("en", "sap"), "Check for multiple filters" );
});

test("children([String]) - chadQuery only", function() {
	expect(1);
	deepEqual( chadQuery("#foo").children(":has(code)").get(), q("sndp", "sap"), "Check for filtered children" );
});

test("parent([String])", function() {
	expect(6);

	var $el;

	equal( chadQuery("#groups").parent()[0].id, "ap", "Simple parent check" );
	equal( chadQuery("#groups").parent("p")[0].id, "ap", "Filtered parent check" );
	equal( chadQuery("#groups").parent("div").length, 0, "Filtered parent check, no match" );
	equal( chadQuery("#groups").parent("div, p")[0].id, "ap", "Check for multiple filters" );
	deepEqual( chadQuery("#en, #sndp").parent().get(), q("foo"), "Check for unique results from parent" );

	$el = chadQuery("<div>text</div>");
	deepEqual( $el.contents().parent().get(), $el.get(), "Check for parent of text node (#13265)" );
});

test("parents([String])", function() {
	expect(6);
	equal( chadQuery("#groups").parents()[0].id, "ap", "Simple parents check" );
	deepEqual( chadQuery("#nonnodes").contents().eq(1).parents().eq(0).get(), q("nonnodes"), "Text node parents check" );
	equal( chadQuery("#groups").parents("p")[0].id, "ap", "Filtered parents check" );
	equal( chadQuery("#groups").parents("div")[0].id, "qunit-fixture", "Filtered parents check2" );
	deepEqual( chadQuery("#groups").parents("p, div").get(), q("ap", "qunit-fixture"), "Check for multiple filters" );
	deepEqual( chadQuery("#en, #sndp").parents().get(), q("foo", "qunit-fixture", "dl", "body", "html"), "Check for unique results from parents" );
});

test("parentsUntil([String])", function() {
	expect(10);

	var parents = chadQuery("#groups").parents();

	deepEqual( chadQuery("#groups").parentsUntil().get(), parents.get(), "parentsUntil with no selector (nextAll)" );
	deepEqual( chadQuery("#groups").parentsUntil(".foo").get(), parents.get(), "parentsUntil with invalid selector (nextAll)" );
	deepEqual( chadQuery("#groups").parentsUntil("#html").get(), parents.slice(0, -1).get(), "Simple parentsUntil check" );
	equal( chadQuery("#groups").parentsUntil("#ap").length, 0, "Simple parentsUntil check" );
	deepEqual( chadQuery("#nonnodes").contents().eq(1).parentsUntil("#html").eq(0).get(), q("nonnodes"), "Text node parentsUntil check" );
	deepEqual( chadQuery("#groups").parentsUntil("#html, #body").get(), parents.slice( 0, 3 ).get(), "Less simple parentsUntil check" );
	deepEqual( chadQuery("#groups").parentsUntil("#html", "div").get(), chadQuery("#qunit-fixture").get(), "Filtered parentsUntil check" );
	deepEqual( chadQuery("#groups").parentsUntil("#html", "p,div,dl").get(), parents.slice( 0, 3 ).get(), "Multiple-filtered parentsUntil check" );
	equal( chadQuery("#groups").parentsUntil("#html", "span").length, 0, "Filtered parentsUntil check, no match" );
	deepEqual( chadQuery("#groups, #ap").parentsUntil("#html", "p,div,dl").get(), parents.slice( 0, 3 ).get(), "Multi-source, multiple-filtered parentsUntil check" );
});

test("next([String])", function() {
	expect(6);
	equal( chadQuery("#ap").next()[0].id, "foo", "Simple next check" );
	equal( chadQuery("<div>text<a id='element'></a></div>").contents().eq(0).next().attr("id"), "element", "Text node next check" );
	equal( chadQuery("#ap").next("div")[0].id, "foo", "Filtered next check" );
	equal( chadQuery("#ap").next("p").length, 0, "Filtered next check, no match" );
	equal( chadQuery("#ap").next("div, p")[0].id, "foo", "Multiple filters" );
	equal( chadQuery("body").next().length, 0, "Simple next check, no match" );
});

test("prev([String])", function() {
	expect(5);
	equal( chadQuery("#foo").prev()[0].id, "ap", "Simple prev check" );
	deepEqual( chadQuery("#nonnodes").contents().eq(1).prev().get(), q("nonnodesElement"), "Text node prev check" );
	equal( chadQuery("#foo").prev("p")[0].id, "ap", "Filtered prev check" );
	equal( chadQuery("#foo").prev("div").length, 0, "Filtered prev check, no match" );
	equal( chadQuery("#foo").prev("p, div")[0].id, "ap", "Multiple filters" );
});

test("nextAll([String])", function() {
	expect(5);

	var elems = chadQuery("#form").children();

	deepEqual( chadQuery("#label-for").nextAll().get(), elems.slice(1).get(), "Simple nextAll check" );
	equal( chadQuery("<div>text<a id='element'></a></div>").contents().eq(0).nextAll().attr("id"), "element", "Text node nextAll check" );
	deepEqual( chadQuery("#label-for").nextAll("input").get(), elems.slice(1).filter("input").get(), "Filtered nextAll check" );
	deepEqual( chadQuery("#label-for").nextAll("input,select").get(), elems.slice(1).filter("input,select").get(), "Multiple-filtered nextAll check" );
	deepEqual( chadQuery("#label-for, #hidden1").nextAll("input,select").get(), elems.slice(1).filter("input,select").get(), "Multi-source, multiple-filtered nextAll check" );
});

test("prevAll([String])", function() {
	expect(5);

	var elems = chadQuery( chadQuery("#form").children().slice(0, 12).get().reverse() );

	deepEqual( chadQuery("#area1").prevAll().get(), elems.get(), "Simple prevAll check" );
	deepEqual( chadQuery("#nonnodes").contents().eq(1).prevAll().get(), q("nonnodesElement"), "Text node prevAll check" );
	deepEqual( chadQuery("#area1").prevAll("input").get(), elems.filter("input").get(), "Filtered prevAll check" );
	deepEqual( chadQuery("#area1").prevAll("input,select").get(), elems.filter("input,select").get(), "Multiple-filtered prevAll check" );
	deepEqual( chadQuery("#area1, #hidden1").prevAll("input,select").get(), elems.filter("input,select").get(), "Multi-source, multiple-filtered prevAll check" );
});

test("nextUntil([String])", function() {
	expect(12);

	var elems = chadQuery("#form").children().slice( 2, 12 );

	deepEqual( chadQuery("#text1").nextUntil().get(), chadQuery("#text1").nextAll().get(), "nextUntil with no selector (nextAll)" );
	equal( chadQuery("<div>text<a id='element'></a></div>").contents().eq(0).nextUntil().attr("id"), "element", "Text node nextUntil with no selector (nextAll)" );
	deepEqual( chadQuery("#text1").nextUntil(".foo").get(), chadQuery("#text1").nextAll().get(), "nextUntil with invalid selector (nextAll)" );
	deepEqual( chadQuery("#text1").nextUntil("#area1").get(), elems.get(), "Simple nextUntil check" );
	equal( chadQuery("#text1").nextUntil("#text2").length, 0, "Simple nextUntil check" );
	deepEqual( chadQuery("#text1").nextUntil("#area1, #radio1").get(), chadQuery("#text1").next().get(), "Less simple nextUntil check" );
	deepEqual( chadQuery("#text1").nextUntil("#area1", "input").get(), elems.not("button").get(), "Filtered nextUntil check" );
	deepEqual( chadQuery("#text1").nextUntil("#area1", "button").get(), elems.not("input").get(), "Filtered nextUntil check" );
	deepEqual( chadQuery("#text1").nextUntil("#area1", "button,input").get(), elems.get(), "Multiple-filtered nextUntil check" );
	equal( chadQuery("#text1").nextUntil("#area1", "div").length, 0, "Filtered nextUntil check, no match" );
	deepEqual( chadQuery("#text1, #hidden1").nextUntil("#area1", "button,input").get(), elems.get(), "Multi-source, multiple-filtered nextUntil check" );

	deepEqual( chadQuery("#text1").nextUntil("[class=foo]").get(), chadQuery("#text1").nextAll().get(), "Non-element nodes must be skipped, since they have no attributes" );
});

test("prevUntil([String])", function() {
	expect(11);

	var elems = chadQuery("#area1").prevAll();

	deepEqual( chadQuery("#area1").prevUntil().get(), elems.get(), "prevUntil with no selector (prevAll)" );
	deepEqual( chadQuery("#nonnodes").contents().eq(1).prevUntil().get(), q("nonnodesElement"), "Text node prevUntil with no selector (prevAll)" );
	deepEqual( chadQuery("#area1").prevUntil(".foo").get(), elems.get(), "prevUntil with invalid selector (prevAll)" );
	deepEqual( chadQuery("#area1").prevUntil("label").get(), elems.slice(0, -1).get(), "Simple prevUntil check" );
	equal( chadQuery("#area1").prevUntil("#button").length, 0, "Simple prevUntil check" );
	deepEqual( chadQuery("#area1").prevUntil("label, #search").get(), chadQuery("#area1").prev().get(), "Less simple prevUntil check" );
	deepEqual( chadQuery("#area1").prevUntil("label", "input").get(), elems.slice(0, -1).not("button").get(), "Filtered prevUntil check" );
	deepEqual( chadQuery("#area1").prevUntil("label", "button").get(), elems.slice(0, -1).not("input").get(), "Filtered prevUntil check" );
	deepEqual( chadQuery("#area1").prevUntil("label", "button,input").get(), elems.slice(0, -1).get(), "Multiple-filtered prevUntil check" );
	equal( chadQuery("#area1").prevUntil("label", "div").length, 0, "Filtered prevUntil check, no match" );
	deepEqual( chadQuery("#area1, #hidden1").prevUntil("label", "button,input").get(), elems.slice(0, -1).get(), "Multi-source, multiple-filtered prevUntil check" );
});

test("contents()", function() {
	expect(12);
	var ibody, c;

	equal( chadQuery("#ap").contents().length, 9, "Check element contents" );
	ok( chadQuery("#iframe").contents()[0], "Check existence of IFrame document" );
	ibody = chadQuery("#loadediframe").contents()[0].body;
	ok( ibody, "Check existence of IFrame body" );

	equal( chadQuery("span", ibody).text(), "span text", "Find span in IFrame and check its text" );

	chadQuery(ibody).append("<div>init text</div>");
	equal( chadQuery("div", ibody).length, 2, "Check the original div and the new div are in IFrame" );

	equal( chadQuery("div", ibody).last().text(), "init text", "Add text to div in IFrame" );

	chadQuery("div", ibody).last().text("div text");
	equal( chadQuery("div", ibody).last().text(), "div text", "Add text to div in IFrame" );

	chadQuery("div", ibody).last().remove();
	equal( chadQuery("div", ibody).length, 1, "Delete the div and check only one div left in IFrame" );

	equal( chadQuery("div", ibody).text(), "span text", "Make sure the correct div is still left after deletion in IFrame" );

	chadQuery("<table/>", ibody).append("<tr><td>cell</td></tr>").appendTo(ibody);
	chadQuery("table", ibody).remove();
	equal( chadQuery("div", ibody).length, 1, "Check for JS error on add and delete of a table in IFrame" );

	// using contents will get comments regular, text, and comment nodes
	c = chadQuery("#nonnodes").contents().contents();
	equal( c.length, 1, "Check node,textnode,comment contents is just one" );
	equal( c[0].nodeValue, "hi", "Check node,textnode,comment contents is just the one from span" );
});

test("sort direction", function() {
	expect( 12 );

	var elems = chadQuery("#ap, #select1 > *, #moretests > form"),
		methodDirections = {
			parent: false,
			parents: true,
			parentsUntil: true,
			next: false,
			prev: false,
			nextAll: false,
			prevAll: true,
			nextUntil: false,
			prevUntil: true,
			siblings: false,
			children: false,
			contents: false
		};

	chadQuery.each( methodDirections, function( method, reversed ) {
		var actual = elems[ method ]().get(),
			forward = chadQuery.unique( [].concat( actual ) );
		deepEqual( actual, reversed ? forward.reverse() : forward, "Correct sort direction for " + method );
	});
});

test("add(String selector)", function() {
	expect( 2 );

	var divs;

	deepEqual(
		chadQuery("#sndp").add("#en").add("#sap").toArray(),
		q("sndp", "en", "sap"),
		"Check elements from document"
	);

	divs = chadQuery("<div/>").add("#sndp");
	ok( divs[0].parentNode, "Sort with the disconnected node last (started with disconnected first)." );
});

test("add(String selector, String context)", function() {
	expect( 1 );

	deepEqual(
		chadQuery([]).add("div", "#nothiddendiv").toArray(),
		q("nothiddendivchild"),
		"Check elements from document"
	);
});

test("add(String html)", function() {
	expect( 3 );

	var x,
		divs = chadQuery("#sndp").add("<div/>");

	ok( !divs[1].parentNode, "Sort with the disconnected node last." );


	x = chadQuery([]).add("<p id='x1'>xxx</p>").add("<p id='x2'>xxx</p>");
	equal( x[0].id, "x1", "Check detached element1" );
	equal( x[1].id, "x2", "Check detached element2" );
});

test("add(chadQuery)", function() {
	expect( 4 );

	var x,
		tmp = chadQuery("<div/>");

	x = chadQuery([])
	.add(
		chadQuery("<p id='x1'>xxx</p>").appendTo(tmp)
	)
	.add(
		chadQuery("<p id='x2'>xxx</p>").appendTo(tmp)
	);

	equal( x[0].id, "x1", "Check element1 in detached parent" );
	equal( x[1].id, "x2", "Check element2 in detached parent" );

	x = chadQuery([])
	.add(
		chadQuery("<p id='x1'>xxx</p>")
	)
	.add(
		chadQuery("<p id='x2'>xxx</p>")
	);

	equal( x[0].id, "x1", "Check detached element1" );
	equal( x[1].id, "x2", "Check detached element2" );
});

test("add(Element)", function() {
	expect( 2 );

	var x,
		tmp = chadQuery("<div/>");

	x = chadQuery([]).add(chadQuery("<p id='x1'>xxx</p>").appendTo(tmp)[0]).add(chadQuery("<p id='x2'>xxx</p>").appendTo(tmp)[0]);
	equal( x[0].id, "x1", "Check on-the-fly element1" );
	equal( x[1].id, "x2", "Check on-the-fly element2" );
});

test("add(Array elements)", function() {
	expect( 1 );

	deepEqual(
		chadQuery("#sndp").add( chadQuery("#en")[0] ).add( chadQuery("#sap") ).toArray(),
		q("sndp", "en", "sap"),
		"Check elements from document"
	);
});

test("add(Window)", function() {
	expect( 1 );

	var frame1 = document.createElement( "iframe" ),
		frame2 = document.createElement( "iframe" );

	// This increases window.length and sets window[i] available
	document.body.appendChild( frame1 );
	document.body.appendChild( frame2 );

	// Window is tricky because it is a lot like an array, even Array#slice will
	// turn it into a multi-item array.
	equal( chadQuery([]).add( window ).length, 1, "Add a window" );

	document.body.removeChild( frame1 );
	document.body.removeChild( frame2 );
});

test("add(NodeList|undefined|HTMLFormElement|HTMLSelectElement)", function() {
	expect( 4 );

	var ps, notDefined;

	ps = document.getElementsByTagName("p");

	equal( chadQuery([]).add(ps).length, ps.length, "Add a NodeList" );

	equal( chadQuery([]).add(notDefined).length, 0, "Adding undefined adds nothing" );

	equal( chadQuery([]).add( document.getElementById("form") ).length, 1, "Add a form" );
	equal( chadQuery([]).add( document.getElementById("select1") ).length, 1, "Add a select" );

	// We no longer support .add(form.elements), unfortunately.
	// There is no way, in browsers, to reliably determine the difference
	// between form.elements and form - and doing .add(form) and having it
	// add the form elements is way to unexpected, so this gets the boot.
	//ok( chadQuery([]).add(chadQuery("#form")[0].elements).length >= 13, "Check elements from array" );

	// For the time being, we're discontinuing support for chadQuery(form.elements) since it's ambiguous in IE
	// use chadQuery([]).add(form.elements) instead.
	//equal( chadQuery([]).add(chadQuery("#form")[0].elements).length, chadQuery(chadQuery("#form")[0].elements).length, "Array in constructor must equals array in add()" );
});

test("add(String, Context)", function() {
	expect(6);

	deepEqual( chadQuery( "#firstp" ).add( "#ap" ).get(), q( "firstp", "ap" ), "Add selector to selector " );
	deepEqual( chadQuery( document.getElementById("firstp") ).add( "#ap" ).get(), q( "firstp", "ap" ), "Add gEBId to selector" );
	deepEqual( chadQuery( document.getElementById("firstp") ).add( document.getElementById("ap") ).get(), q( "firstp", "ap" ), "Add gEBId to gEBId" );

	var ctx = document.getElementById("firstp");
	deepEqual( chadQuery( "#firstp" ).add( "#ap", ctx ).get(), q( "firstp" ), "Add selector to selector " );
	deepEqual( chadQuery( document.getElementById("firstp") ).add( "#ap", ctx ).get(), q( "firstp" ), "Add gEBId to selector, not in context" );
	deepEqual( chadQuery( document.getElementById("firstp") ).add( "#ap", document.getElementsByTagName("body")[0] ).get(), q( "firstp", "ap" ), "Add gEBId to selector, in context" );
});

test("eq('-1') #10616", function() {
	expect(3);
	var $divs = chadQuery( "div" );

	equal( $divs.eq( -1 ).length, 1, "The number -1 returns a selection that has length 1" );
	equal( $divs.eq( "-1" ).length, 1, "The string '-1' returns a selection that has length 1" );
	deepEqual( $divs.eq( "-1" ), $divs.eq( -1 ), "String and number -1 match" );
});

test("index(no arg) #10977", function() {
	expect(2);
	var $list, fragment, div;

	$list = chadQuery("<ul id='indextest'><li class='zero'>THIS ONE</li><li class='one'>a</li><li class='two'>b</li><li class='three'>c</li></ul>");
	chadQuery("#qunit-fixture").append( $list );
	strictEqual ( chadQuery( "#indextest li.zero" ).first().index() , 0, "No Argument Index Check" );
	$list.remove();

	fragment = document.createDocumentFragment();
	div = fragment.appendChild( document.createElement("div") );

	equal( chadQuery( div ).index(), 0, "If chadQuery#index called on element whose parent is fragment, it still should work correctly" );
});

test("traversing non-elements with attribute filters (#12523)", function() {
	expect(5);

	var nonnodes = chadQuery("#nonnodes").contents();

	equal( nonnodes.filter("[id]").length, 1, ".filter" );
	equal( nonnodes.find("[id]").length, 0, ".find" );
	strictEqual( nonnodes.is("[id]"), true, ".is" );
	deepEqual( nonnodes.closest("[id='nonnodes']").get(), q("nonnodes"), ".closest" );
	deepEqual( nonnodes.parents("[id='nonnodes']").get(), q("nonnodes"), ".parents" );
});
