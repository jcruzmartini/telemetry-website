var Profile = {};

Profile.Load = function (data) {
	Tau.UserData2 = jQuery.parseJSON(Cookie.Get('userData'));
	$("#content-profile-div").html(data);
	$("#inputNombre").val(Tau.UserData2.name);
	$("#inputApellido").val(Tau.UserData2.lastname);
	$("#inputEmail").val(Tau.UserData2.email);
	$("#inputPassword").val('');
	$("#inputPassword2").val('');
	load($("#li-profile"), $("#content-profile-div"), 0);
	$('#user-save').click(Profile.Save);
};

Profile.Show = function () {
	$.ajax({
		url: 'profile.htm', dataType: 'html', type: 'GET',
		success: Profile.Load,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
};

Profile.Save = function (){
	if ($("#inputPassword").attr('value')!=$("#inputPassword2").attr('value')){
		$('#profile-saving').html('No coinciden las password');
		return;
	}
	if ($("#inputPassword").attr('value').length == 0) {
		$('#profile-saving').html('Por favor, ingrese la password');
		return;
	}
	$('#profile-saving').html('Guardando..');
	var jsonrequest = {}; jsonrequest.request = {};
	jsonrequest.request.id = Tau.UserData2.id;
	jsonrequest.request.name = $("#inputNombre").attr('value');
	jsonrequest.request.lastname = $("#inputApellido").attr('value');
	jsonrequest.request.email = $("#inputEmail").attr('value');
	jsonrequest.request.password = $("#inputPassword").attr('value');
	
	$.ajax({
		type: 'PUT', url: Tau.Configurator.wsUrl + "/users?eToken="+encodeURIComponent(Tau.AuthorizationToken), 
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify(jsonrequest),	dataType: "json",
		success: function (rta) {
			$('#profile-saving').html('Datos Guardados');
			Tau.UserData2.name = jsonrequest.request.name;
			Tau.UserData2.password = jsonrequest.request.password;
			Tau.UserData2.lastname = jsonrequest.request.lastname;
			Tau.UserData2.email = jsonrequest.request.email;
			$('#user').attr('value',jsonrequest.request.email);
			Cookie.Set('userData', JSON.stringify(Tau.UserData2));
		},
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
};
