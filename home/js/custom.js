$(document).ready(function() {
	$("#loginform-error").hide();
	$("#loginform-send").hide();

	$("body").css("display", "none");
    $("body").fadeIn(2000);
	$("a.transition").click(function(event){
		event.preventDefault();
		linkLocation = this.href;
		$("body").fadeOut(1000, redirectPage);		
	});
	function redirectPage() {
		window.location = linkLocation;
	}
	$("#contact-submit").click(function(){
		$("#loginform-error").hide();
		$("#loginform-send").hide();
		var email = $("#contact-mail").val();
		var name = $("#contact-name").val();
		var message = $("#contact-message").val();
		var invalid = false;
		if (name.length < 4) invalid = true;
		if (email.length < 4) invalid = true;
		if (!validateEmail(email)) invalid = true;
		if (invalid) {
			$("#loginform-error").show();
		} else {
			$.ajax({
			type: 'GET',
            url: 'http://techner.com.ar/mail/sendmail.php',
			data:'contact-email='+ email + '&contact-name=' + name + '&contact-message='+message,
			success: function(data) {
				$("#contact-mail").val("");
				$("#contact-name").val("");
				$("#contact-message").val("");
				$("#loginform-send").html(data);
				$("#loginform-send").show();

			}
		});
		}
	});
});

function validateEmail(email) {
	if (email.indexOf("@") == -1) return false;
	if (email.indexOf(".") == -1) return false;
	if (email.length < 6) return false;
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	if( !emailReg.test(email ) ) {
		return false;
	} else {
		return true;
	}
}
