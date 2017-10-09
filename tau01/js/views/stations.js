var Stations = {};

Stations.SelectStation = function (){
	var myRadio = $('input[name=change-station-option]');
	var checkedValue = myRadio.filter(':checked').val();
	$.each(userData.stations, function (i, fb) {
		if(fb.id == checkedValue){
			Cookie.Set('activeStation',JSON.stringify(fb));
			$('#change-station-div').modal('hide');
			document.location.reload(true);
		}
	});
};

Stations.ChangeStation = function () {
	var userData = jQuery.parseJSON(Cookie.Get('userData'));
	var j = 0;
	var stations = [];
	$.each(userData.stations, function (i, fb) {
		stations[j]=fb;
		j++;
	});
	if(j==1){
		bootbox.alert({message: 'Usted solo posee una estaci\u00F3n.<br />Comun\u00edquese con el Administrador ante cualquier inquietud.', title: 'Advertencia'});
	} else {
		var content = "";
		for (var i1 in stations) {
			content += '<label class="radio" style="position:relative;width:80%;left:5%;">';
			content += '<input type="radio" name="change-station-option" value="'+stations[i1].id+'" />'+stations[i1].location;
			content += '</label><br />';
		}
		$('#change-station-options').html(content);
		$('#change-station-div').modal('show');
		$('#change-station-cancelar').click(function(){$('#change-station-div').modal('hide')});
		$('#change-station-seleccionar').click(Events.SelectStation);
	}
};

Stations.ShowInfo = function (rta) {
	if (rta.success) {
		var sunrise = ts2date(rta.result.sunrise);
		var sunset = ts2date(rta.result.sunset);
		var sunrisehour = ((sunrise.getHours() < 10)?'0':'') + sunrise.getHours()  + ":" + ((sunrise.getMinutes()<10)?'0':'') + sunrise.getMinutes();
		var sunsethour = ((sunset.getHours() < 10)?'0':'') + sunset.getHours() + ":" + ((sunset.getMinutes() < 10)?'0':'') + sunset.getMinutes();

		$("#sunrise-span").html(sunrisehour);
		$("#sunset-span").html(sunsethour);
	}
};

Stations.LoadHistoricalMeasures = function (rta) {
	if (rta.success) {
		var ww = $(window).width();
		if (ww < 600) {
			var tabla = "<table id='tabla-diaria' class='table table-bordered table-striped table-condensed table-responsive' style='width:100%;'>";
			tabla += "<thead><tr><th>Variable / Hora</th><th>Valores</th>";
			var lines = '', line = '', header = '', d1 = '', j = 0;
			var j11 = 0;
			$.each(rta.result.entries, function (i, o) {
				line = ''; j1 = 0; j0 = 0;

				line += '<td style="text-align:left;">';
				$.each(o.values, function (j, o1) {
					if (j1 < 12) {
						if(typeof o.variable.unit == 'undefined') {o.variable.unit = ''};
						d1 = ((ts2string(o1.date)).split(' ')[1]).split(':');				
						line += '<strong>' + d1[0]+'hs:</strong>&nbsp;' + parseFloat(o1.value).toFixed(2) + "&nbsp;" + o.variable.unit + "<br/>";
					}
					j1++;
				});
				line += "</td>";
				if (j1==1) {
					line = '<td colspan="100" '+line.substring(3);
				} else {
					for (var i = 0; i < 12-j1; i++){
						line+= '<td>&nbsp;</td>';
					}
				}

				lines += '<tr><td><strong>' + o.variable.name + '</strong> ' + ((o.variable.unit !='')?" (" +o.variable.unit+ ")":'') + '</td>' + line + '</tr>';
				j11 = j1;
			});
			tabla += "</thead><tbody>" + lines + "</tbody></table>";

			data = '<div style="text-align:center;width:100%;display: block;margin-left: auto;margin-right: auto;"><a download="datos.csv" target="_blank" id="download-historical-data" href="data:application/csv;charset=utf-8,'+export_data+'" style="color:#000;">Exportar a Excel</a><i class="halflings-icon circle-arrow-down"></i></div>';

			$('#tabla-diaria-div').html(tabla);			

			return;
		}


		var export_data_header = 'Variable%2C';
		var export_data = '';
		var tabla = "<table id='tabla-diaria' class='table table-bordered table-striped table-condensed table-responsive' style='width:100%;'>";
		tabla += "<thead><tr><th>Variable / Hora</th>";
		var lines = '', line = '', header = '', d1 = '', j = 0;
		var j11 = 0;
		var export_data_lines ='';
		$.each(rta.result.entries, function (i, o) {
			line = ''; j1 = 0; j0 = 0;
			export_line = '';

			$.each(o.values, function (j, o1) {
				if (j1 < 12) {
					if(typeof o.variable.unit == 'undefined') {o.variable.unit = ''};
					line += '<td style="text-align:center;">'+ parseFloat(o1.value).toFixed(2)+'</td>';
					export_line += parseFloat(o1.value).toFixed(2) + '%2C';
				}
				j1++;
			});
			if (j1==1) {
				line = '<td colspan="100" '+line.substring(3);
			} else {
				for (var i = 0; i < 12-j1; i++){
					line+= '<td>&nbsp;</td>';
					export_line+= '%2C';
				}
			}

			lines += '<tr><td><strong>' + o.variable.name + '</strong> ' + ((o.variable.unit !='')?" (" +o.variable.unit+ ")":'') + '</td>' + line + '</tr>';
			export_data_lines += '' + o.variable.name  + ((o.variable.unit !='')?" (" +o.variable.unit+ ")":'') + '%2C' + export_line + '%0A';
			if (header == '' || j1 > j11) {
				header = '';
				$.each(o.values, function (j, o1) {
					if (j0 < 12) {
						d1 = ((ts2string(o1.date)).split(' ')[1]).split(':');
						header += '<th>'+d1[0]+':'+d1[1]+'</th>';
						export_data_header += +d1[0]+':'+d1[1]+'%2C';
					}
					j0++;
				})
			}
			j11 = j1;
		});
		tabla += header + "</thead><tbody>" + lines + "</tbody></table>";

		export_data = export_data_header + '%0A' + export_data_lines + '%0A';
		export_data = toHtml(unescape(encodeURIComponent(toHtml(export_data))));
		data = '<div style="text-align:center;width:100%;display: block;margin-left: auto;margin-right: auto;"><a download="datos.csv" target="_blank" id="download-historical-data" href="data:application/csv;charset=utf-8,'+export_data+'" style="color:#000;">Exportar a Excel</a><i class="halflings-icon circle-arrow-down"></i></div>';

		$('#tabla-diaria-export').html(data);
		$('#tabla-diaria-div').html(tabla);
	}
};

