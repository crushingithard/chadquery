define([
	"../ajax"
], function( chadQuery ) {

chadQuery._evalUrl = function( url ) {
	return chadQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};

return chadQuery._evalUrl;

});
