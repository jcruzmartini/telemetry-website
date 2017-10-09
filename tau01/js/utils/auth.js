var Auth = {};

Auth.ShowLogin = function () {
	var userData = {};
	if(typeof Cookie.Get('userData') != 'undefined') {
		try {
			userData = jQuery.parseJSON(Cookie.Get('userData'));
			Tau.AuthorizationToken = userData.token;
		} catch (e) {
			errorHandler('Error in parsing JSON from userDate (showLogin method)');
			Cookie.Delete('userData');
		}
	};
	if (!($.isEmptyObject(userData))) {
		Tau.StartApp();
		$("#user").html("&nbsp;" + userData.email);
		if (Cookie.Get("activeStation") == null) {
			$.each(userData.stations, function (i, fb) {
				if(fb.is_default == 1){
					Cookie.Set('activeStation',JSON.stringify(fb));
				}
			});
		}
		Tau.ActiveStation = jQuery.parseJSON(Cookie.Get('activeStation'));
		$('#station').html('<strong>Estaci&oacute;n</strong>: ' + Tau.ActiveStation.location);
		load($("#li-resume"), $("#content-resume-div"), 3500);
		$('.container-fluid').show();
		$('#header-resume').show();
		return;
	}
	$('.container-fluid').hide();
	$('#header-resume').hide();
	$("#login-email-form-error").hide();
	$('#login-email-form').modal('show');
	$("#login-olvide-password").click(Auth.ForgotPassword);
	$("#login-email-form-demo").click(Auth.SaveDemoForm);
	$("#login-email-form-ingresar").click(Auth.RealLogin);
	$('.login-input').keypress(function (e) {
		if (e.which == 13) {
			$("#login-email-form-ingresar").trigger("click");
			return false;
		}
	});
};

Auth.ForgotPassword = function () {
	$("#login-password-form-email").prop('disabled', true);
	$("#login-email-form-demo").hide();
	$("#login-olvide-password").hide();
	$("#login-email-form-ingresar").html('<i class="halflings-icon white envelope"></i>&nbsp;Recuperar');
	$("#login-email-msg").html('Ingrese su E-Mail y le enviaremos un correo electr&oacute;nico para recuperar su Contrase&ntilde;a:');
};

Auth.SaveDemoLogin = function (rta) {
	if (rta.success) {
		Tau.UserData2 = rta.result;
		Tau.AuthorizationToken = rta.result.token;
		Cookie.Set('userData', JSON.stringify(Tau.UserData2));
		$('#login-email-form').modal('hide');
		$("#user").html("&nbsp;" + Tau.UserData2.email);
		$("#loginform").modal('hide');
		var i = 0;
		$.each(Tau.UserData2.stations, function (i, fb) {
			if(fb.is_default == 1){
				Cookie.Set('activeStation',JSON.stringify(fb));
				$('#station').html('<strong>Estaci&oacute;n</strong>: ' + fb.location);
			}
			i++;
		});
		Tau.StartApp();
		load($("#li-resume"), $("#content-resume-div"), 3500);
	}
};
Auth.SaveDemoForm = function () {
	jsonrequest = {};
	jsonrequest.request = {};
	jsonrequest.request.email = 'demo@techner.com.ar';
	jsonrequest.request.password = 'demo';
	$.ajax({
		type: 'POST',
		url: Tau.Configurator.wsUrl + "/users/login",
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify(jsonrequest),
		dataType: "json",
		success: Auth.SaveDemoLogin,
		error: function (request, error) {
			errorHandler(error);
			buttoningresar.removeAttr('disabled');
			buttondemo.removeAttr('disabled');
			msg.html("Problemas accediendo, por favor reintente" );
			msg.show();
		},
		failure: function (errMsg) {
			errorHandler(errMsg);
			buttoningresar.removeAttr('disabled');
			buttondemo.removeAttr('disabled');
			msg.html("Problemas accediendo, por favor reintente");
			msg.show();
		}
	});
	$.ajax({
		type: 'POST',
		url: 'http://www.tau01.com/data/insert.php',
		data: 'action=USER&nombre=' + name + '&telefono=' + telefono + '&email=' + email + '&ciudad=' + ciudad,
		success: function (data) {
			return toastr.success(data, 'Gracias por utilizar los servicios TAU.01');
		}
	});
	$.ajax({
		type: 'GET',
		url: 'http://www.tau01.com/mail/sendmail.php',
		data: 'req=nuevo-usuario&contact-email=' + email + '&contact-name=' + name + '&contact-message=nuevo usuario',
		success: function (data) {}
	});
};

