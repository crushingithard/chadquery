(function() {

if ( !chadQuery.fn.wrap ) { // no wrap module
	return;
}

module( "wrap", {
	teardown: moduleTeardown
});

// See test/unit/manipulation.js for explanation about these 2 functions
function manipulationBareObj( value ) {
	return value;
}

function manipulationFunctionReturningObj( value ) {
	return function() {
		return value;
	};
}

function testWrap( val ) {

	expect( 19 );

	var defaultText, result, j, i, cacheLength;

	defaultText = "Try them out:";
	result = chadQuery("#first").wrap( val("<div class='red'><span></span></div>") ).text();

	equal( defaultText, result, "Check for wrapping of on-the-fly html" );
	ok( chadQuery("#first").parent().parent().is(".red"), "Check if wrapper has class 'red'" );

	result = chadQuery("#first").wrap( val(document.getElementById("empty")) ).parent();
	ok( result.is("ol"), "Check for element wrapping" );
	equal( result.text(), defaultText, "Check for element wrapping" );

	chadQuery("#check1").on( "click", function() {
		var checkbox = this;

		ok( checkbox.checked, "Checkbox's state is erased after wrap() action, see #769" );
		chadQuery( checkbox ).wrap( val("<div id='c1' style='display:none;'></div>") );
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action, see #769" );
	}).prop( "checked", false )[ 0 ].click();

	// using contents will get comments regular, text, and comment nodes
	j = chadQuery("#nonnodes").contents();
	j.wrap( val("<i></i>") );

	equal( chadQuery("#nonnodes > i").length, chadQuery("#nonnodes")[ 0 ].childNodes.length, "Check node,textnode,comment wraps ok" );
	equal( chadQuery("#nonnodes > i").text(), j.text(), "Check node,textnode,comment wraps doesn't hurt text" );

	// Try wrapping a disconnected node
	cacheLength = 0;
	for ( i in chadQuery.cache ) {
		cacheLength++;
	}

	j = chadQuery("<label/>").wrap( val("<li/>") );
	equal( j[ 0 ] .nodeName.toUpperCase(), "LABEL", "Element is a label" );
	equal( j[ 0 ].parentNode.nodeName.toUpperCase(), "LI", "Element has been wrapped" );

	for ( i in chadQuery.cache ) {
		cacheLength--;
	}
	equal( cacheLength, 0, "No memory leak in chadQuery.cache (bug #7165)" );

	// Wrap an element containing a text node
	j = chadQuery("<span/>").wrap("<div>test</div>");
	equal( j[ 0 ].previousSibling.nodeType, 3, "Make sure the previous node is a text element" );
	equal( j[ 0 ].parentNode.nodeName.toUpperCase(), "DIV", "And that we're in the div element." );

	// Try to wrap an element with multiple elements (should fail)
	j = chadQuery("<div><span></span></div>").children().wrap("<p></p><div></div>");
	equal( j[ 0 ].parentNode.parentNode.childNodes.length, 1, "There should only be one element wrapping." );
	equal( j.length, 1, "There should only be one element (no cloning)." );
	equal( j[ 0 ].parentNode.nodeName.toUpperCase(), "P", "The span should be in the paragraph." );

	// Wrap an element with a chadQuery set
	j = chadQuery("<span/>").wrap( chadQuery("<div></div>") );
	equal( j[ 0 ].parentNode.nodeName.toLowerCase(), "div", "Wrapping works." );

	// Wrap an element with a chadQuery set and event
	result = chadQuery("<div></div>").on( "click", function() {
		ok( true, "Event triggered." );

		// Remove handlers on detached elements
		result.off();
		chadQuery(this).off();
	});

	j = chadQuery("<span/>").wrap( result );
	equal( j[ 0 ].parentNode.nodeName.toLowerCase(), "div", "Wrapping works." );

	j.parent().trigger("click");
}

test( "wrap(String|Element)", function() {
	testWrap( manipulationBareObj );
});

test( "wrap(Function)", function() {
	testWrap( manipulationFunctionReturningObj );
});

test( "wrap(Function) with index (#10177)", function() {
	var expectedIndex = 0,
		targets = chadQuery("#qunit-fixture p");

	expect( targets.length );
	targets.wrap(function(i) {
		equal( i, expectedIndex, "Check if the provided index (" + i + ") is as expected (" + expectedIndex + ")" );
		expectedIndex++;

		return "<div id='wrap_index_'" + i + "'></div>";
	});
});

test( "wrap(String) consecutive elements (#10177)", function() {
	var targets = chadQuery("#qunit-fixture p");

	expect( targets.length * 2 );
	targets.wrap("<div class='wrapper'></div>");

	targets.each(function() {
		var $this = chadQuery(this);

		ok( $this.parent().is(".wrapper"), "Check each elements parent is correct (.wrapper)" );
		equal( $this.siblings().length, 0, "Each element should be wrapped individually" );
	});
});

test( "wrapAll(String)", function() {

	expect( 5 );

	var prev, p, result;

	prev = chadQuery("#firstp")[ 0 ].previousSibling;
	p = chadQuery("#firstp,#first")[ 0 ].parentNode;
	result = chadQuery("#firstp,#first").wrapAll( "<div class='red'><div class='tmp'></div></div>" );

	equal( result.parent().length, 1, "Check for wrapping of on-the-fly html" );
	ok( chadQuery("#first").parent().parent().is(".red"), "Check if wrapper has class 'red'" );
	ok( chadQuery("#firstp").parent().parent().is(".red"), "Check if wrapper has class 'red'" );
	equal( chadQuery("#first").parent().parent()[ 0 ].previousSibling, prev, "Correct Previous Sibling" );
	equal( chadQuery("#first").parent().parent()[ 0 ].parentNode, p, "Correct Parent" );

});

test( "wrapAll(Element)", function() {

  expect( 3 );

  var prev, p;
	prev = chadQuery("#firstp")[ 0 ].previousSibling;
	p = chadQuery("#first")[ 0 ].parentNode;
	chadQuery("#firstp,#first").wrapAll( document.getElementById("empty") );

	equal( chadQuery("#first").parent()[ 0 ], chadQuery("#firstp").parent()[ 0 ], "Same Parent" );
	equal( chadQuery("#first").parent()[ 0 ].previousSibling, prev, "Correct Previous Sibling" );
	equal( chadQuery("#first").parent()[ 0 ].parentNode, p, "Correct Parent" );
});

test( "wrapInner(String)", function() {

	expect( 6 );

	var num;

	num = chadQuery("#first").children().length;
	chadQuery("#first").wrapInner( "<div class='red'><div id='tmp'></div></div>" );

	equal( chadQuery("#first").children().length, 1, "Only one child" );
	ok( chadQuery("#first").children().is(".red"), "Verify Right Element" );
	equal( chadQuery("#first").children().children().children().length, num, "Verify Elements Intact" );

	num = chadQuery("#first").html("foo<div>test</div><div>test2</div>").children().length;
	chadQuery("#first").wrapInner( "<div class='red'><div id='tmp'></div></div>" );
	equal( chadQuery("#first").children().length, 1, "Only one child" );
	ok( chadQuery("#first").children().is(".red"), "Verify Right Element" );
	equal( chadQuery("#first").children().children().children().length, num, "Verify Elements Intact" );
});

test( "wrapInner(Element)", function() {

	expect( 5 );

	var num,
		div = chadQuery("<div/>");

	num = chadQuery("#first").children().length;
	chadQuery("#first").wrapInner( document.getElementById("empty") );
	equal( chadQuery("#first").children().length, 1, "Only one child" );
	ok( chadQuery("#first").children().is("#empty"), "Verify Right Element" );
	equal( chadQuery("#first").children().children().length, num, "Verify Elements Intact" );

	div.wrapInner( "<span></span>" );
	equal( div.children().length, 1, "The contents were wrapped." );
	equal( div.children()[ 0 ].nodeName.toLowerCase(), "span", "A span was inserted." );
});

test( "wrapInner(Function) returns String", function() {

	expect( 6 );

	var num,
    val = manipulationFunctionReturningObj;

	num = chadQuery("#first").children().length;
	chadQuery("#first").wrapInner( val("<div class='red'><div id='tmp'></div></div>") );

	equal( chadQuery("#first").children().length, 1, "Only one child" );
	ok( chadQuery("#first").children().is(".red"), "Verify Right Element" );
	equal( chadQuery("#first").children().children().children().length, num, "Verify Elements Intact" );

	num = chadQuery("#first").html("foo<div>test</div><div>test2</div>").children().length;
	chadQuery("#first").wrapInner( val("<div class='red'><div id='tmp'></div></div>") );
	equal( chadQuery("#first").children().length, 1, "Only one child" );
	ok( chadQuery("#first").children().is(".red"), "Verify Right Element" );
	equal( chadQuery("#first").children().children().children().length, num, "Verify Elements Intact" );
});

test( "wrapInner(Function) returns Element", function() {

	expect( 5 );

	var num,
    val = manipulationFunctionReturningObj,
		div = chadQuery("<div/>");

	num = chadQuery("#first").children().length;
	chadQuery("#first").wrapInner( val(document.getElementById("empty")) );
	equal( chadQuery("#first").children().length, 1, "Only one child" );
	ok( chadQuery("#first").children().is("#empty"), "Verify Right Element" );
	equal( chadQuery("#first").children().children().length, num, "Verify Elements Intact" );

	div.wrapInner( val("<span></span>") );
	equal( div.children().length, 1, "The contents were wrapped." );
	equal( div.children()[ 0 ].nodeName.toLowerCase(), "span", "A span was inserted." );
});

test( "unwrap()", function() {

	expect( 9 );

	chadQuery("body").append("  <div id='unwrap' style='display: none;'> <div id='unwrap1'> <span class='unwrap'>a</span> <span class='unwrap'>b</span> </div> <div id='unwrap2'> <span class='unwrap'>c</span> <span class='unwrap'>d</span> </div> <div id='unwrap3'> <b><span class='unwrap unwrap3'>e</span></b> <b><span class='unwrap unwrap3'>f</span></b> </div> </div>");

	var abcd = chadQuery("#unwrap1 > span, #unwrap2 > span").get(),
		abcdef = chadQuery("#unwrap span").get();

	equal( chadQuery("#unwrap1 span").add("#unwrap2 span:first-child").unwrap().length, 3, "make #unwrap1 and #unwrap2 go away" );
	deepEqual( chadQuery("#unwrap > span").get(), abcd, "all four spans should still exist" );

	deepEqual( chadQuery("#unwrap3 span").unwrap().get(), chadQuery("#unwrap3 > span").get(), "make all b in #unwrap3 go away" );

	deepEqual( chadQuery("#unwrap3 span").unwrap().get(), chadQuery("#unwrap > span.unwrap3").get(), "make #unwrap3 go away" );

	deepEqual( chadQuery("#unwrap").children().get(), abcdef, "#unwrap only contains 6 child spans" );

	deepEqual( chadQuery("#unwrap > span").unwrap().get(), chadQuery("body > span.unwrap").get(), "make the 6 spans become children of body" );

	deepEqual( chadQuery("body > span.unwrap").unwrap().get(), chadQuery("body > span.unwrap").get(), "can't unwrap children of body" );
	deepEqual( chadQuery("body > span.unwrap").unwrap().get(), abcdef, "can't unwrap children of body" );

	deepEqual( chadQuery("body > span.unwrap").get(), abcdef, "body contains 6 .unwrap child spans" );

	chadQuery("body > span.unwrap").remove();
});

test( "chadQuery(<tag>) & wrap[Inner/All]() handle unknown elems (#10667)", function() {

	expect( 2 );

	var $wraptarget = chadQuery( "<div id='wrap-target'>Target</div>" ).appendTo( "#qunit-fixture" ),
		$section = chadQuery( "<section>" ).appendTo( "#qunit-fixture" );

	$wraptarget.wrapAll("<aside style='background-color:green'></aside>");

	notEqual( $wraptarget.parent("aside").get( 0 ).style.backgroundColor, "transparent", "HTML5 elements created with wrapAll inherit styles" );
	notEqual( $section.get( 0 ).style.backgroundColor, "transparent", "HTML5 elements create with chadQuery( string ) inherit styles" );
});

test( "wrapping scripts (#10470)", function() {

	expect( 2 );

	var script = document.createElement("script");
	script.text = script.textContent = "ok( !document.eval10470, 'script evaluated once' ); document.eval10470 = true;";

	document.eval10470 = false;
	chadQuery("#qunit-fixture").empty()[0].appendChild( script );
	chadQuery("#qunit-fixture script").wrap("<b></b>");
	strictEqual( script.parentNode, chadQuery("#qunit-fixture > b")[ 0 ], "correctly wrapped" );
	chadQuery( script ).remove();
});

})();
