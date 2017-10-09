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




$mail->AddAddress($email);
$mail->AddAddress("info@techner.com.ar");
$mail->Subject = "Techner Argentina :: Consulta desde el sitio web";
$mail->Body = "Gracias por contactarse con Techner @Argentina.<br>Nos estaremos comunicando a la brevedad.<br><br>---<br>Consulta: ".$message;
$mail->AltBody = "Gracias por contactarse con Techner @Argentina.\nNos estaremos comunicando a la brevedad.\n\n---\nConsulta: ".$message;
if(!$mail->Send()) { 
	echo "Error: " . $mail->ErrorInfo; 
} else { 
	echo "Mensaje enviado correctamente"; 
}

?>