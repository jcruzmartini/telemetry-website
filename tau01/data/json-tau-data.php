<?php
	set_error_handler("my_warning_handler", E_ALL);
	function my_warning_handler($errno, $errstr, $errfile, $errline, $errcontext) {
		throw new Exception( $errstr );
	}

	function encode_items(&$item, $key)	{
		$item = utf8_encode($item);
	}  
	
	function notExists($value)	{
		if (!(isset($value))) return true;
		if ($value=="") return true;
		return false;  
	}

	$station = 5; //en el futuro, la estación no estará hardcodeada

	
	header("content-type: application/json");
	$req = ''; $limit = '';$variable = '';
	if (isset($_GET['req'])) $req = strtolower($_GET['req']);
	if (isset($_GET['limit'])) $limit = $_GET['limit'];
	if (isset($_GET['variable'])) $variable = $_GET['variable'];
	if (isset($_GET['station'])) $station = strtolower($_GET['station']);
	if (isset($_GET['fdesde'])) $fdesde = $_GET['fdesde'];
	if (isset($_GET['fhasta'])) $fhasta = $_GET['fhasta'];
	if (isset($_GET['tempref'])) $tempref = $_GET['tempref'];
	if (isset($_GET['mail'])) $mail = $_GET['mail'];
	
	if (notExists($station)) $req = "";
	$error = 0;
	try {
		$con = mysql_connect("techner.no-ip.info:3306","userdb","techner123");
		mysql_select_db("smsbd", $con);
	} catch (Exception $e) {
		$fichero = './files/station'.$station.'-'.$req.'.json';
		if (file_exists($fichero)) {
			$rta = '';;
			if (isset($_GET['callback'])) $rta = $rta.$_GET['callback'];
			echo $rta.file_get_contents($fichero);
		}
		exit(1);
	}
	
	$response = "";
	switch (strtolower($req)) {
	case 'ciclo-solar':
		$sql = "select DATE_FORMAT(SUNRISE,'%H:%m') sunrise, DATE_FORMAT(SUNSET,'%H:%m') sunset from SUNRISE_SUNSET_INFORMATION SSI, STATION S WHERE SSI.ID_STATION_INFORMATION =  S.ID_STATION_INFORMATION AND ID_STATION = ".$station." AND DATE_FORMAT(DATE,'%d%m%Y') = DATE_FORMAT(NOW(),'%d%m%Y')";
		if ($limit != '') $sql = $sql.' LIMIT '.$limit;
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		
		break;
	case 'notification':
		$sql = "select N.SHORT_DESCRIPTION variable, CONCAT(DATE_FORMAT(EN.START_DATE,'%d/%m %H:%i'), IFNULL(DATE_FORMAT(EN.END_DATE,' a %d/%m %H:%i'),' al Presente')) date_range, ROUND(TIME_TO_SEC(TIMEDIFF(IFNULL(EN.END_DATE, NOW()), EN.START_DATE )) / 3600,1) duration, IF(ISNULL(END_DATE), 'Activa', 'Caducada') status, RDC.RISK risk, RDC.DESCRIPTION description, EN.VALUE value from EVENT_NOTIFICATION EN, RISK_DESCRIPTION_COMMENT RDC, NOTIFICATION N WHERE EN.ID_RISK_DESCRIPTION_COMMENT = RDC.ID_RISK_DESCRIPTION_COMMENT AND N.ID_NOTIFICATION = RDC.ID_NOTIFICATION AND EN.ID_STATION = ".$station." ORDER BY START_DATE DESC";
		if ($limit != '') $sql = $sql.' LIMIT '.$limit;
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		
		break;
	case 'alerts':
		$sql = "select N.SHORT_DESCRIPTION variable, CONCAT(DATE_FORMAT(EN.START_DATE,'%d/%m %H:%i'), IFNULL(DATE_FORMAT(EN.END_DATE,' a %d/%m %H:%i'),' al Presente')) date_range, ROUND(TIME_TO_SEC(TIMEDIFF(IFNULL(EN.END_DATE, NOW()), EN.START_DATE )) / 3600,1) duration, IF(ISNULL(END_DATE), 'Activa', 'Caducada') status, RDC.RISK risk, RDC.DESCRIPTION description, EN.VALUE value from EVENT_NOTIFICATION EN, RISK_DESCRIPTION_COMMENT RDC, NOTIFICATION N WHERE EN.ID_RISK_DESCRIPTION_COMMENT = RDC.ID_RISK_DESCRIPTION_COMMENT AND N.ID_NOTIFICATION = RDC.ID_NOTIFICATION AND EN.ID_STATION = ".$station." ORDER BY START_DATE DESC";
		if ($limit != '') $sql = $sql.' LIMIT '.$limit;
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		
		break;
	case 'alertas-activas':
		$sql = "SELECT ALERT_DESCRIPTION 'Alerta', DATE_FORMAT(START_DATE,'%d/%m/%Y') 'Fecha Inicio', IFNULL(DATE_FORMAT(END_DATE,'%d/%m/%Y'),'') 'Fecha Finalizacion', MIN 'Umbral Minimo', MAX 'Umbral Maximo', IF(ISNULL(END_DATE),'Habilitada', 'Deshabilitada') 'Estado' FROM ALERT_RULE AR, ALERT A WHERE AR.ID_ALERT = A.ID_ALERT AND ID_STATION = ".$station."";
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		break;
	case 'ocurrrencia-alertas':
		$sql = "select ALERT_DESCRIPTION 'alerta', CONCAT('Menor a ', CAST(AR.MIN AS CHAR), V.UNIT,' y mayor a ', CAST(AR.MAX AS CHAR), V.UNIT) 'regla', CONCAT(DATE_FORMAT(AE.START_DATE,'%d/%m %H:%i'), IFNULL(DATE_FORMAT(AE.LAST_UPDATE,' a %d/%m %H:%i'),' al Presente')) date_range, IF(ISNULL(AE.LAST_UPDATE),'activa','No Activa') 'estado', AE.VALUE 'valormedido', ROUND((TIME_TO_SEC(TIMEDIFF(IFNULL(AE.LAST_UPDATE, NOW()), AE.START_DATE)) / 3600)+0.5,1) 'duracion' from ALERT_EVENT AE, ALERT_RULE AR, ALERT A, VARIABLE V WHERE A.ID_VARIABLE = V.ID_VARIABLE AND AR.ID_ALERT_RULE = AE.ID_ALERT_RULE AND AR.END_DATE IS NULL AND A.ID_ALERT = AR.ID_ALERT AND ID_STATION = ".$station."";		
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		break;
	case 'combo-alertas': 
		$sql = "select ALERT_DESCRIPTION DESCRIPTION, CODE FROM ALERT ORDER BY DESCRIPTION";
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		break;
	case 'today-notification':
		$sql = "select N.SHORT_DESCRIPTION variable, CONCAT(DATE_FORMAT(EN.START_DATE,'%H:%i'), IFNULL(DATE_FORMAT(EN.END_DATE,' a %H:%i'),' al Presente')) date_range, ROUND(TIME_TO_SEC(TIMEDIFF(IFNULL(EN.END_DATE, NOW()), EN.START_DATE )) / 3600,1) duration, IF(ISNULL(END_DATE), 'Activa', 'Caducada') status, RDC.RISK risk, RDC.DESCRIPTION description, EN.VALUE value from EVENT_NOTIFICATION EN, RISK_DESCRIPTION_COMMENT RDC, NOTIFICATION N WHERE EN.ID_RISK_DESCRIPTION_COMMENT = RDC.ID_RISK_DESCRIPTION_COMMENT AND N.ID_NOTIFICATION = RDC.ID_NOTIFICATION AND DATE_FORMAT(EN.START_DATE,'%d%m%y') = DATE_FORMAT(NOW(), '%d%m%y') AND EN.ID_STATION = ".$station." ORDER BY START_DATE DESC";
		if ($limit != '') $sql = $sql.' LIMIT '.$limit;
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		
		break;
	
  case 'active-notification':
		$sql = "select N.SHORT_DESCRIPTION variable, RDC.RISK risk,  RDC.DESCRIPTION description from EVENT_NOTIFICATION EN, RISK_DESCRIPTION_COMMENT RDC, NOTIFICATION N WHERE ISNULL(END_DATE) AND EN.ID_RISK_DESCRIPTION_COMMENT = RDC.ID_RISK_DESCRIPTION_COMMENT AND N.ID_NOTIFICATION = RDC.ID_NOTIFICATION AND EN.ID_STATION = ".$station." ORDER BY START_DATE DESC";
		if ($limit != '') $sql = $sql.' LIMIT '.$limit;
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		
		break;
   case 'last-update':
		$sql = "select ROUND((UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(DATE))/60,0) ultact from MEASURES WHERE MEASURES.ID_STATION = ".$station." ORDER BY DATE DESC LIMIT 1";
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		
		break;
   case 'client-mail':
		if (notExists($mail)) {echo "Complete mail "; $response = ""; break;}	
		$sql2 = "select IF(COUNT(EMAIL) > 0, 'si', 'no') EXISTS_MAIL, EMAIL from POTENTIAL_CUSTOMER WHERE LCASE(EMAIL) = LCASE('".$mail."')";
		$result = mysql_query($sql2);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		break;
	case 'actual':
		if (strtoupper($variable) == 'LLUVIA' || strtoupper($variable) == 'PRECIPITACIONES') {
			$sql = "SELECT 'Precipitaciones' variable, V.DESCRIPTION tooltip, V.ICON_FILENAME filename, SUM(VALUE) acum, 'mm' unit FROM MEASURES M, VARIABLE V WHERE DATE_FORMAT(M.DATE,'%d%m%Y') = DATE_FORMAT(NOW(),'%d%m%Y') AND M.ID_STATION = ".$station." AND M.ID_VARIABLE = 2 AND V.ID_VARIABLE = 2";
		} else if (strtoupper($variable) == 'INTENSIDAD' ) {
			$sql = "SELECT V.ICON_FILENAME filename, CONCAT(DATE_FORMAT(DATE_SUB(A.DATE,INTERVAL 30 MINUTE),'%H:%i'), ' a ', DATE_FORMAT(A.DATE,'%H:%i'),' hs') HOUR, CONCAT(CAST(A.VALUE AS CHAR), ' mm')  VALUE, RI.DESCRIPTION INTENSITY FROM (SELECT * FROM MEASURES WHERE ID_VARIABLE = 2 AND ID_STATION = ".$station.") A, (SELECT * FROM MEASURES WHERE ID_VARIABLE = 12 AND ID_STATION = ".$station.") B, RAINFALL_INTENSITY RI, VARIABLE V WHERE A.DATE = B.DATE AND V.ID_VARIABLE = 12 and RI.ID_RAINFALL_INTENSITY = B.VALUE AND DATE_FORMAT(A.DATE,'%d%m%Y') = DATE_FORMAT(NOW(),'%d%m%Y')";
		}else{
			$sql = "SELECT V.SHORT_DESCRIPTION variable, V.DESCRIPTION tooltip, V.ICON_FILENAME filename, V.UNIT unit, M.max, M.min, M.avg, M.actual, IFNULL(ROUND(((M.actual-M.min)/(M.max-M.min)),1),1) perc FROM (SELECT M1.ID_VARIABLE id_variable, ROUND(MAX(M1.VALUE),1) max, ROUND(MIN(M1.VALUE),1) min, ROUND(AVG(M1.VALUE),1) avg,ROUND((SELECT ROUND(M2.VALUE,2) FROM MEASURES M2 WHERE M2.ID_STATION = ".$station." AND M1.ID_VARIABLE = M2.ID_VARIABLE AND M1.ID_VARIABLE != 2 ORDER BY M2.DATE DESC LIMIT 1),1) actual FROM MEASURES M1 WHERE M1.ID_STATION = ".$station." AND DATE_FORMAT(M1.DATE,'%d/%m%Y') = DATE_FORMAT(NOW(),'%d/%m%Y') GROUP BY M1.ID_VARIABLE) M, VARIABLE V WHERE V.SHOW_FE = 1 AND M.id_variable = V.ID_VARIABLE and M.ID_VARIABLE != 2";
			if ($variable != '') $sql = $sql.' AND UCASE(V.DESCRIPTION) = UCASE("'.$variable.'")';
		}
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		break;
	case 'tabla-resumen':
		$sql = "SELECT VARIABLE, VAR, CONCAT(IFNULL(CAST(ACTUAL AS CHAR),0.00),UNIT) ACTUAL,CONCAT(CAST(D_MIN AS CHAR),UNIT) D_MIN,CONCAT(CAST(D_MAX AS CHAR),UNIT) D_MAX, CONCAT(CAST(D_AVG AS CHAR),UNIT) D_AVG,CONCAT(CAST(M_MIN AS CHAR),UNIT) M_MIN,CONCAT(CAST(M_MAX AS CHAR),UNIT) M_MAX,CONCAT(CAST(M_AVG AS CHAR),UNIT) M_AVG, CONCAT(CAST(A_MIN AS CHAR),UNIT) A_MIN,CONCAT(CAST(A_MAX AS CHAR),UNIT) A_MAX,CONCAT(CAST(A_AVG AS CHAR),UNIT) A_AVG FROM (SELECT * FROM (SELECT V.SHORT_DESCRIPTION VARIABLE, V.ID_VARIABLE VAR, CONCAT(' ',IFNULL(V.UNIT,'')) UNIT, M.actual ACTUAL FROM (SELECT M1.ID_VARIABLE id_variable, ROUND(MAX(M1.VALUE),1) max, ROUND(MIN(M1.VALUE),1) min, ROUND(AVG(M1.VALUE),1) avg,ROUND((SELECT ROUND(M2.VALUE,2) FROM MEASURES M2 WHERE M1.ID_STATION = ".$station." AND M2.ID_STATION = ".$station." AND M1.ID_VARIABLE = M2.ID_VARIABLE AND M1.ID_VARIABLE != 2 ORDER BY M2.DATE DESC LIMIT 1),1) actual FROM MEASURES M1 WHERE DATE_FORMAT(M1.DATE,'%d/%m%Y') = DATE_FORMAT(NOW(),'%d/%m%Y') GROUP BY M1.ID_VARIABLE) M, VARIABLE V WHERE V.SHOW_FE = 1 AND M.id_variable = V.ID_VARIABLE) ACTUAL,(SELECT M.ID_VARIABLE D_VAR, ROUND(MIN(VALUE),2) D_MIN, ROUND(MAX(VALUE),2) D_MAX, ROUND(AVG(VALUE),2) D_AVG FROM MEASURES M, VARIABLE V WHERE M.ID_STATION = ".$station." AND M.ID_VARIABLE = V.ID_VARIABLE AND V.SHOW_FE = 1 AND DATE_FORMAT(DATE, '%d/%m/%Y') = DATE_FORMAT(NOW(), '%d/%m/%Y') GROUP BY M.ID_VARIABLE ORDER BY D_VAR) HOY,(SELECT M.ID_VARIABLE M_VAR, ROUND(MIN(VALUE),2) M_MIN, ROUND(MAX(VALUE),2) M_MAX, ROUND(AVG(VALUE),2) M_AVG FROM MEASURES M, VARIABLE V WHERE M.ID_STATION = ".$station." AND M.ID_VARIABLE = V.ID_VARIABLE AND V.SHOW_FE = 1 AND DATE_FORMAT(DATE, '%m/%Y') = DATE_FORMAT(NOW(), '%m/%Y') GROUP BY M.ID_VARIABLE ORDER BY M_VAR) MENSUAL,(SELECT M.ID_VARIABLE A_VAR, ROUND(MIN(VALUE),2) A_MIN, ROUND(MAX(VALUE),2) A_MAX, ROUND(AVG(VALUE),2) A_AVG FROM MEASURES M, VARIABLE V WHERE M.ID_STATION = ".$station." AND M.ID_VARIABLE = V.ID_VARIABLE AND V.SHOW_FE = 1 AND DATE_FORMAT(DATE, '%Y') = DATE_FORMAT(NOW(), '%Y') GROUP BY M.ID_VARIABLE ORDER BY A_VAR) ANUAL WHERE HOY.D_VAR = MENSUAL.M_VAR AND MENSUAL.M_VAR = ANUAL.A_VAR AND ACTUAL.VAR = HOY.D_VAR) TABLA";
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		break;
	case 'horas-luz':
		if (notExists($fdesde) || notExists($fhasta)) {echo "Complete fdesde, fhasta"; $response = ""; break;}	
		$sql = "select ROUND(SUM(TIMESTAMPDIFF(MINUTE, SUNRISE, SUNSET)/60),2) VALUE from SUNRISE_SUNSET_INFORMATION SSI, STATION S WHERE SSI.ID_STATION_INFORMATION = S.ID_STATION_INFORMATION AND S.ID_STATION = ".$station." AND DATE BETWEEN STR_TO_DATE('".$fdesde."','%Y-%m-%d') AND STR_TO_DATE('".$fhasta."','%Y-%m-%d') ORDER BY DATE DESC";
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		break;

	case 'horas-frio':
		if (notExists($tempref) || notExists($fdesde) || notExists($fhasta)) {echo "Complete fdesde, fhasta, tempref"; $response = ""; break;}	

		$sql = "SELECT COUNT(*) VALUE FROM(SELECT AVG(VALUE) TEMP, DATE_FORMAT(MEASURES.DATE,'%d-%m-%Y %k') HOUR FROM MEASURES WHERE ID_VARIABLE = 1 AND ID_STATION = ".$station." AND MEASURES.DATE BETWEEN STR_TO_DATE('".$fdesde."','%Y-%m-%d') AND STR_TO_DATE('".$fhasta."','%Y-%m-%d') GROUP BY HOUR ORDER BY HOUR DESC) T WHERE TEMP <= ".$tempref; 
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		break;
	case 'lluvia-acumulada':
		if (notExists($fdesde) || notExists($fhasta)) {echo "Complete fdesde, fhasta"; $response = ""; break;}	

		$sql = "SELECT ROUND(SUM(VALUE),2) VALUE FROM MEASURES WHERE ID_VARIABLE = 2 AND ID_STATION = ".$station." AND MEASURES.DATE BETWEEN STR_TO_DATE('".$fdesde."','%Y-%m-%d') AND STR_TO_DATE('".$fhasta."','%Y-%m-%d')";
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		break;
	case 'grados-dia':
		if (notExists($tempref) || notExists($fdesde) || notExists($fhasta)) {echo "Complete fdesde, fhasta, tempref"; $response = ""; break;}	

		$sql = "SELECT ROUND(SUM(VALUE),2) VALUE FROM(SELECT IF((((MAX(VALUE)+MIN(VALUE))/2)-".$tempref.")>0,(((MAX(VALUE)+MIN(VALUE))/2)-".$tempref."),0) VALUE, DATE_FORMAT(DATE, '%d/%m/%Y') DATE2 from MEASURES WHERE ID_VARIABLE = 1 AND ID_STATION = ".$station." AND MEASURES.DATE BETWEEN STR_TO_DATE('".$fdesde."','%Y-%m-%d') AND STR_TO_DATE('".$fhasta."','%Y-%m-%d') GROUP BY DATE2) T";
		$result = mysql_query($sql);	
		$items = array();
		$i = 0;
		while($row = mysql_fetch_array($result,MYSQL_ASSOC)){
			$items[$i] = $row;
			$i++;
		}
		$response = $items;
		break;
	case 'graph-data':
		class Variable { 
			public $code = ''; 		public $unit = ''; 	public $description = ''; 
			public $yscale = ''; 	public $ydata = '';
			public $mscale = ''; 	public $mdata = '';
			public $wscale = ''; 	public $wdata = '';
			public $dscale = ''; 	public $ddata = '';
		} 
		$result = mysql_query( "SELECT ID_VARIABLE, SHORT_DESCRIPTION DESCRIPTION, CODE, UNIT FROM VARIABLE WHERE SHOW_FE = 1"); $items = array();
		while($row = mysql_fetch_array($result)){
			$var = $row['CODE'];
			$v = new Variable;
			$v->code = $row['CODE']; 
			$v->description = $row['DESCRIPTION'];
			$v->unit = $row['UNIT'];
			/* escala anual */
			$data = ""; $data1 = "";
			$resultY = mysql_query(	"SELECT * FROM (SELECT DATE_FORMAT(M.DATE,'%m/%Y') DATEFORMATED, ROUND(IF(V.ID_VARIABLE = 2,SUM(VALUE),AVG(VALUE)),2) VALUE FROM MEASURES M, VARIABLE V WHERE M.ID_VARIABLE = V.ID_VARIABLE AND V.CODE = '".$var."' GROUP BY DATEFORMATED ORDER BY DATE DESC) T ORDER BY 1");
			while($row1 = mysql_fetch_array($resultY)){
				$data = $data."'".$row1['DATEFORMATED']."',";
				$data1 = $data1.$row1['VALUE'].",";
			}
			$v->yscale = "[".substr_replace($data, "", -1)."]";
			$v->ydata = "[".substr_replace($data1, "", -1)."]";
			/* escala mensual */
			$data = ""; $data1 = "";
			$resultM = mysql_query(	"
			SELECT * FROM (SELECT DATE_FORMAT(DATE,'%d/%m') DATEFORMATED, ROUND(IF(V.ID_VARIABLE = 2,SUM(VALUE),AVG(VALUE)),2) VALUE, DATE FROM MEASURES M, VARIABLE V WHERE M.ID_VARIABLE = V.ID_VARIABLE AND V.CODE = '".$var."' AND DATE BETWEEN DATE_SUB(NOW(),INTERVAL 30 DAY) AND NOW() GROUP BY DATEFORMATED ORDER BY DATE DESC) T ORDER BY DATE");
			while($row1 = mysql_fetch_array($resultM)){
				$data = $data."'".$row1['DATEFORMATED']."',";
				$data1 = $data1.$row1['VALUE'].",";
			}
			$v->mscale = "[".substr_replace($data, "", -1)."]";
			$v->mdata = "[".substr_replace($data1, "", -1)."]";
			/* escala semanal */
			$data = ""; $data1 = "";
			$resultW = mysql_query(	"SELECT * FROM (SELECT DATE_FORMAT(DATE,'%W %d/%m') DATEFORMATED, ROUND(IF(V.ID_VARIABLE = 2,SUM(VALUE),AVG(VALUE)),2) VALUE, DATE FROM MEASURES M, VARIABLE V WHERE M.ID_VARIABLE = V.ID_VARIABLE AND V.CODE = '".$var."' GROUP BY DATEFORMATED ORDER BY DATE DESC LIMIT 7) T ORDER BY DATE");
			while($row1 = mysql_fetch_array($resultW)){
				$data = $data."'".$row1['DATEFORMATED']."',";
				$data1 = $data1.$row1['VALUE'].",";
			}
			$v->wscale = "[".substr_replace($data, "", -1)."]";
			$v->wdata = "[".substr_replace($data1, "", -1)."]";
			/* escala diaria */
			$data = ""; $data1 = "";
			$resultD = mysql_query(	"SELECT * FROM (SELECT DATE_FORMAT(DATE,'%Hh') DATEFORMATED, DATE, ROUND(IF(V.ID_VARIABLE = 2,SUM(VALUE),AVG(VALUE)),2) VALUE FROM MEASURES M, VARIABLE V WHERE V.ID_VARIABLE = M.ID_VARIABLE AND V.CODE = '".$var."' GROUP BY DATE_FORMAT(DATE,'%d/%m/%Y %H:00') ORDER BY DATE DESC LIMIT 24) T ORDER BY DATE");
			while($row1 = mysql_fetch_array($resultD)){
				$data = $data."'".$row1['DATEFORMATED']."',";
				$data1 = $data1.$row1['VALUE'].",";
			}
			$v->dscale = "[".substr_replace($data, "", -1)."]";
			$v->ddata = "[".substr_replace($data1, "", -1)."]";
			array_walk_recursive($v, 'encode_items');
			array_push($items, $v);
		}
		$response = $items;		
		break;
	}
	mysql_close($con);



	if ($response == '') exit(1);
	if($req != 'graph-data') array_walk_recursive($response, 'encode_items');
	$rta = "";
	if (isset($_GET['callback'])) $rta = $rta.$_GET['callback'];
	$entries = '({"entries":'.json_encode($response).'})';
	echo $rta.$entries;
	
	$fichero = './files/station'.$station.'-'.$req.'.json';
	file_put_contents($fichero, $entries);
?>