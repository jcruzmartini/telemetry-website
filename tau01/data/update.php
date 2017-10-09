<?php
	$entity = '';
	if (isset($_GET['entity'])) $entity = $_GET['entity'];

	$con = mysql_connect("techner.no-ip.info:3306","cfontana0","carlitoz");
	if (!$con){echo('Could not connect: ' . mysql_error());}
	mysql_select_db("smsbd", $con);
	
	$response = 0;
	switch (strtolower($entity)) {
    case 'special-queries':
		$variable = $_POST['variable'];
		$reference = $_POST['reference'];
		$ref_value = $_POST['ref_value'];
		$start_date = $_POST['start_date'];
		$end_date = $_POST['end_date'];
		$sql = "INSERT INTO SPECIAL_QUERIES (ID_VARIABLE, REF_VALUE, REFERENCE, START_DATE, END_DATE, USER) VALUES (".$variable.", ".$ref_value.", '".$reference."', '".$start_date."', '".$end_date."', 'test')";
		echo $sql;
		//$result = mysql_query($sql);
        break;
	}
	mysql_close($con);

//	echo $_GET['callback']. '({"entries":'.json_encode($response).'})';   

?>