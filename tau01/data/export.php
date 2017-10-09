<?php
  // Original PHP code by Chirp Internet: www.chirp.com.au
  // Please acknowledge use of this code by including this header.

	function cleanData(&$str){
		$str = preg_replace("/\t/", "\\t", $str);
		$str = preg_replace("/\r?\n/", "\\n", $str);
		if($str == 't') $str = 'TRUE';
		if($str == 'f') $str = 'FALSE';
		if(preg_match("/^0/", $str) || preg_match("/^\+?\d{8,}$/", $str) || preg_match("/^\d{4}.\d{1,2}.\d{1,2}/", $str)) {
			$str = "'$str";
		}
		if(strstr($str, '"')) $str = '"' . str_replace('"', '""', $str) . '"';
	}
	/* conexion a la base de datos */
	$con = mysql_connect("techner.no-ip.info:3306","cfontana0","carlitoz");
	if (!$con){echo('Could not connect: ' . mysql_error());}
	mysql_select_db("smsbd", $con);
	$station = '';
	if (isset($_GET['station'])) {
		$station = $_GET['station'];
	} else {
		$station = 5;
	}
	
	// filename for download
	$filename = "tau01_datos_" . date('Ymd') . ".xls";

	header("Content-Disposition: attachment; filename=\"$filename\"");
	header("Content-Type: application/vnd.ms-excel");

	$flag = false;
	$result = mysql_query("SELECT M.DATE 'Fecha', V.DESCRIPTION 'Descripción', M.VALUE 'Valor', IFNULL(V.UNIT,'') 'Unidad' FROM MEASURES M, VARIABLE V WHERE ID_STATION = ".$station." AND M.ID_VARIABLE = V.ID_VARIABLE ORDER BY DATE DESC") or die('Query failed!');

	while(false !== ($row = mysql_fetch_array($result,MYSQL_ASSOC))) {
	if(!$flag) {
	  // display field/column names as first row
	  echo implode("\t", array_keys($row)) . "\r\n";
	  $flag = true;
	}
	array_walk($row, 'cleanData');
	$line = implode("\t", array_values($row)); 
	$line = str_replace("\'","",$line);
	echo  $line."\r\n";
	}
	exit;
?>