Stations.LoadAllVariables = function (rta, activeStation) {
	if (rta.success) {
		Tau.ListOfVar = '';
		$.each(rta.result.entries, function (i, o) {
			Tau.ListOfVar = Tau.ListOfVar + '' + o.code + ',';
		});
		var initDate = date2ts(new Date())-46800000;
		var endDate = date2ts(new Date());

		var url = Tau.Configurator.wsUrl + "/measures/" + activeStation.id + "/historical?eToken="+encodeURIComponent(Tau.AuthorizationToken)+"&initDate="+initDate+"&endDate="+endDate+"&codes="+Tau.ListOfVar;
		$.ajax({
			type: 'GET', url: url,
			dataType: "json",
			success: Stations.LoadHistoricalMeasures,
            error: function (request, error) {errorHandler2(request, error);$('#loading-window').modal('hide');},
			failure: function (errMsg) {errorHandler(errMsg);$('#loading-window').modal('hide');}
		});
	}
};

Stations.LoadInfo = function (rta) {
	if (rta.success) {
		$('#station-location').attr('value',rta.result.location);
		$('#station-gps').attr('value', + rta.result.latitude  + ', ' + rta.result.longitude);
		if (rta.result.is_default == 1) {$('#station-default').prop('checked', true);};
		load($("#li-services"), $("#content-services-div"), 0);
		$('#station-save').click(Stations.Save);
		var mapCanvas = document.getElementById('station-map-canvas');
		Map.Initialize(mapCanvas);
	}
};

Stations.Save = function(){
	$('#station-save').attr("disabled", "disabled");
	$('#station-saving').html('Guardando..');
	var checked = 0;
	if($('#station-default').is(':checked')){checked = 1;}
	var jsonrequest = {};
	jsonrequest.request = {};
	jsonrequest.request.id = Tau.ActiveStation.id;
	jsonrequest.request.location = $('#station-location').attr('value');
	jsonrequest.request.is_default   = checked;
	var gps = $.trim($("#station-gps").attr('value'));
	gps = gps.replace(" ", ",");
	gps = gps.replace(",,", ",");
	if (gps.lenght == 0 || gps.indexOf(",") < 0){$('#station-saving').html('Datos no guardados');$('#station-save').removeAttr("disabled");return;};
	gps2 = gps.split(',');
	jsonrequest.request.longitude   = parseFloat(gps2[1]);
	jsonrequest.request.latitude  = parseFloat(gps2[0]);
	if (jsonrequest.request.longitude  == NaN || jsonrequest.request.longitude  > 90 || jsonrequest.request.longitude  < -90) {$('#station-saving').html('Datos no guardados');$('#station-save').removeAttr("disabled");return;};
	if (jsonrequest.request.latitude == NaN || jsonrequest.request.latitude > 90 || jsonrequest.request.latitude < -90) {$('#station-saving').html('Datos no guardados');$('#station-save').removeAttr("disabled");return;};
	$.ajax({
		type: 'PUT', url: Tau.Configurator.wsUrl + "/stations?eToken="+encodeURIComponent(Tau.AuthorizationToken),
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify(jsonrequest),	dataType: "json",
		success: function (rta) {
			$('#station-saving').html('Datos Guardados');
			$('#station').html('Estaci&oacute;n: ' + $('#station-location').attr('value'));
			$('#station-save').removeAttr("disabled");
			Map.Update(jsonrequest.request.latitude, jsonrequest.request.longitude);
			Tau.ActiveStation.latitude =  jsonrequest.request.latitude;
			Tau.ActiveStation.longitude =  jsonrequest.request.longitude;

			Forecast.Update(Tau.ActiveStation.latitude, Tau.ActiveStation.longitude);

			$('#location-span').html('Lat: ' + Tau.ActiveStation.latitude +' |  Lon: ' + Tau.ActiveStation.longitude + '| Alt: ' + Tau.ActiveStation.altitude);
		},
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
};
