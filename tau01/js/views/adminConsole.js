var AdminConsole = {};

AdminConsole.ExecuteInsert = function () {
	action = $("#admin-console-action").val();
	password = $("#admin-console-password").val();
	if (typeof action === 'undefined' || typeof password === 'undefined' || action === '' || password === '') {
		toastr.error('Complete todos los campos', 'Error');
		return;
	}
	$.ajax({
		type: 'GET', url: 'http://www.tau01.com/data/insert.php', 
		data: 'action=' + action + '&password=' + password,
		success: function (data) {
			if (data.indexOf('Error') === 0) {
				return toastr.error(data, 'Resultado de la Ejecuci&oacute;n');
			} else {
				return toastr.success(data, 'Resultado de la Ejecuci&oacute;n');
			}
		},
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
};

AdminConsole.Show = function () {
	$.ajax({
		url: 'admin-console.htm',dataType: 'html',type: 'GET',
        error: function (request, error) {errorHandler2(request, error);},
		success: function (data) {
			$("#content-admin-console-div").html(data);
			load($("#li-admin-console"), $("#content-admin-console-div"), 0);
		}
	});
};
