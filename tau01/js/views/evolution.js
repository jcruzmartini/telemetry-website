var Evolution = {};

Evolution.loadPercentage = function (value) {
	$('#loading-window').modal('show');
	setTimeout(function () {
		var per = $("#loading-percentage");
		var value2 = eval(per.html().substring(0, per.html().length - 1));
		if (value2 < 100) {
			per.html(value2 + 1 + "%");
			loadPercentage(value);
		} else {
			per.html("0%");
			$('#loading-window').modal('hide');
		}
	}, value / 100);
};

Evolution.FilterByDay = function(){
	var initDate = string2ts($('#evolution-fdesde1').val());
	var endDate = string2ts($('#evolution-fhasta1').val());
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/graphics/" + Tau.ActiveStation.id + "/evolution",
		data : {"eToken":Tau.AuthorizationToken, "initDate": initDate, "endDate": endDate},
		dataType: "json",
		success: Graphics.Load,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
	Evolution.loadPercentage(2000);
}

Evolution.FilterByWeek = function(){
	var initDate = string2ts($('#evolution-fdesde2').val());
	var endDate = string2ts($('#evolution-fhasta2').val());
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/graphics/" + Tau.ActiveStation.id + "/evolution",
		data : {"eToken":Tau.AuthorizationToken, "initDate": initDate, "endDate": endDate},
		dataType: "json",
		success: Graphics.Load,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
	Evolution.loadPercentage(2000);
}

Evolution.LoadContent = function (data) {
	$("#content-evolution-div").html(data);
	$('#evolution-fdesde1').datepicker({ dateFormat: 'dd/mm/yy'});
	$('#evolution-fhasta1').datepicker({ dateFormat: 'dd/mm/yy'});
	$('#evolution-fdesde2').datepicker({ dateFormat: 'dd/mm/yy'});
	$('#evolution-fhasta2').datepicker({ dateFormat: 'dd/mm/yy'});

	$("#evolution-fdesde1").val(ts2string2(date2ts(new Date())));
	$("#evolution-fhasta1").val(ts2string2(date2ts(new Date())));
	$("#evolution-fdesde2").val(ts2string2(date2ts(new Date())));
	$("#evolution-fhasta2").val(ts2string2(date2ts(new Date())));

	$("#evolution-fdesde1").val(addDays($("#evolution-fdesde1").val(),"-1"));
	$("#evolution-fdesde2").val(addDays($("#evolution-fdesde2").val(),"-7"));

	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/graphics/" + Tau.ActiveStation.id + "/evolution",
		data : {"eToken":Tau.AuthorizationToken},
		dataType: "json",
		success: Graphics.Load,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
	$('#informediario').click();
};

Evolution.Load = function () {
	Tau.ActiveStation = jQuery.parseJSON(Cookie.Get('activeStation'));
	$.ajax({
		url: 'evolution.htm',dataType: 'html',type: 'GET',
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);},
		success: Evolution.LoadContent
	});
};

Evolution.Show = function () {
	load($("#li-evolution"), $("#content-evolution-div"), 0);
	$('#informediario').click();
};
