<?php 
	$req = 'special-queries'; $form_variable = ''; $form_reference = ''; $form_ref_value = ''; $form_start_date = ''; $form_end_date = '';
	if (isset($_GET['req'])) $req = $_GET['req'];
	if (isset($_GET['variable'])) $form_variable = $_GET['variable'];
	if (isset($_GET['reference'])) $form_reference = $_GET['reference'];
	if (isset($_GET['ref_value'])) $form_ref_value = $_GET['ref_value'];
	if (isset($_GET['start_date'])) $form_start_date = $_GET['start_date'];
	if (isset($_GET['end_date'])) $form_end_date = $_GET['end_date'];
	if (isset($_POST['req']) && $req == '') $req = $_POST['req'];
	if (isset($_POST['variable']) && $form_variable == '') $form_variable = $_POST['variable'];
	if (isset($_POST['reference']) && $form_reference == '') $form_reference = $_POST['reference'];
	if (isset($_POST['ref_value']) && $form_ref_value == '') $form_ref_value = $_POST['ref_value'];
	if (isset($_POST['start_date']) && $form_start_date == '') $form_start_date = $_POST['start_date'];
	if (isset($_POST['end_date']) && $form_end_date == '') $form_end_date = $_POST['end_date'];

	if ($form_reference == 'igual_a') $form_reference = "=";
	if ($form_reference == 'menor_a') $form_reference = "<=";
	if ($form_reference == 'mayor_a') $form_reference = ">=";
	
	$con = mysql_connect("techner.no-ip.info:3306","cfontana0","carlitoz");
	if (!$con){echo('Could not connect: ' . mysql_error());}
	mysql_select_db("smsbd", $con);
	$response = 0;
	switch (strtolower($req)) {
    case 'special-queries':
		$sql = 	"SELECT DATE_FORMAT(DATE, '%d') DATE2, COUNT(*) VALUE, DATE  FROM (SELECT ROUND(AVG(VALUE),2) AVG_VALUE, DATE, DATE_FORMAT(DATE,'%d/%m/%Y %h') H_DATE FROM MEASURES WHERE ID_VARIABLE = ".$form_variable." AND DATE BETWEEN STR_TO_DATE('".$form_start_date."','%m/%d/%Y') AND STR_TO_DATE('".$form_end_date."','%m/%d/%Y') GROUP BY H_DATE) T WHERE AVG_VALUE ".$form_reference." ".$form_ref_value." GROUP BY DATE_FORMAT(DATE, '%d/%m/%Y') ORDER BY DATE";
		$sql2 = "SELECT SUM(VALUE) SUM, COUNT(DATE) DIAS FROM (".$sql.") A";
		$result = mysql_query($sql);
		$result2 = mysql_query($sql2);
		$categories = '';
		$data = '';
		$acum = '';
		$dias = '';

		while($row = mysql_fetch_array($result)){
			$data = $data.$row['VALUE'].", ";
			$categories = $categories."'".$row['DATE2']."', ";
		}
		while($row2 = mysql_fetch_array($result2)){
			$acum = $row2['SUM'];
			$dias = $row2['DIAS'];
		}

		
		$data = substr_replace($data, "", -2);
		$categories = substr_replace($categories, "", -2);
		$response = "[{categories: [".$categories."]},{data: [".$data."]},{acum: ".$acum."},{dias: ".$dias."}]";
		echo $response;
		
        break;
 	}
	mysql_close($con);
?>