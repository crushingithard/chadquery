module("exports", { teardown: moduleTeardown });

test("amdModule", function() {
	expect(1);

	equal( chadQuery, amdDefined, "Make sure defined module matches chadQuery" );
});
