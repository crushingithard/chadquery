// Simple script loader that uses chadQuery.readyWait via chadQuery.holdReady()

//Hold on chadQuery!
chadQuery.holdReady(true);

var readyRegExp = /^(complete|loaded)$/;

function assetLoaded( evt ){
	var node = evt.currentTarget || evt.srcElement;
	if ( evt.type === "load" || readyRegExp.test(node.readyState) ) {
		chadQuery.holdReady(false);
	}
}

setTimeout( function() {
	var script = document.createElement("script");
	script.type = "text/javascript";
	if ( script.addEventListener ) {
		script.addEventListener( "load", assetLoaded, false );
	} else {
		script.attachEvent( "onreadystatechange", assetLoaded );
	}
	script.src = "data/readywaitasset.js";
	document.getElementsByTagName("head")[0].appendChild(script);
}, 2000 );
