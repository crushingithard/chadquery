if ( chadQuery.css ) {

module("css", { teardown: moduleTeardown });

test("css(String|Hash)", function() {
	expect( 42 );

	equal( chadQuery("#qunit-fixture").css("display"), "block", "Check for css property \"display\"" );

	var $child, div, div2, width, height, child, prctval, checkval, old;

	$child = chadQuery("#nothiddendivchild").css({ "width": "20%", "height": "20%" });
	notEqual( $child.css("width"), "20px", "Retrieving a width percentage on the child of a hidden div returns percentage" );
	notEqual( $child.css("height"), "20px", "Retrieving a height percentage on the child of a hidden div returns percentage" );

	div = chadQuery( "<div/>" );

	// These should be "auto" (or some better value)
	// temporarily provide "0px" for backwards compat
	equal( div.css("width"), "0px", "Width on disconnected node." );
	equal( div.css("height"), "0px", "Height on disconnected node." );

	div.css({ "width": 4, "height": 4 });

	equal( div.css("width"), "4px", "Width on disconnected node." );
	equal( div.css("height"), "4px", "Height on disconnected node." );

	div2 = chadQuery( "<div style='display:none;'><input type='text' style='height:20px;'/><textarea style='height:20px;'/><div style='height:20px;'></div></div>").appendTo("body");

	equal( div2.find("input").css("height"), "20px", "Height on hidden input." );
	equal( div2.find("textarea").css("height"), "20px", "Height on hidden textarea." );
	equal( div2.find("div").css("height"), "20px", "Height on hidden textarea." );

	div2.remove();

	// handle negative numbers by setting to zero #11604
	chadQuery("#nothiddendiv").css( {"width": 1, "height": 1} );

	width = parseFloat(chadQuery("#nothiddendiv").css("width"));
	height = parseFloat(chadQuery("#nothiddendiv").css("height"));
	chadQuery("#nothiddendiv").css({ "overflow":"hidden", "width": -1, "height": -1 });
	equal( parseFloat(chadQuery("#nothiddendiv").css("width")), 0, "Test negative width set to 0");
	equal( parseFloat(chadQuery("#nothiddendiv").css("height")), 0, "Test negative height set to 0");

	equal( chadQuery("<div style='display: none;'/>").css("display"), "none", "Styles on disconnected nodes");

	chadQuery("#floatTest").css({"float": "right"});
	equal( chadQuery("#floatTest").css("float"), "right", "Modified CSS float using \"float\": Assert float is right");
	chadQuery("#floatTest").css({"font-size": "30px"});
	equal( chadQuery("#floatTest").css("font-size"), "30px", "Modified CSS font-size: Assert font-size is 30px");
	chadQuery.each("0,0.25,0.5,0.75,1".split(","), function(i, n) {
		chadQuery("#foo").css({"opacity": n});

		equal( chadQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		chadQuery("#foo").css({"opacity": parseFloat(n)});
		equal( chadQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	chadQuery("#foo").css({"opacity": ""});
	equal( chadQuery("#foo").css("opacity"), "1", "Assert opacity is 1 when set to an empty String" );

	equal( chadQuery("#empty").css("opacity"), "0", "Assert opacity is accessible via filter property set in stylesheet in IE" );
	chadQuery("#empty").css({ "opacity": "1" });
	equal( chadQuery("#empty").css("opacity"), "1", "Assert opacity is taken from style attribute when set vs stylesheet in IE with filters" );

	div = chadQuery("#nothiddendiv");
	child = chadQuery("#nothiddendivchild");

	equal( parseInt(div.css("fontSize"), 10), 16, "Verify fontSize px set." );
	equal( parseInt(div.css("font-size"), 10), 16, "Verify fontSize px set." );
	equal( parseInt(child.css("fontSize"), 10), 16, "Verify fontSize px set." );
	equal( parseInt(child.css("font-size"), 10), 16, "Verify fontSize px set." );

	child.css("height", "100%");
	equal( child[0].style.height, "100%", "Make sure the height is being set correctly." );

	child.attr("class", "em");
	equal( parseInt(child.css("fontSize"), 10), 32, "Verify fontSize em set." );

	// Have to verify this as the result depends upon the browser's CSS
	// support for font-size percentages
	child.attr("class", "prct");
	prctval = parseInt(child.css("fontSize"), 10);
	checkval = 0;
	if ( prctval === 16 || prctval === 24 ) {
		checkval = prctval;
	}

	equal( prctval, checkval, "Verify fontSize % set." );

	equal( typeof child.css("width"), "string", "Make sure that a string width is returned from css('width')." );

	old = child[0].style.height;

	// Test NaN
	child.css("height", parseFloat("zoo"));
	equal( child[0].style.height, old, "Make sure height isn't changed on NaN." );

	// Test null
	child.css("height", null);
	equal( child[0].style.height, old, "Make sure height isn't changed on null." );

	old = child[0].style.fontSize;

	// Test NaN
	child.css("font-size", parseFloat("zoo"));
	equal( child[0].style.fontSize, old, "Make sure font-size isn't changed on NaN." );

	// Test null
	child.css("font-size", null);
	equal( child[0].style.fontSize, old, "Make sure font-size isn't changed on null." );

	strictEqual( child.css( "x-fake" ), undefined, "Make sure undefined is returned from css(nonexistent)." );

	div = chadQuery( "<div/>" ).css({ position: "absolute", "z-index": 1000 }).appendTo( "#qunit-fixture" );
	strictEqual( div.css( "z-index" ), "1000",
		"Make sure that a string z-index is returned from css('z-index') (#14432)." );
});

test( "css() explicit and relative values", 29, function() {
	var $elem = chadQuery("#nothiddendiv");

	$elem.css({ "width": 1, "height": 1, "paddingLeft": "1px", "opacity": 1 });
	equal( $elem.css("width"), "1px", "Initial css set or width/height works (hash)" );
	equal( $elem.css("paddingLeft"), "1px", "Initial css set of paddingLeft works (hash)" );
	equal( $elem.css("opacity"), "1", "Initial css set of opacity works (hash)" );

	$elem.css({ width: "+=9" });
	equal( $elem.css("width"), "10px", "'+=9' on width (hash)" );

	$elem.css({ "width": "-=9" });
	equal( $elem.css("width"), "1px", "'-=9' on width (hash)" );

	$elem.css({ "width": "+=9px" });
	equal( $elem.css("width"), "10px", "'+=9px' on width (hash)" );

	$elem.css({ "width": "-=9px" });
	equal( $elem.css("width"), "1px", "'-=9px' on width (hash)" );

	$elem.css( "width", "+=9" );
	equal( $elem.css("width"), "10px", "'+=9' on width (params)" );

	$elem.css( "width", "-=9" ) ;
	equal( $elem.css("width"), "1px", "'-=9' on width (params)" );

	$elem.css( "width", "+=9px" );
	equal( $elem.css("width"), "10px", "'+=9px' on width (params)" );

	$elem.css( "width", "-=9px" );
	equal( $elem.css("width"), "1px", "'-=9px' on width (params)" );

	$elem.css( "width", "-=-9px" );
	equal( $elem.css("width"), "10px", "'-=-9px' on width (params)" );

	$elem.css( "width", "+=-9px" );
	equal( $elem.css("width"), "1px", "'+=-9px' on width (params)" );

	$elem.css({ "paddingLeft": "+=4" });
	equal( $elem.css("paddingLeft"), "5px", "'+=4' on paddingLeft (hash)" );

	$elem.css({ "paddingLeft": "-=4" });
	equal( $elem.css("paddingLeft"), "1px", "'-=4' on paddingLeft (hash)" );

	$elem.css({ "paddingLeft": "+=4px" });
	equal( $elem.css("paddingLeft"), "5px", "'+=4px' on paddingLeft (hash)" );

	$elem.css({ "paddingLeft": "-=4px" });
	equal( $elem.css("paddingLeft"), "1px", "'-=4px' on paddingLeft (hash)" );

	$elem.css({ "padding-left": "+=4" });
	equal( $elem.css("paddingLeft"), "5px", "'+=4' on padding-left (hash)" );

	$elem.css({ "padding-left": "-=4" });
	equal( $elem.css("paddingLeft"), "1px", "'-=4' on padding-left (hash)" );

	$elem.css({ "padding-left": "+=4px" });
	equal( $elem.css("paddingLeft"), "5px", "'+=4px' on padding-left (hash)" );

	$elem.css({ "padding-left": "-=4px" });
	equal( $elem.css("paddingLeft"), "1px", "'-=4px' on padding-left (hash)" );

	$elem.css( "paddingLeft", "+=4" );
	equal( $elem.css("paddingLeft"), "5px", "'+=4' on paddingLeft (params)" );

	$elem.css( "paddingLeft", "-=4" );
	equal( $elem.css("paddingLeft"), "1px", "'-=4' on paddingLeft (params)" );

	$elem.css( "padding-left", "+=4px" );
	equal( $elem.css("paddingLeft"), "5px", "'+=4px' on padding-left (params)" );

	$elem.css( "padding-left", "-=4px" );
	equal( $elem.css("paddingLeft"), "1px", "'-=4px' on padding-left (params)" );

	$elem.css({ "opacity": "-=0.5" });
	equal( $elem.css("opacity"), "0.5", "'-=0.5' on opacity (hash)" );

	$elem.css({ "opacity": "+=0.5" });
	equal( $elem.css("opacity"), "1", "'+=0.5' on opacity (hash)" );

	$elem.css( "opacity", "-=0.5" );
	equal( $elem.css("opacity"), "0.5", "'-=0.5' on opacity (params)" );

	$elem.css( "opacity", "+=0.5" );
	equal( $elem.css("opacity"), "1", "'+=0.5' on opacity (params)" );
});

test("css(String, Object)", function() {
	expect( 20 );
	var j, div, display, ret, success;

	chadQuery("#nothiddendiv").css("top", "-1em");
	ok( chadQuery("#nothiddendiv").css("top"), -16, "Check negative number in EMs." );

	chadQuery("#floatTest").css("float", "left");
	equal( chadQuery("#floatTest").css("float"), "left", "Modified CSS float using \"float\": Assert float is left");
	chadQuery("#floatTest").css("font-size", "20px");
	equal( chadQuery("#floatTest").css("font-size"), "20px", "Modified CSS font-size: Assert font-size is 20px");

	chadQuery.each("0,0.25,0.5,0.75,1".split(","), function(i, n) {
		chadQuery("#foo").css("opacity", n);
		equal( chadQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		chadQuery("#foo").css("opacity", parseFloat(n));
		equal( chadQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	chadQuery("#foo").css("opacity", "");
	equal( chadQuery("#foo").css("opacity"), "1", "Assert opacity is 1 when set to an empty String" );

	// using contents will get comments regular, text, and comment nodes
	j = chadQuery("#nonnodes").contents();
	j.css("overflow", "visible");
	equal( j.css("overflow"), "visible", "Check node,textnode,comment css works" );
	// opera sometimes doesn't update 'display' correctly, see #2037
	chadQuery("#t2037")[0].innerHTML = chadQuery("#t2037")[0].innerHTML;
	equal( chadQuery("#t2037 .hidden").css("display"), "none", "Make sure browser thinks it is hidden" );

	div = chadQuery("#nothiddendiv");
	display = div.css("display");
	ret = div.css("display", undefined);

	equal( ret, div, "Make sure setting undefined returns the original set." );
	equal( div.css("display"), display, "Make sure that the display wasn't changed." );

	success = true;
	try {
		chadQuery( "#foo" ).css( "backgroundColor", "rgba(0, 0, 0, 0.1)" );
	}
	catch (e) {
		success = false;
	}
	ok( success, "Setting RGBA values does not throw Error (#5509)" );

	chadQuery( "#foo" ).css( "font", "7px/21px sans-serif" );
	strictEqual( chadQuery( "#foo" ).css( "line-height" ), "21px",
		"Set font shorthand property (#14759)" );
});

test( "css(Array)", function() {
	expect( 2 );

	var expectedMany = {
			"overflow": "visible",
			"width": "16px"
		},
		expectedSingle = {
			"width": "16px"
		},
		elem = chadQuery("<div></div>").appendTo("#qunit-fixture");

	deepEqual( elem.css( expectedMany ).css([ "overflow", "width" ]), expectedMany, "Getting multiple element array" );
	deepEqual( elem.css( expectedSingle ).css([ "width" ]), expectedSingle, "Getting single element array" );
});

test("css(String, Function)", function() {
	expect(3);

	var index,
		sizes = ["10px", "20px", "30px"];

	chadQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	index = 0;

	chadQuery("#cssFunctionTest div").css("font-size", function() {
		var size = sizes[index];
		index++;
		return size;
	});

	index = 0;

	chadQuery("#cssFunctionTest div").each(function() {
		var computedSize = chadQuery(this).css("font-size"),
			expectedSize = sizes[index];
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
	});

	chadQuery("#cssFunctionTest").remove();
});

test("css(String, Function) with incoming value", function() {
	expect(3);

	var index,
		sizes = ["10px", "20px", "30px"];

	chadQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	index = 0;

	chadQuery("#cssFunctionTest div").css("font-size", function() {
		var size = sizes[index];
		index++;
		return size;
	});

	index = 0;

	chadQuery("#cssFunctionTest div").css("font-size", function(i, computedSize) {
		var expectedSize = sizes[index];
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
		return computedSize;
	});

	chadQuery("#cssFunctionTest").remove();
});

test("css(Object) where values are Functions", function() {
	expect(3);

	var index,
		sizes = ["10px", "20px", "30px"];

	chadQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	index = 0;

	chadQuery("#cssFunctionTest div").css({"fontSize": function() {
		var size = sizes[index];
		index++;
		return size;
	}});

	index = 0;

	chadQuery("#cssFunctionTest div").each(function() {
		var computedSize = chadQuery(this).css("font-size"),
			expectedSize = sizes[index];
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
	});

	chadQuery("#cssFunctionTest").remove();
});

test("css(Object) where values are Functions with incoming values", function() {
	expect(3);

	var index,
		sizes = ["10px", "20px", "30px"];

	chadQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	index = 0;

	chadQuery("#cssFunctionTest div").css({"fontSize": function() {
		var size = sizes[index];
		index++;
		return size;
	}});

	index = 0;

	chadQuery("#cssFunctionTest div").css({"font-size": function(i, computedSize) {
		var expectedSize = sizes[index];
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
		return computedSize;
	}});

	chadQuery("#cssFunctionTest").remove();
});

test("show(); hide()", function() {

	expect( 4 );

	var hiddendiv, div;

	hiddendiv = chadQuery("div.hidden");
	hiddendiv.hide();
	equal( hiddendiv.css("display"), "none", "Non-detached div hidden" );
	hiddendiv.show();
	equal( hiddendiv.css("display"), "block", "Pre-hidden div shown" );

	div = chadQuery("<div>").hide();
	equal( div.css("display"), "none", "Detached div hidden" );
	div.appendTo("#qunit-fixture").show();
	equal( div.css("display"), "block", "Pre-hidden div shown" );

});

test("show();", function() {

	expect( 18 );

  var hiddendiv, div, pass, old, test;
	hiddendiv = chadQuery("div.hidden");

	equal(chadQuery.css( hiddendiv[0], "display"), "none", "hiddendiv is display: none");

	hiddendiv.css("display", "block");
	equal(chadQuery.css( hiddendiv[0], "display"), "block", "hiddendiv is display: block");

	hiddendiv.show();
	equal(chadQuery.css( hiddendiv[0], "display"), "block", "hiddendiv is display: block");

	hiddendiv.css("display","");

	pass = true;
	div = chadQuery("#qunit-fixture div");
	div.show().each(function(){
		if ( this.style.display === "none" ) {
			pass = false;
		}
	});
	ok( pass, "Show" );

	// #show-tests * is set display: none in CSS
	chadQuery("#qunit-fixture").append("<div id='show-tests'><div><p><a href='#'></a></p><code></code><pre></pre><span></span></div><table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table><ul><li></li></ul></div><table id='test-table'></table>");

	old = chadQuery("#test-table").show().css("display") !== "table";
	chadQuery("#test-table").remove();

	test = {
		"div"      : "block",
		"p"        : "block",
		"a"        : "inline",
		"code"     : "inline",
		"pre"      : "block",
		"span"     : "inline",
		"table"    : old ? "block" : "table",
		"thead"    : old ? "block" : "table-header-group",
		"tbody"    : old ? "block" : "table-row-group",
		"tr"       : old ? "block" : "table-row",
		"th"       : old ? "block" : "table-cell",
		"td"       : old ? "block" : "table-cell",
		"ul"       : "block",
		"li"       : old ? "block" : "list-item"
	};

	chadQuery.each(test, function(selector, expected) {
		var elem = chadQuery(selector, "#show-tests").show();
		equal( elem.css("display"), expected, "Show using correct display type for " + selector );
	});

	// Make sure that showing or hiding a text node doesn't cause an error
	chadQuery("<div>test</div> text <span>test</span>").show().remove();
	chadQuery("<div>test</div> text <span>test</span>").hide().remove();
});

test("show() resolves correct default display #8099", function() {
	expect(7);
	var tt8099 = chadQuery("<tt/>").appendTo("body"),
			dfn8099 = chadQuery("<dfn/>", { "html": "foo"}).appendTo("body");

	equal( tt8099.css("display"), "none", "default display override for all tt" );
	equal( tt8099.show().css("display"), "inline", "Correctly resolves display:inline" );

	equal( chadQuery("#foo").hide().show().css("display"), "block", "Correctly resolves display:block after hide/show" );

	equal( tt8099.hide().css("display"), "none", "default display override for all tt" );
	equal( tt8099.show().css("display"), "inline", "Correctly resolves display:inline" );

	equal( dfn8099.css("display"), "none", "default display override for all dfn" );
	equal( dfn8099.show().css("display"), "inline", "Correctly resolves display:inline" );

	tt8099.remove();
	dfn8099.remove();
});

test( "show() resolves correct default display for detached nodes", function(){
	expect( 13 );

	var div, span, tr, trDisplay;

	div = chadQuery("<div class='hidden'>");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a detached, pre-hidden( through stylesheets ) div is visible." );

	div = chadQuery("<div style='display: none'>");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a detached, pre-hidden( through inline style ) div is visible." );

	span = chadQuery("<span class='hidden'/>");
	span.show().appendTo("#qunit-fixture");
	equal( span.css("display"), "inline", "Make sure a detached, pre-hidden( through stylesheets ) span has default display." );

	span = chadQuery("<span style='display: inline'/>");
	span.show().appendTo("#qunit-fixture");
	equal( span.css("display"), "inline", "Make sure a detached, pre-hidden( through inline style ) span has default display." );

	div = chadQuery("<div><div class='hidden'></div></div>").children("div");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a detached, pre-hidden( through stylesheets ) div inside another visible div is visible." );

	div = chadQuery("<div><div style='display: none'></div></div>").children("div");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a detached, pre-hidden( through inline style ) div inside another visible div is visible." );

	div = chadQuery("div.hidden");
	div.detach().show();
	equal( div.css("display"), "block", "Make sure a detached( through detach() ), pre-hidden div is visible." );
	div.remove();

	span = chadQuery("<span>");
	span.appendTo("#qunit-fixture").detach().show().appendTo("#qunit-fixture" );
	equal( span.css("display"), "inline", "Make sure a detached( through detach() ), pre-hidden span has default display." );
	span.remove();

	div = chadQuery("<div>");
	div.show().appendTo("#qunit-fixture");
	ok( !!div.get( 0 ).style.display, "Make sure not hidden div has a inline style." );
	div.remove();

	div = chadQuery( document.createElement("div") );
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a pre-created element has default display." );
	div.remove();

	div = chadQuery("<div style='display: inline'/>");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "inline", "Make sure that element has same display when it was created." );
	div.remove();

	tr = chadQuery("<tr/>");
	chadQuery("#table").append( tr );
	trDisplay = tr.css( "display" );
	tr.detach().hide().show();

	equal( tr[ 0 ].style.display, trDisplay, "For detached tr elements, display should always be like for attached trs" );
	tr.remove();

	span = chadQuery("<span/>").hide().show();
	equal( span[ 0 ].style.display, "inline", "For detached span elements, display should always be inline" );
	span.remove();
});

test("show() resolves correct default display #10227", 4, function() {
	var html = chadQuery( document.documentElement ),
		body = chadQuery( "body" );

	body.append( "<p class='ddisplay'>a<style>body{display:none}</style></p>" );

	equal( body.css("display"), "none", "Initial display for body element: none" );

	body.show();
	equal( body.css("display"), "block", "Correct display for body element: block" );

	body.append( "<p class='ddisplay'>a<style>html{display:none}</style></p>" );

	equal( html.css("display"), "none", "Initial display for html element: none" );

	html.show();
	equal( html.css( "display" ), "block", "Correct display for html element: block" );

	chadQuery( ".ddisplay" ).remove();
});

test("show() resolves correct default display when iframe display:none #12904", function() {
	expect(2);

	var ddisplay = chadQuery(
		"<p id='ddisplay'>a<style>p{display:none}iframe{display:none !important}</style></p>"
	).appendTo("body");

	equal( ddisplay.css("display"), "none", "Initial display: none" );

	ddisplay.show();
	equal( ddisplay.css("display"), "block", "Correct display: block" );

	ddisplay.remove();
});

test("toggle()", function() {
	expect(9);
	var div, oldHide,
		x = chadQuery("#foo");

	ok( x.is(":visible"), "is visible" );
	x.toggle();
	ok( x.is(":hidden"), "is hidden" );
	x.toggle();
	ok( x.is(":visible"), "is visible again" );

	x.toggle(true);
	ok( x.is(":visible"), "is visible" );
	x.toggle(false);
	ok( x.is(":hidden"), "is hidden" );
	x.toggle(true);
	ok( x.is(":visible"), "is visible again" );

	div = chadQuery("<div style='display:none'><div></div></div>").appendTo("#qunit-fixture");
	x = div.find("div");
	strictEqual( x.toggle().css( "display" ), "none", "is hidden" );
	strictEqual( x.toggle().css( "display" ), "block", "is visible" );

	// Ensure hide() is called when toggled (#12148)
	oldHide = chadQuery.fn.hide;
	chadQuery.fn.hide = function() {
		ok( true, name + " method called on toggle" );
		return oldHide.apply( this, arguments );
	};
	x.toggle( name === "show" );
	chadQuery.fn.hide = oldHide;
});

test("hide hidden elements (bug #7141)", function() {
	expect(3);

	var div = chadQuery("<div style='display:none'></div>").appendTo("#qunit-fixture");
	equal( div.css("display"), "none", "Element is hidden by default" );
	div.hide();
	ok( !chadQuery._data(div, "olddisplay"), "olddisplay is undefined after hiding an already-hidden element" );
	div.show();
	equal( div.css("display"), "block", "Show a double-hidden element" );

	div.remove();
});

test("chadQuery.css(elem, 'height') doesn't clear radio buttons (bug #1095)", function () {
	expect(4);

	var $checkedtest = chadQuery("#checkedtest");
	chadQuery.css($checkedtest[0], "height");

	ok( chadQuery("input[type='radio']", $checkedtest).first().attr("checked"), "Check first radio still checked." );
	ok( !chadQuery("input[type='radio']", $checkedtest).last().attr("checked"), "Check last radio still NOT checked." );
	ok( chadQuery("input[type='checkbox']", $checkedtest).first().attr("checked"), "Check first checkbox still checked." );
	ok( !chadQuery("input[type='checkbox']", $checkedtest).last().attr("checked"), "Check last checkbox still NOT checked." );
});

test("internal ref to elem.runtimeStyle (bug #7608)", function () {
	expect(1);
	var result = true;

	try {
		chadQuery("#foo").css( { "width": "0%" } ).css("width");
	} catch (e) {
		result = false;
	}

	ok( result, "elem.runtimeStyle does not throw exception" );
});

test("marginRight computed style (bug #3333)", function() {
	expect(1);

	var $div = chadQuery("#foo");
	$div.css({
		"width": "1px",
		"marginRight": 0
	});

	equal($div.css("marginRight"), "0px", "marginRight correctly calculated with a width and display block");
});

test("box model properties incorrectly returning % instead of px, see #10639 and #12088", function() {
	expect( 2 );

	var container = chadQuery("<div/>").width( 400 ).appendTo("#qunit-fixture"),
		el = chadQuery("<div/>").css({ "width": "50%", "marginRight": "50%" }).appendTo( container ),
		el2 = chadQuery("<div/>").css({ "width": "50%", "minWidth": "300px", "marginLeft": "25%" }).appendTo( container );

	equal( el.css("marginRight"), "200px", "css('marginRight') returning % instead of px, see #10639" );
	equal( el2.css("marginLeft"), "100px", "css('marginLeft') returning incorrect pixel value, see #12088" );
});

test("chadQuery.cssProps behavior, (bug #8402)", function() {
	expect( 2 );

	var div = chadQuery( "<div>" ).appendTo(document.body).css({
		"position": "absolute",
		"top": 0,
		"left": 10
	});
	chadQuery.cssProps.top = "left";
	equal( div.css("top"), "10px", "the fixed property is used when accessing the computed style");
	div.css("top", "100px");
	equal( div[0].style.left, "100px", "the fixed property is used when setting the style");
	// cleanup chadQuery.cssProps
	chadQuery.cssProps.top = undefined;
});

test("widows & orphans #8936", function () {

	var $p = chadQuery("<p>").appendTo("#qunit-fixture");

	expect( 2 );

	$p.css({
		"widows": 3,
		"orphans": 3
	});

	equal( $p.css( "widows" ) || chadQuery.style( $p[0], "widows" ), 3, "widows correctly set to 3" );
	equal( $p.css( "orphans" ) || chadQuery.style( $p[0], "orphans" ), 3, "orphans correctly set to 3" );

	$p.remove();
});

test("can't get css for disconnected in IE<9, see #10254 and #8388", function() {
	expect( 2 );
	var span, div;

	span = chadQuery( "<span/>" ).css( "background-image", "url(data/1x1.jpg)" );
	notEqual( span.css( "background-image" ), null, "can't get background-image in IE<9, see #10254" );

	div = chadQuery( "<div/>" ).css( "top", 10 );
	equal( div.css( "top" ), "10px", "can't get top in IE<9, see #8388" );
});

test("can't get background-position in IE<9, see #10796", function() {
	var div = chadQuery( "<div/>" ).appendTo( "#qunit-fixture" ),
		units = [
			"0 0",
			"12px 12px",
			"13px 12em",
			"12em 13px",
			"12em center",
			"+12em center",
			"12.2em center",
			"center center"
		],
		l = units.length,
		i = 0;

	expect( l );

	for( ; i < l; i++ ) {
		div.css( "background-position", units [ i ] );
		ok( div.css( "background-position" ), "can't get background-position in IE<9, see #10796" );
	}
});

if ( chadQuery.fn.offset ) {
	test("percentage properties for left and top should be transformed to pixels, see #9505", function() {
		expect( 2 );
		var parent = chadQuery("<div style='position:relative;width:200px;height:200px;margin:0;padding:0;border-width:0'></div>").appendTo( "#qunit-fixture" ),
			div = chadQuery("<div style='position: absolute; width: 20px; height: 20px; top:50%; left:50%'></div>").appendTo( parent );

		equal( div.css("top"), "100px", "position properties not transformed to pixels, see #9505" );
		equal( div.css("left"), "100px", "position properties not transformed to pixels, see #9505" );
	});
}

test("Do not append px (#9548, #12990)", function() {
	expect( 2 );

	var $div = chadQuery("<div>").appendTo("#qunit-fixture");

	$div.css( "fill-opacity", 1 );
	// Support: Android 2.3 (no support for fill-opacity)
	if ( $div.css( "fill-opacity" ) ) {
		equal( $div.css( "fill-opacity" ), 1, "Do not append px to 'fill-opacity'" );
	} else {
		ok( true, "No support for fill-opacity CSS property" );
	}

	$div.css( "column-count", 1 );
	if ( $div.css("column-count") ) {
		equal( $div.css("column-count"), 1, "Do not append px to 'column-count'" );
	} else {
		ok( true, "No support for column-count CSS property" );
	}
});

test("css('width') and css('height') should respect box-sizing, see #11004", function() {
	expect( 4 );

	// Support: Firefox<29, Android 2.3 (Prefixed box-sizing versions).
	var el_dis = chadQuery("<div style='width:300px;height:300px;margin:2px;padding:2px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;'>test</div>"),
		el = el_dis.clone().appendTo("#qunit-fixture");

	equal( el.css("width"), el.css("width", el.css("width")).css("width"), "css('width') is not respecting box-sizing, see #11004");
	equal( el_dis.css("width"), el_dis.css("width", el_dis.css("width")).css("width"), "css('width') is not respecting box-sizing for disconnected element, see #11004");
	equal( el.css("height"), el.css("height", el.css("height")).css("height"), "css('height') is not respecting box-sizing, see #11004");
	equal( el_dis.css("height"), el_dis.css("height", el_dis.css("height")).css("height"), "css('height') is not respecting box-sizing for disconnected element, see #11004");
});

testIframeWithCallback( "css('width') should work correctly before document ready (#14084)",
	"css/cssWidthBeforeDocReady.html",
	function( cssWidthBeforeDocReady ) {
		expect( 1 );
		strictEqual( cssWidthBeforeDocReady, "100px", "elem.css('width') works correctly before document ready" );
	}
);

test("certain css values of 'normal' should be convertable to a number, see #8627", function() {
	expect ( 3 );

	var el = chadQuery("<div style='letter-spacing:normal;font-weight:normal;'>test</div>").appendTo("#qunit-fixture");

	ok( chadQuery.isNumeric( parseFloat( el.css("letterSpacing") ) ), "css('letterSpacing') not convertable to number, see #8627" );
	ok( chadQuery.isNumeric( parseFloat( el.css("fontWeight") ) ), "css('fontWeight') not convertable to number, see #8627" );
	equal( typeof el.css( "fontWeight" ), "string", ".css() returns a string" );
});

// only run this test in IE9
if ( document.documentMode === 9 ) {
	test( ".css('filter') returns a string in IE9, see #12537", 1, function() {
		equal( chadQuery("<div style='-ms-filter:\"progid:DXImageTransform.Microsoft.gradient(startColorstr=#FFFFFF, endColorstr=#ECECEC)\";'></div>").css("filter"), "progid:DXImageTransform.Microsoft.gradient(startColorstr=#FFFFFF, endColorstr=#ECECEC)", "IE9 returns the correct value from css('filter')." );
	});
}

test( "cssHooks - expand", function() {
	expect( 15 );
	var result,
		properties = {
			margin: [ "marginTop", "marginRight", "marginBottom", "marginLeft" ],
			borderWidth: [ "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"],
			padding: [ "paddingTop", "paddingRight", "paddingBottom", "paddingLeft" ]
		};

	chadQuery.each( properties, function( property, keys ) {
		var hook = chadQuery.cssHooks[ property ],
			expected = {};
		chadQuery.each( keys, function( _, key ) {
			expected[ key ] = 10;
		});
		result = hook.expand( 10 );
		deepEqual( result, expected, property + " expands properly with a number" );

		chadQuery.each( keys, function( _, key ) {
			expected[ key ] = "10px";
		});
		result = hook.expand( "10px" );
		deepEqual( result, expected, property + " expands properly with '10px'" );

		expected[ keys[1] ] = expected[ keys[3] ] = "20px";
		result = hook.expand( "10px 20px" );
		deepEqual( result, expected, property + " expands properly with '10px 20px'" );

		expected[ keys[2] ] = "30px";
		result = hook.expand( "10px 20px 30px" );
		deepEqual( result, expected, property + " expands properly with '10px 20px 30px'" );

		expected[ keys[3] ] = "40px";
		result = hook.expand( "10px 20px 30px 40px" );
		deepEqual( result, expected, property + " expands properly with '10px 20px 30px 40px'" );

	});

});

test( "css opacity consistency across browsers (#12685)", function() {
	expect( 4 );

	var el,
		fixture = chadQuery("#qunit-fixture");

	// Append style element
	chadQuery("<style>.opacityWithSpaces_t12685 { opacity: 0.1; filter: alpha(opacity = 10); } .opacityNoSpaces_t12685 { opacity: 0.2; filter: alpha(opacity=20); }</style>").appendTo( fixture );

	el = chadQuery("<div class='opacityWithSpaces_t12685'></div>").appendTo(fixture);

	equal( Math.round( el.css("opacity") * 100 ), 10, "opacity from style sheet (filter:alpha with spaces)" );
	el.removeClass("opacityWithSpaces_t12685").addClass("opacityNoSpaces_t12685");
	equal( Math.round( el.css("opacity") * 100 ), 20, "opacity from style sheet (filter:alpha without spaces)" );
	el.css( "opacity", 0.3 );
	equal( Math.round( el.css("opacity") * 100 ), 30, "override opacity" );
	el.css( "opacity", "" );
	equal( Math.round( el.css("opacity") * 100 ), 20, "remove opacity override" );
});

test( ":visible/:hidden selectors", function() {
	expect( 13 );

	ok( chadQuery("#nothiddendiv").is(":visible"), "Modifying CSS display: Assert element is visible" );
	chadQuery("#nothiddendiv").css({ display: "none" });
	ok( !chadQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is hidden" );
	chadQuery("#nothiddendiv").css({"display": "block"});
	ok( chadQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is visible");
	ok( chadQuery(window).is(":visible") || true, "Calling is(':visible') on window does not throw an exception (#10267)");
	ok( chadQuery(document).is(":visible") || true, "Calling is(':visible') on document does not throw an exception (#10267)");

	ok( chadQuery("#nothiddendiv").is(":visible"), "Modifying CSS display: Assert element is visible");
	chadQuery("#nothiddendiv").css("display", "none");
	ok( !chadQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is hidden");
	chadQuery("#nothiddendiv").css("display", "block");
	ok( chadQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is visible");

	// ok( !chadQuery("#siblingspan").is(":visible"), "Span with no content not visible (#13132)" );
	// var $newDiv = chadQuery("<div><span></span></div>").appendTo("#qunit-fixture");
	// equal( $newDiv.find(":visible").length, 0, "Span with no content not visible (#13132)" );
	// var $br = chadQuery("<br/>").appendTo("#qunit-fixture");
	// ok( !$br.is(":visible"), "br element not visible (#10406)");

	var $table = chadQuery("#table");
	$table.html("<tr><td style='display:none'>cell</td><td>cell</td></tr>");
	equal(chadQuery("#table td:visible").length, 1, "hidden cell is not perceived as visible (#4512). Works on table elements");
	$table.css("display", "none").html("<tr><td>cell</td><td>cell</td></tr>");
	equal(chadQuery("#table td:visible").length, 0, "hidden cell children not perceived as visible (#4512)");

	t( "Is Visible", "#qunit-fixture div:visible:lt(2)", ["foo", "nothiddendiv"] );
	t( "Is Not Hidden", "#qunit-fixture:hidden", [] );
	t( "Is Hidden", "#form input:hidden", ["hidden1","hidden2"] );
});

test( "Keep the last style if the new one isn't recognized by the browser (#14836)", function() {
	expect( 2 );

	var el;
	el = chadQuery( "<div></div>" ).css( "position", "absolute" ).css( "position", "fake value" );
	equal( el.css( "position" ), "absolute", "The old style is kept when setting an unrecognized value" );
	el = chadQuery( "<div></div>" ).css( "position", "absolute" ).css( "position", " " );
	equal( el.css( "position" ), "absolute", "The old style is kept when setting to a space" );
});

test( "Reset the style if set to an empty string", function() {
	expect( 1 );
	var el = chadQuery( "<div></div>" ).css( "position", "absolute" ).css( "position", "" );
	// Some browsers return an empty string; others "static". Both those cases mean the style
	// was reset successfully so accept them both.
	equal( el.css( "position" ) || "static", "static",
		"The style can be reset by setting to an empty string" );
});

asyncTest( "Clearing a Cloned Element's Style Shouldn't Clear the Original Element's Style (#8908)", 24, function() {
	var baseUrl = document.location.href.replace( /([^\/]*)$/, "" ),
	styles = [{
			name: "backgroundAttachment",
			value: ["fixed"],
			expected: [ "scroll" ]
		},{
			name: "backgroundColor",
			value: [ "rgb(255, 0, 0)", "rgb(255,0,0)", "#ff0000" ],
			expected: ["transparent"]
		}, {
			// Firefox returns auto's value
			name: "backgroundImage",
			value: [ "url('test.png')", "url(" + baseUrl + "test.png)", "url(\"" + baseUrl + "test.png\")" ],
			expected: [ "none", "url(\"http://static.chadquery.com/files/rocker/images/logo_chadquery_215x53.gif\")" ]
		}, {
			name: "backgroundPosition",
			value: ["5% 5%"],
			expected: [ "0% 0%", "-1000px 0px", "-1000px 0%" ]
		}, {
			// Firefox returns no-repeat
			name: "backgroundRepeat",
			value: ["repeat-y"],
			expected: [ "repeat", "no-repeat" ]
		}, {
			name: "backgroundClip",
			value: ["padding-box"],
			expected: ["border-box"]
		}, {
			name: "backgroundOrigin",
			value: ["content-box"],
			expected: ["padding-box"]
		}, {
			name: "backgroundSize",
			value: ["80px 60px"],
			expected: [ "auto auto" ]
	}];

	chadQuery.each(styles, function( index, style ) {
		var $clone, $clonedChildren,
			$source = chadQuery( "#firstp" ),
			source = $source[ 0 ],
			$children = $source.children();

		style.expected = style.expected.concat( [ "", "auto" ] );

		if ( source.style[ style.name ] === undefined ) {
			ok( true, style.name +  ": style isn't supported and therefore not an issue" );
			ok( true );

			return true;
		}

		$source.css( style.name, style.value[ 0 ] );
		$children.css( style.name, style.value[ 0 ] );

		$clone = $source.clone();
		$clonedChildren = $clone.children();

		$clone.css( style.name, "" );
		$clonedChildren.css( style.name, "" );

		window.setTimeout(function() {
			notEqual( $clone.css( style.name ), style.value[ 0 ], "Cloned css was changed" );

			ok( chadQuery.inArray( $source.css( style.name ) !== -1, style.value ),
				"Clearing clone.css() doesn't affect source.css(): " + style.name +
				"; result: " + $source.css( style.name ) +
				"; expected: " + style.value.join( "," ) );

			ok( chadQuery.inArray( $children.css( style.name ) !== -1, style.value ),
				"Clearing clonedChildren.css() doesn't affect children.css(): " + style.name +
				"; result: " + $children.css( style.name ) +
				"; expected: " + style.value.join( "," ) );
		}, 100 );
	});

	window.setTimeout( start, 1000 );
});

asyncTest( "Make sure initialized display value for disconnected nodes is correct (#13310)", 4, function() {
	var display = chadQuery("#display").css("display"),
		div = chadQuery("<div/>");

	equal( div.css( "display", "inline" ).hide().show().appendTo("body").css( "display" ), "inline", "Initialized display value has returned" );
	div.remove();

	div.css( "display", "none" ).hide();
	equal( chadQuery._data( div[ 0 ], "olddisplay" ), undefined, "olddisplay is undefined after hiding a detached and hidden element" );
	div.remove();

	div.css( "display", "inline-block" ).hide().appendTo("body").fadeIn(function() {
		equal( div.css( "display" ), "inline-block", "Initialized display value has returned" );
		div.remove();

		start();
	});

	equal( chadQuery._data( chadQuery("#display").css( "display", "inline" ).hide()[ 0 ], "olddisplay" ), display,
	"display: * !Important value should used as initialized display" );
	chadQuery._removeData( chadQuery("#display")[ 0 ] );
});

test( "show() after hide() should always set display to initial value (#14750)", 1, function() {
	var div = chadQuery( "<div />" ),
		fixture = chadQuery( "#qunit-fixture" );

	fixture.append( div );

	div.css( "display", "inline" ).hide().show().css( "display", "list-item" ).hide().show();
	equal( div.css( "display" ), "list-item", "should get last set display value" );
});

// Support: IE < 11, Safari < 7
// We have to jump through the hoops here in order to test work with "order" CSS property,
// that some browsers do not support. This test is not, strictly speaking, correct,
// but it's the best that we can do.
(function() {
	var style = document.createElement( "div" ).style,
		exist = "order" in style || "WebkitOrder" in style;

	if ( exist ) {
		test( "Don't append px to CSS \"order\" value (#14049)", 1, function() {
			var $elem = chadQuery( "<div/>" );

			$elem.css( "order", 2 );
			equal( $elem.css( "order" ), "2", "2 on order" );
		});
	}
})();
}
