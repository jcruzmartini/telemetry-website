<?php
	try{
		$con = mysql_connect("techner.no-ip.info:3306","cfontana0","carlitoz");
		if (!$con){echo('Could not connect: ' . mysql_error());}
		mysql_select_db("smsbd", $con);
		$action = 'INFO';
		if (isset($_POST['action'])) $action = $_POST['action'];
		if (isset($_GET['action'])) $action = $_GET['action'];
		if (isset($_POST['station'])) $station = $_POST['station'];
		if (isset($_GET['station'])) $station = $_GET['station'];
		if (!(isset($station))) $station = 5;

		$action = strtoupper ($action);
		
		if ($action == 'INFO') {
			$data = 100;
			$result = mysql_query("select ROUND((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(DATE))/60,0) INFO, DATE from SMS WHERE FROME='SERVER' AND TEXT LIKE 'CLIMA%' order by DATE DESC");
			while($row = mysql_fetch_array($result)){
				$data = intval($row['INFO']);
			}
			if ($data < 20) {
				echo 'Espere al menos 20 minutos';
				exit;
			}
			$sql1 = "insert into SMS (DATE,FROME,STATE,TEXT) values (NOW(),'SERVER','P','".$action."');";
			$sql2 = "insert into SMS_OPERATION (ID_SMS,ID_STATION,SUCCESS) values ((SELECT MAX(ID_SMS) FROM SMS),'".$station."',0);";
			$result = mysql_query($sql1);
			$result = mysql_query($sql2);
			echo 'Se han ejecutado los siguientes SQL:<br/>'.strtoupper($sql1).'<br/>'.strtoupper($sql2);
		} else if ($action == 'USER'){
			if (isset($_POST['nombre'])) $nombre = $_POST['nombre'];
			if (isset($_POST['telefono'])) $telefono = $_POST['telefono'];
			if (isset($_POST['email'])) $email = $_POST['email'];

			if (isset($_GET['nombre'])) $nombre = $_GET['nombre'];
			if (isset($_GET['telefono'])) $telefono = $_GET['telefono'];
			if (isset($_GET['email'])) $email = $_GET['email'];

			$sql1 = "insert into POTENTIAL_CUSTOMER (FECHA_ALTA, NOMBRE, TELEFONO, EMAIL) values (NOW(),'".$nombre."','".$telefono."','".$email."');";
			$result = mysql_query($sql1);
		} else if ($action == 'AA' || $action == 'BA'){
			/* alert code */
			if (isset($_POST['alertcode'])) $alertcode = $_POST['alertcode'];
			if (isset($_GET['alertcode'])) $alertcode = $_GET['alertcode'];
			/* min */
			if (isset($_POST['min'])) $min = $_POST['min'];
			if (isset($_GET['min'])) $min = $_GET['min'];
			/* max */
			if (isset($_POST['max'])) $max = $_POST['max'];
			if (isset($_GET['max'])) $max = $_GET['max'];
			$msj = $action;
			if ($action == 'AA'){
				$msj = $action;
			}
			$msj = $msj.'|'.$alertcode;
			$sql1 = "insert into SMS (DATE,FROME,STATE,TEXT) values (NOW(),'SERVER','P','".$msj."');";
			$sql2 = "insert into SMS_OPERATION (ID_SMS,ID_STATION,SUCCESS) values ((SELECT MAX(ID_SMS) FROM SMS),'".$station."',0);";
			$result = mysql_query($sql1);
			$result = mysql_query($sql2);
		} else {
			$password = '';
			if (isset($_GET['password'])) $password = $_GET['password'];
			if ($password != 'rootroot') {
				echo 'Error, Password Incorrecto';
				exit;
			}
			$sql1 = "insert into SMS (DATE,FROME,STATE,TEXT) values (NOW(),'SERVER','P','".$action."');";
			$sql2 = "insert into SMS_OPERATION (ID_SMS,ID_STATION,SUCCESS) values ((SELECT MAX(ID_SMS) FROM SMS),'".$station."',0);";
			$result = mysql_query($sql1);
			$result = mysql_query($sql2);
			echo 'Se han ejecutado los siguientes SQL:<br/>'.strtoupper($sql1).'<br/>'.strtoupper($sql2);
		}
	
		mysql_close($con);
	}catch(Exception $e){
		echo $e;
    }
?>
