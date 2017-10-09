var ControlPanel = {};

ControlPanel.LoadResume =  function (data) {
	$("#content-resume-div").html(data);
	Tau.UserData2 = jQuery.parseJSON(Cookie.Get('userData'));
	if (typeof Tau.UserData2.is_admin == "undefined" || !Tau.UserData2.is_admin) {
		$('#btn-actualizar-inicio').hide();
		$('#change_station').hide();
		$('.profile-link').hide();
	}else{
		$('#btn-actualizar-inicio').show();
		$('#change_station').show();
		$('.profile-link').show();
	}

	var ww = $(window).width();
	if (ww < 600) {
		$(".hideonphone").hide();
	}
	$("#btn-actualizar-inicio").hide();
	$("#btn-actualizar").click(function () {
		$('#test_modal').modal('hide');
		Tau.ActiveStation = jQuery.parseJSON(Cookie.Get('activeStation'));
		//console.log(Tau.ActiveStation);
		$.ajax({
			type: 'GET', url: Tau.Configurator.wsUrl + "/operations/" + Tau.ActiveStation.id + "?operation=INFO&force=true",
			data : {"eToken":Tau.AuthorizationToken},
			dataType: "json",
			success: function (response){},
	        error: function (request, error) {errorHandler2(request, error);},
			failure: function (errMsg) {errorHandler(errMsg);}
		});
	});
	$('#variables-table').hide();
	Tau.ActiveStation = jQuery.parseJSON(Cookie.Get('activeStation'));
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/stations/" + Tau.ActiveStation.id + "/info",
		data : {"eToken":Tau.AuthorizationToken},
		dataType: "json",
		success: Stations.ShowInfo,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/measures/" + Tau.ActiveStation.id + "/summary",
		data : {"eToken":Tau.AuthorizationToken},
		dataType: "json",
		success: Measures.LoadSummary,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
	Tau.ActiveStation = jQuery.parseJSON(Cookie.Get('activeStation'));
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/entity/" + Tau.ActiveStation.id + "/variable/all",
		data : {"eToken":Tau.AuthorizationToken},
		dataType: "json",
		success: function (rta) {Stations.LoadAllVariables(rta, Tau.ActiveStation);},
        error: function (request, error) {errorHandler2(request, error);$('#loading-window').modal('hide');},
		failure: function (errMsg) {errorHandler(errMsg);$('#loading-window').modal('hide');}
	});
	$('#variables-table').hide();
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/measures/" + Tau.ActiveStation.id + "/actual",
		data : {"eToken":Tau.AuthorizationToken},
		dataType: "json",
		success: Measures.LoadCurrent,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/notifications/" + Tau.ActiveStation.id + "/active",
		data : {"eToken":Tau.AuthorizationToken},
		dataType: "json",
		success: Notifications.LoadForResume,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
	var prec = parseFloat($('#precipitaciones').html());

};

ControlPanel.ShowResume = function () {
	$.ajax({
		url: 'resume.htm', dataType: 'html', type: 'GET',
        error: function (request, error) {errorHandler2(request, error);},
		success: ControlPanel.LoadResume
	});
};

ControlPanel.Show = function () {
	load($("#li-resume"), $("#content-resume-div"), 0);
};
