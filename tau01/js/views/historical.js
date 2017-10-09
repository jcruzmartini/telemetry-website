var Historical = {};

Historical.LoadMeasures = function (rta) {
	if (rta.success) {
		var lines = '';
		var line = '';
		var data = '';
		var export_data = '';
		var ii = 0;
		var tabla = "<table class='table table-bordered table-striped table-condensed table-responsive' style='white-space:nowrap;width:0%;margin-left:auto; margin-right:auto;'>";
		tabla += "<thead><tr><th>Variable</th><th>Fecha</th><th>Hora</th><th>Valor</th></thead>";
		$.each(rta.result.entries, function (i, o) {
			$.each(o.values, function (j, o1) {
				ii++;
				if (ii < 1000) {
					line = '<tr>';
					limit = ii;
				} else {
					limit = 1000;
					line = '<tr class="tr-hidden">';
				}
				export_data += o.variable.name + '%2C' + ts2string(o1.date).replace(' ', '%2C') + '%2C' + o1.value + ' ' + o.variable.unit + '%0A';
				line += '<td style="padding: 5px 15px 5px 15px;"><strong>' + o.variable.name + '</strong></td>'+'<td style="padding: 5px 15px 5px 15px;">'+ts2string(o1.date).split(' ')[0]+'</td>'+'<td style="padding: 5px 15px 5px 15px;">'+ts2string(o1.date).split(' ')[1]+'</td><td style="padding: 5px 15px 5px 15px;">'+o1.value+' '+ o.variable.unit + '</td></tr>';
				lines += line;
			})
		});


		export_data = toHtml(unescape(encodeURIComponent(toHtml(export_data))));
		data = '<div style="text-align:center;width:100%;display: block;margin-left: auto;margin-right: auto;"><a download="datos.csv" target="_blank" id="download-historical-data" href="data:application/csv;charset=utf-8,'+export_data+'"><strong>Exportar a Excel</strong></a></div>';
		tabla += data;
		tabla += "<tbody>" + lines + "</tbody></table>";
		data = '<span style="text-align:center;">Se est&aacute;n mostrando solo '+limit+' de los '+ii+' resultados devueltos. Para descargar la informaci&oacute;n en un <strong>Excel</strong>, presione <a download="datos.csv" target="_blank" id="download-historical-data" href="data:application/csv;charset=utf-8,'+export_data+'"><strong>Aqu&iacute;</strong></a></span>';

		tabla += data;

		$('#historical-results').html(tabla);
		$('#historical-footer').css('height','0px');
		$(".tr-hidden").hide();
		$("#btn-show-historical").click(function () {
			$(".tr-hidden").show();
			$("#btn-show-historical").hide();
		});
		$('#loading-window').modal('hide');
		$('#loading-window').css('visibility','hidden');
	}
};

Historical.Query = function () {
	$('#historical-error').hide();
	Tau.ListOfVar = '';
	$('#selectVariable :selected').each(function(i, selected){
		Tau.ListOfVar += $(selected).val() + ',';
	});
	if (Tau.ListOfVar == '' || $('#fechadesde').attr('value').trim() == '' || $('#fechadesde').attr('value').trim() == ''){
		$('#historical-error').show();
		return;
	}
	Tau.ActiveStation = jQuery.parseJSON(Cookie.Get('activeStation'));
	var initDate = $('#fechadesde').attr('value') + ' 00:00:00';
	var endDate = $('#fechahasta').attr('value') + ' 23:59:59';
	var tabla = "<table class='table table-bordered table-striped table-condensed table-responsive' style='white-space:nowrap;width:0%;margin-left:auto; margin-right:auto;'>";
	tabla += "<thead><tr><th>Variable</th><th>Fecha</th><th>Hora</th><th>Valor</th></thead>";
	$("#loading-percentage").html("");
	$('#loading-window').css('visibility','visible');
	$('#loading-window').modal('show');
	var ii = 0, limit = 0;
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/measures/" + Tau.ActiveStation.id + "/historical?initDate="+string2ts(initDate)+"&endDate="+string2ts(endDate)+"&codes="+Tau.ListOfVar+"&eToken="+encodeURIComponent(Tau.AuthorizationToken),
		dataType: "json",
		success: Historical.LoadMeasures,
        error: function (request, error) {errorHandler2(request, error);$('#loading-window').modal('hide');},
		failure: function (errMsg) {errorHandler(errMsg);$('#loading-window').modal('hide');}
	});
};

Historical.LoadAllVariables = function (rta, data) {
	if (rta.success) {
		$("#content-historical-div").html(data);
		$('#historical-error').hide();
		$.each(rta.result.entries, function (i, o) {
			$("#selectVariable").append(new Option(o.name, o.code));
		});
		$("#selectVariable").chosen();
		$('#fechadesde').datepicker({ dateFormat: 'dd/mm/yy'});
		$('#fechahasta').datepicker({ dateFormat: 'dd/mm/yy'});
		$('#fechadesde').val(ts2string2(date2ts(new Date())));
		$('#fechahasta').val(ts2string2(date2ts(new Date())));
		load($("#li-historical"), $("#content-historical-div"), 0);
		$("#consultar-historicos").click(Historical.Query);
	}
};

Historical.Load = function (data) {
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/entity/"+Tau.ActiveStation.id+"/variable/all",
		data : {"eToken":Tau.AuthorizationToken},
		dataType: "json",
		success: function (rta) {Historical.LoadAllVariables(rta, data);},
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
};

Historical.Show = function (){
	Tau.ActiveStation = jQuery.parseJSON(Cookie.Get('activeStation'));
	$.ajax({
		url: 'historical.htm',dataType: 'html',type: 'GET',
        error: function (request, error) {errorHandler2(request, error);},
		success: Historical.Load
	});
};