Auth.DemoLogin = function () {
	var email = $("#login-email-form-email").attr('value');
	var password = $("#login-password-form-email").attr('value');
	$("#login-email-form-ingresar").attr("disabled", "disabled");
	$("#login-email-form-demo").attr("disabled", "disabled");
	$("#loginform-email").attr('value', $("#login-email-form-email").attr('value'));
	$("#loginform-error").hide();
	$('#loginform-verif-div').hide();
	$('#login-email-form').hide();
	$('#loginform').modal('show');
	var number = 0;
	$('.demo-input').keypress(function (e) {
		if (e.which == 13) {
			$("#loginform-guardar").trigger("click");
			return false;
		}
	});
	$("#loginform-guardar").click(Auth.SaveDemoForm);
};

Auth.RealLogin = function () {
	var email = $("#login-email-form-email").attr('value');
	var password = $("#login-password-form-email").attr('value');
	var buttoningresar = $("#login-email-form-ingresar");
	var buttondemo = $("#login-email-form-demo");
	var msg = $("#login-email-form-error");
	var invalid = false;
	if (email.length < 4) {invalid = true};
	if (!validateEmail(email)) {invalid = true};
	if (invalid) {
		msg.html("Por favor, revise los datos ingresados");
		msg.show();
	} else {
		if ($("#login-email-form-ingresar").html().indexOf('Recuperar') > 0){
			var temp = 1 + Math.floor(Math.random() * 9999999);
			$("#login-email-msg").html('Se la ha enviado una <strong>Contrase&ntilde;a Temporal</strong> a su Correo Electr&oacute;nico, ingresela a continuaci&oacute;n:');
			$("#login-email-form-ingresar").html('<i class="halflings-icon white user"></i>&nbsp;Ingresar');
			$("#login-password-form-email").prop('disabled', false);
			$.ajax({
				type: 'GET',
				url: 'http://www.tau01.com/mail/sendmail.php',
				data: 'req=recuperar&email=' + email + '&temp=' + temp,
				success: function (data) {}
			});
			return -1;
			//TODO Falta ver como implementar el ingreso con la nueva clave que se gener&oacute;. Quizás una buena opci&oacute;n es guardar la clave en una variable gral y que el tipo se loguee, y si la variable est&aacute; llena, que verifique. Pero me parece inseguro. También se podría agregar un catpcha. A la vez, se carga mal el home una vez logueado.
		}
		msg.hide();
		buttoningresar.attr("disabled", "disabled");
		buttondemo.attr("disabled", "disabled");
		jsonrequest = {};
		jsonrequest.request = {};
		jsonrequest.request.email = email;
		jsonrequest.request.password = password;
		$.ajax({
			type: 'POST',
			url: Tau.Configurator.wsUrl + "/users/login",
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(jsonrequest),
			dataType: "json",
			success: Auth.Login,
			error: function (request, error) {
				buttoningresar.removeAttr('disabled');
				buttondemo.removeAttr('disabled');
				console.log(request, error);
				var responseText = JSON.parse(request.responseText);
				msg.html(request.status + ' ' + request.statusText + ' - ' + responseText.error_message);
				msg.show();
			},
			failure: function (errMsg) {
				console.log(errMsg);
				buttoningresar.removeAttr('disabled');
				buttondemo.removeAttr('disabled');
				msg.html(errMsg);
				msg.show();
			}
		});
	}
};

Auth.Login = function (rta) {
	var msg = $("#login-email-form-error");
	var buttoningresar = $("#login-email-form-ingresar");
	var buttondemo = $("#login-email-form-demo");

	if (rta.success) {
		Tau.UserData2 = rta.result;
		Tau.AuthorizationToken = rta.result.token;
		$('#login-email-form').modal('hide');
		$("#user").html("&nbsp;" + Tau.UserData2.email);
		Cookie.Set('userData', JSON.stringify(Tau.UserData2));
		var i = 0;
		$.each(Tau.UserData2.stations, function (i, fb) {
			if(fb.is_default == 1){
				Cookie.Set('activeStation',JSON.stringify(fb));
				$('#station').html('<strong>Estaci&oacute;n</strong>: ' + fb.location);
			}
			i++;
		});
		Tau.StartApp();
		load($("#li-resume"), $("#content-resume-div"), 3500)
	} else {
		msg.html("Usuario Inexistente");
		msg.show();
		buttoningresar.removeAttr('disabled');
		buttondemo.removeAttr('disabled');
	}
};

Auth.Logout = function (){
	Tau.UserData2 = jQuery.parseJSON(Cookie.Get('userData'));
	Cookie.Delete('userData');
	Cookie.Delete('activeStation');
	document.location.reload(true);
};
