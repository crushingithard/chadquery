define([
	"./core",
	"sizzle"
], function( chadQuery, Sizzle ) {

chadQuery.find = Sizzle;
chadQuery.expr = Sizzle.selectors;
chadQuery.expr[":"] = chadQuery.expr.pseudos;
chadQuery.unique = Sizzle.uniqueSort;
chadQuery.text = Sizzle.getText;
chadQuery.isXMLDoc = Sizzle.isXML;
chadQuery.contains = Sizzle.contains;

});
