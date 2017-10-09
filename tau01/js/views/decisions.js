var Decisions = {};

Decisions.GenerateTdDReport = function (inf) {
	$("#" + inf + "-result").css("visibility", "hidden");
	$("#" + inf + "-result").val("");
	var result = $("#" + inf + "-result");
	var fdesde = string2ts($("#" + inf + "-fde-div").val());
	var fhasta = string2ts($("#" + inf + "-fha-div").val());
	var ref = $("#" + inf + "-ref-div").val();
	var type = '';
	if (inf === 'igd') {type = 'grados-dia';};
	if (inf === 'ihf') {type = 'horas-frio';};
	if (inf === 'ihl') {type = 'horas-luz';};
	if (inf === 'ila') {type = 'lluvia-acumulada';};
	if (inf === 'iev') {type = 'evapotranspiration';};

	var data2 = 'initDate=' + fdesde + '&endDate=' + fhasta + '&param=' + ref + '&type='+type +'&eToken='+encodeURIComponent(Tau.AuthorizationToken);
	Tau.ActiveStation = jQuery.parseJSON(Cookie.Get('activeStation'));
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/custom-queries/" + Tau.ActiveStation.id + "/query?" + data2,
		dataType: "json",
		success: function (rta) {
			if (rta.success) {
				result.html(rta.result.value + ' ' + type);
				result.removeClass('hidden');
				result.removeClass('visible');
				result.css('visibility','visible');
			}
		},
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
};

Decisions.Load = function (data) {
	$("#content-decisions-div").html(data);
	$('#igd-fde-div').datepicker({ dateFormat: 'dd/mm/yy'});
	$('#ihf-fde-div').datepicker({ dateFormat: 'dd/mm/yy'});
	$('#ihl-fde-div').datepicker({ dateFormat: 'dd/mm/yy'});
	$('#ila-fde-div').datepicker({ dateFormat: 'dd/mm/yy'});
	$('#iev-fde-div').datepicker({ dateFormat: 'dd/mm/yy'});

	$('#igd-fha-div').datepicker({ dateFormat: 'dd/mm/yy'});
	$('#ihf-fha-div').datepicker({ dateFormat: 'dd/mm/yy'});
	$('#ihl-fha-div').datepicker({ dateFormat: 'dd/mm/yy'});
	$('#ila-fha-div').datepicker({ dateFormat: 'dd/mm/yy'});
	$('#iev-fha-div').datepicker({ dateFormat: 'dd/mm/yy'});

	var today = ts2string2(date2ts(new Date()));
	$("#igd-fha-div").val(today);
	$("#ihf-fha-div").val(today);
	$("#ihl-fha-div").val(today);
	$("#ila-fha-div").val(today);
	$("#iev-fha-div").val(today);

	$("#igd-fde-div").val(addDays(today,'-30'));
	$("#ihf-fde-div").val(addDays(today,'-30'))
	$("#ihl-fde-div").val(addDays(today,'-30'))
	$("#ila-fde-div").val(addDays(today,'-30'))
	$("#iev-fde-div").val(addDays(today,'-30'))

	load($("#li-decisions"), $("#content-decisions-div"), 0);
};

Decisions.Show = function () {
	$.ajax({
		url: 'decisions.htm', dataType: 'html',	type: 'GET',
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);},
		success: Decisions.Load
	});
};
