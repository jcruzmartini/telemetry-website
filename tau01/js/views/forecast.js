var Forecast = {};
var forecast = function(rta){
	var data = '<table class="table table-bordered table-striped table-condensed table-responsive">';
	var j = 0;
	var j1 = 0;
	var day = 'day';
	var prep = '';
	var icon = "";
	var date1 = "";
	data += '<thead><tr><th><img src="http://tau01.com/img/sensors/reloj.png" width="30px"/><br /><strong>Fecha/Hora</strong></th>';
	data += '<th><img src="http://tau01.com/img/sensors/mojado-de-hoja.png" width="30px"/><br /><strong>Pron&oacute;stico</strong></th><th style="text-align:center;"><img src="http://tau01.com/img/sensors/temp-ambiente.png" width="30px"/><br /><strong>Temperatura</strong></th>';
	data += '<th style="text-align:center;"><img src="http://tau01.com/img/sensors/humedad-relativa.png" width="30px"/><br /><strong>Humedad</strong></th>';
	data += '<th style="text-align:center;"><img src="http://tau01.com/img/sensors/presion.png" width="30px"/><br /><strong>Presi&oacute;n</strong></th>';
	data += '<th style="text-align:center;"><img src="http://tau01.com/img/sensors/direccion-viento.png" width="30px"/><br /><strong>Viento</strong></th>';
	data += '<th style="text-align:center;"><img src="http://tau01.com/img/sensors/precipitacion.png" width="30px"/><br /><strong>Lluvia</strong></th>';
	data += '<th style="text-align:center;"><img src="http://tau01.com/img/sensors/neblina.png" width="30px"/><br /><strong>Neblina</strong></th>';
	data += '<th style="text-align:center;"><img src="http://tau01.com/img/sensors/punto-rocio.png" width="30px"/><br /><strong>Nubosidad</strong></th>';
	data += '</tr></thead><tbody>';
	var j = 0;
	$.each(rta.weatherdata.product.time, function (i, o) {
		data += '<tr>';
		if (typeof o.location.precipitation != 'undefined'){
			j++;
			if(j % 2) {
				prep = o.location.precipitation.value + ' mm';
				icon = '<center><img width="25px" src="http://tau01.com/img/yr-icons/day/'+o.location.symbol.number+'.png" /></center>';
				date1 = formatDateHour(o.from) + " a " + formatDateHour(o.to);
			};
		} else {
			data = data.replace('icon1',icon);
			data = data.replace('prep',prep);
			data = data.replace('date1',date1);
			if (i != 0 && formatDate(o.to).indexOf("01:00") > 0) {
				data += '<td colspan="12" style="background-color:#DDDDDD;"><div style="height: 2px; overflow:hidden;">&nbsp;</div></td></tr><tr>';
			}
			data += '<td><strong>'+ formatDate(o.to)+'</strong></td>';
			data += '<td>icon1</td>';

			if (typeof o.location.temperature != 'undefined') {
				data += "<td style='text-align:center;'>" + o.location.temperature.value + '&deg;C</td>';
			} else {
				data += '<td>&nbsp;</td>';
			}
			if (typeof o.location.humidity != 'undefined') {
				data += "<td style='text-align:center;'>" + o.location.humidity.value + ' %</td>';
			} else {
				data += '<td>&nbsp;</td>';
			};
			data += "<td style='text-align:center;'>" + o.location.pressure.value + ' ' +  o.location.pressure.unit + '</td>';
			o.location.windDirection.name = o.location.windDirection.name.replace("W","O");
			data += "<td style='text-align:center;'>" + Math.round(eval(o.location.windSpeed.mps)*3.6) + ' km/h&nbsp;<img src="http://tau01.com/img/cardinal/'+o.location.windDirection.name+'.png" width="20px"/> ' +o.location.windDirection.name+'</td>';
			data += "<td style='text-align:center;'><span title='date1'>prep</span></td>";
			data += "<td style='text-align:center;'>" + o.location.fog.percent + ' %</td>';
			data += "<td style='text-align:center;'>" + o.location.cloudiness.percent + '%</td>';

		}

		data += '</tr>';
	});
	data = data.replace('prep',prep);
	data = data.replace('date1',date1);
	data = data.replace('icon1',icon);

	data += "</tbody></table>";
	$("#forecast-resume").html(data);

}

function formatDate(date){
	var newDate = date.replace('T', ' ');
	newDate = newDate.replace('Z','');

	//var newDate = date.substring(8,10)+'/' +
	//			date.substring(5,7) + '/' + date.substring(0,4) + ' ' + date.substring(11,16) + ' hs&nbsp;&nbsp;';
	return ts2string2(Date.parse(date)-18000000) + " " + ts2stringHour(Date.parse(date)-18000000);
}
function formatDateHour(date){
	var newDate = date.replace('T', ' ');
	newDate = newDate.replace('Z','');

	//var newDate = date.substring(8,10)+'/' +
	//			date.substring(5,7) + '/' + date.substring(0,4) + ' ' + date.substring(11,16) + ' hs&nbsp;&nbsp;';
	return ts2stringHour(Date.parse(date)-18000000);
}
Forecast.Load = function (data) {
	$("#content-forecast-div").html(data);
	Forecast.Update(Tau.ActiveStation.latitude, Tau.ActiveStation.longitude);

	load($("#li-forecast"), $("#content-forecast-div"), 2500);
};

Forecast.Update = function (lat, lon){
	var url = Tau.Configurator.wsUrl + "/forecast/"+ lat+"/"+lon +  "?eToken="+encodeURIComponent(Tau.AuthorizationToken);
	$.ajax({
		type: 'GET', url: url,
		dataType: "json",
		success: forecast,
		error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
}

Forecast.Show = function () {
	$.ajax({
		url: 'forecast.htm',dataType: 'html',type: 'GET',
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);},
		success: Forecast.Load
	});
};
