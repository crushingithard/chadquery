html text<br/>
<script type="text/javascript">/* <![CDATA[ */
testFoo = "foo"; chadQuery('#foo').html('foo');
ok( true, "test.php executed" );
/* ]]> */</script>
<script src="data/testbar.php?<?php srand(); echo time() . '' . rand(); ?>"></script>
blabla
