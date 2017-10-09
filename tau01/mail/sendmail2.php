<?php
include("class.phpmailer.php"); 
include("class.smtp.php"); 
require_once 'class.phpmailer.php';



$name = $_GET['contact-name'];
$email = $_GET['contact-email'];
$message = $_GET['contact-message'];

if (is_null($name) || $name == ''){
	echo 'Complete el nombre'; exit;
}
if (is_null($email) || $email == ''){
	echo 'Complete el e-mail'; exit;
}
if (is_null($message) || $message == ''){
	echo 'Complete el cuerpo del mensaje'; exit;
}


 
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




$mail->AddAddress("info@techner.com.ar");
$mail->Subject = "Techner Argentina :: Nuevo Usuario";
$mail->Body = "Ha ingresado el usuario: ".$name." con email ".$email;
$mail->AltBody = "Ha ingresado el usuario: ".$name." con email ".$email."";
if(!$mail->Send()) { 
	echo "Error: " . $mail->ErrorInfo; 
} else { 
	echo "Mensaje enviado correctamente"; 
}

?>