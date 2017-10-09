<?php
include("class.phpmailer.php"); 
include("class.smtp.php"); 
require_once 'class.phpmailer.php';
 
$mail = new phpmailer();
$mail->PluginDir = "";
$mail->Mailer = "smtp";
$mail->Host = "ssl://mail.techner.com.ar";
$mail->Port="465";
$mail->SMTPAuth = true;
$mail->Username = "carlosfontana@techner.com.ar";
$mail->Password = "carlitoz123";
$mail->From = "carlosfontana@techner.com.ar";
$mail->FromName = "Techner Argentina";
$mail->Timeout=30;


$req =  strtolower($_GET['req']);
if ($req == 'nuevo-usuario'){
	$name = $_GET['contact-name'];
	$email = $_GET['contact-email'];
	$message = $_GET['contact-message'];

	$mail->AddAddress("info@techner.com.ar");
	$mail->Subject = "TECHNER TAU.01 :: Nuevo Usuario ".$name;
	$mail->Body = "Ha ingresado el usuario: ".$name." con email ".$email;
	$mail->AltBody = "Ha ingresado el usuario: ".$name." con email ".$email."";
} else if ($req == 'consulta'){
	$name = $_GET['contact_name'];
	$email = $_GET['contact_email'];
	$subject = $_GET['contact_subject'];
	$message = $_GET['contact_message'];
	$mail->AddAddress($email);
	$mail->AddAddress("info@techner.com.ar");
	$mail->Subject = "TECHNER TAU.01 :: Consulta desde el Sitio Web";
	$mail->Body = "Gracias por contactarse con Techner @Argentina.<br>Nos estaremos comunicando a la brevedad.<br><br>---<br>Consulta: ".$subject."<br>".$message;
	$mail->AltBody = "Gracias por contactarse con Techner @Argentina.\nNos estaremos comunicando a la brevedad.\n\n---\nConsulta: ".$subject."\n".$message;
} else if ($req == 'verificacion'){
	$email = $_GET['email'];
	$number = $_GET['number'];

	$mail->AddAddress($email);
	$mail->Subject = "TECHNER TAU.01 :: Bienvenido";
	$mail->Body = "Gracias por utilizar el servicio TAU.01 de TECHNER.<br/>El Código de Verificación es: ".$number;
	$mail->AltBody = "Gracias por utilizar el servicio TAU.01 de TECHNER.\nEl Código de Verificación es: ".$number;
} else if ($req == 'recuperar'){
	$email = $_GET['email'];
	$temp = $_GET['temp'];
	$mail->AddAddress($email);
	$mail->Subject = "TECHNER TAU.01 :: Recuperacion de Password";
	$mail->Body = "Gracias por utilizar el servicio TAU.01 de TECHNER.<br/>Su Password temporal es ". $temp.'<br />Acceda al Sitio Web yendo a http://www.tau01.com';
	$mail->AltBody = "Gracias por utilizar el servicio TAU.01 de TECHNER.\nSu Password temporal es ". $temp.'\nAcceda al Sitio Web yendo a http://www.tau01.com';
}

if(!$mail->Send()) { 
	echo "Error: " . $mail->ErrorInfo; 
} else { 
	echo "Mensaje enviado correctamente"; 
}

?>