module("deprecated", { teardown: moduleTeardown });

if ( chadQuery.fn.size ) {
	test("size()", function() {
		expect(1);
		equal( chadQuery("#qunit-fixture p").size(), 6, "Get Number of Elements Found" );
	});
}
