var Measures = {};

Measures.LoadCurrent = function (rta) {
	if (rta.success) {

		var ww = $(window).width();
		if (ww < 600) {
			var lines = "";
			$.each(rta.result.entries, function (i, o) {
				if(typeof o.variable.unit == 'undefined') {o.variable.unit = '';};
				if(typeof o.values[0] == 'undefined') {o.values[0] = {}};

				o.values[0].value = parseFloat(o.values[0].value).toFixed(2);
				o.values[0].min = parseFloat(o.values[0].min).toFixed(2);
				o.values[0].max = parseFloat(o.values[0].max).toFixed(2);

				if(typeof o.values[0].min == 'undefined' || isNaN(o.values[0].min)) {o.values[0].min = '-';};
				if(typeof o.values[0].max == 'undefined' || isNaN(o.values[0].min)) {o.values[0].max = '-';};
				if(typeof o.values[0].value == 'undefined'  || isNaN(o.values[0].value)) {o.values[0].value = '-';};
				lines += "<tr><td><center><strong>" + o.variable.name + '</strong>' + ((o.variable.unit !='')?" (" +o.variable.unit+ ")":'') + "</center></td>"+
					"<td style='text-align:center'>" + o.values[0].value + 	"</td>"+
					"<td style='text-align:center'>" + o.values[0].min 	+	"</td>" +
					"<td style='text-align:center'>" + o.values[0].max 	+	"</td>" +
					"</tr>";
			});
			var tabla = "<table class='table table-bordered table-striped table-condensed table-responsive'>";
			tabla += "<thead><tr><th>Variable</th><th>Actual</th><th>Min. Diario</th><th>Max. Diario</th></thead>";
			tabla += "<tbody>" + lines + "</tbody></table>";
			
			document.getElementById('circles-div').setAttribute('width','100%');
			$("#circles-div").parent().css("width","100%");
			
			$("#circles-div").html(tabla);
			return;
		}		
		var min = eval(rta.result.lastUpdate);
		if (min > 120) {
			min = Math.round (min/60) + ' horas';
			$('#status-img').attr('src', "./img/sensors/status-error.png");
			$('#status-span').html("Offline");
		} else if (min == 1){
			min = min + ' minuto';
			$('#status-img').attr('src', "./img/sensors/status-ok.png");
			$('#status-span').html("En L&iacute;nea");
		} else {
			min = min + ' minutos'
			$('#status-img').attr('src', "./img/sensors/status-ok.png");
			$('#status-span').html("En L&iacute;nea");
		}
		$('#utlact-min-div').html(min);
		var i = 0; j = 0;
		var data = '<table class="table-responsive"><tr>';
		var windvelocity = ''; windmax = ''; windmin= '';
		$('#tempmin-span').html('-');
		$('#evapo-span').html('-');
		$("#precipitaciones").html('-');

		$.each(rta.result.entries, function (i, o) {

			if(typeof o.variable.unit == 'undefined') {o.variable.unit = ''};

			if(o.variable.code == 'L'){
				$.each(o.values, function (j, p) {
					$("#precip-" + p.type).html(p.value + " mm");
				});
			} else if(o.variable.code == 'E') {
				console.log(o.values);
				$.each(o.values, function (j, p) {
					$("#" + p.type).html(p.value + " " + o.variable.unit);
				});
			} else if(typeof o.values[0] != 'undefined' && typeof o.values[0].min != 'undefined') {
				
				if(o.variable.code == 'MT'){
					$('#tempmin-span').html(o.values[0].value + " " + o.variable.unit);
				} else if (o.variable.code == 'V'){
					windvelocity = o.values[0].value + ' ' + o.variable.unit;
					windmax = o.values[0].max + ' <span style="font-size:80%">' + o.variable.unit + '</span>';
					windmin = o.values[0].min + ' <span style="font-size:80%">' + o.variable.unit + '</span>';
				} else if (o.variable.code == 'D'){
					j++;
					if (j == 6) data += '</tr><tr>';
					data += '<td width="13%" style="width:13%;"><h3 title="' + o.variable.tooltip + '">' + o.variable.name + '</h3><div style="left:50%"><div class="circleStatsItem green">';
					data += '<i><img src="./img/sensors/green/' + o.variable.filename + '" width="40%"  style="width:40%;"></i>';
					data += '<span class="percent" style="left:-15px;">'+ windvelocity +'</span>';
					data += '<input type="text" id="viento-text" value="" style="background-color:transparent;font-weight:bold;"/>';
					data += '<input type="text" id="viento-number" value="'+ o.values[0].value +'" class="greenCircle3" />';
					data += '</div>';
					data += '</div>';
					data += '<span class="badge badge-info" style="width:54px;" title="Valor M&iacute;nimo Diario">' + windmin + '</span> <span class="badge badge-important" style="width:54px;" title="Valor M&aacute;ximo Diario">' + windmax + '</span>';
					data += '</td>';
				} else {
					j++;
					if (j == 6) data += '</tr><tr>';
					data += '<td width="13%"  style="width:13%;"><h3 title="' + o.variable.tooltip + '">' + o.variable.name + '</h3><div style="left:50%"><div class="circleStatsItem green">';
					data += '<i><img src="./img/sensors/green/' + o.variable.filename + '" width="40%"  style="width:40%;"></i>';
					if (o.variable.code == 'P') {
						data += '<span class="percent">' + o.variable.unit + '</span>';
						data += '<input type="text" value="' + o.values[0].value + '" class="greenCircle2" />';
					} else if (o.variable.code == 'F') {
						data += '<span class="percent">' + o.variable.unit + '</span>';
						data += '<input type="text" value="' + o.values[0].value + '" class="greenCircle4" />';
					} else if(o.variable.code == 'R'){
						data += '<span class="percent" style="left:-18px;">' + o.variable.unit + '</span>';
						data += '<input type="text" value="' + o.values[0].value + '" class="greenCircle5" />';
					} else {
						data += '<span class="percent">' + o.variable.unit + '</span>';
						data += '<input type="text" value="' + o.values[0].value + '" class="greenCircle5" />';
					}
					data += '</div>';
					data += '</div>';
					data += '<span class="badge badge-info" style="width:54px;" title="Valor M&iacute;nimo Diario">' + o.values[0].min + ' <span style="font-size:80%">' +  o.variable.unit + '</span></span> <span class="badge badge-important" style="width:54px;" title="Valor M&aacute;ximo Diario">' + o.values[0].max + ' <span style="font-size:80%">' +  o.variable.unit + '</span></span>';
					data += '</td>';
				}
			}
		});
		data += '</tr>';
		data += '<tr>';
		$("#circles-div").html(data + '</tr></table>');
		if ($('#tempmin-span').html() == '-' && $('#evapo-span').html() == '-' && $("#precipitaciones").html() == '-') {
			$("#additional-table").hide();
		};


		$('#variables-table').show();
		circle_progess();
		var positioningProps = ["float","position","width","height","left","top","marginLeft","marginTop","paddingLeft","paddingTop","color","font-size","text-align"];
		var select = $("#viento-number");
		var div = $("#viento-text");
		for(var i in positioningProps){
			div.css(positioningProps[i], select.css(positioningProps[i])||"");
		}
		div.attr('value',angleToCardinal(select.attr('value')));
		select.hide();
		$('#variables-table').show();
	}
};

Measures.LoadSummary = function (rta) {
	if (rta.success) {
		var lines = "";
		var i = 0;
		var exportlines = '';

		var ww = $(window).width();
		if (ww < 600) {
			return;
		}
		$.each(rta.result.entries, function (i, o) {
			if(typeof o.variable.unit == 'undefined') {o.variable.unit = '';};
			if(typeof o.values[0] == 'undefined') {o.values[0] = {}};
			if(typeof o.values[1] == 'undefined') {o.values[1] = {};};
			if(typeof o.values[2] == 'undefined') {o.values[2] = {};};

			o.values[0].value = parseFloat(o.values[0].value).toFixed(2);
			o.values[0].min = parseFloat(o.values[0].min).toFixed(2);
			o.values[0].max = parseFloat(o.values[0].max).toFixed(2);
			o.values[0].avg = parseFloat(o.values[0].avg).toFixed(2);
			o.values[1].min = parseFloat(o.values[1].min).toFixed(2);
			o.values[1].max = parseFloat(o.values[1].max).toFixed(2);
			o.values[1].avg = parseFloat(o.values[1].avg).toFixed(2);
			o.values[2].min = parseFloat(o.values[2].min).toFixed(2);
			o.values[2].max = parseFloat(o.values[2].max).toFixed(2);
			o.values[2].avg = parseFloat(o.values[2].avg).toFixed(2);

			if(typeof o.values[0].min == 'undefined' || isNaN(o.values[0].min)) {o.values[0].min = '-';};
			if(typeof o.values[0].max == 'undefined' || isNaN(o.values[0].min)) {o.values[0].max = '-';};
			if(typeof o.values[0].avg == 'undefined' || isNaN(o.values[0].avg)) {o.values[0].avg = '-';};
			if(typeof o.values[1].min == 'undefined' || isNaN(o.values[1].min)) {o.values[1].min = '-';};
			if(typeof o.values[1].max == 'undefined' || isNaN(o.values[1].max)) {o.values[1].max = '-';};
			if(typeof o.values[1].avg == 'undefined' || isNaN(o.values[1].avg)) {o.values[1].avg = '-';};
			if(typeof o.values[2].min == 'undefined' || isNaN(o.values[2].min)) {o.values[2].min = '-';};
			if(typeof o.values[2].max == 'undefined' || isNaN(o.values[2].max)) {o.values[2].max = '-';};
			if(typeof o.values[2].avg == 'undefined' || isNaN(o.values[2].avg)) {o.values[2].avg = '-';};
			if(typeof o.values[0].value == 'undefined'  || isNaN(o.values[0].value)) {o.values[0].value = '-';};
			lines += "<tr><td><strong>" + o.variable.name + '</strong>' + ((o.variable.unit !='')?" (" +o.variable.unit+ ")":'') + "</td>"+
				"<td style='text-align:center'>" + o.values[0].value + 	"</td>"+
				"<td style='text-align:center'>" + o.values[0].min 	+	"</td>" +
				"<td style='text-align:center'>" + o.values[0].max 	+	"</td>" +
				"<td style='text-align:center'>" + o.values[0].avg 	+	"</td>" +
				"<td style='text-align:center'>" + o.values[1].min 	+	"</td>" +
				"<td style='text-align:center'>" + o.values[1].max 	+	"</td>" +
				"<td style='text-align:center'>" + o.values[1].avg 	+	"</td>" +
				"<td style='text-align:center'>" + o.values[2].min 	+	"</td>" +
				"<td style='text-align:center'>" + o.values[2].max 	+	"</td>" +
				"<td style='text-align:center'>" + o.values[2].avg 	+	"</td>" +
				"</tr>";
			exportlines += "" + o.variable.name + ((o.variable.unit !='')?" (" +o.variable.unit+ ")":'') + "%2C"+
				o.values[0].value + 	"%2C"+
				o.values[0].min 	+	"%2C" +
				o.values[0].max 	+	"%2C" +
				o.values[0].avg 	+	"%2C" +
				o.values[1].min 	+	"%2C" +
				o.values[1].max 	+	"%2C" +
				o.values[1].avg 	+	"%2C" +
				o.values[2].min 	+	"%2C" +
				o.values[2].max 	+	"%2C" +
				o.values[2].avg 	+	"%2C" +
				"%0A";
		});
		var tabla = "<table class='table table-bordered table-striped table-condensed table-responsive'>";
		tabla += "<thead><tr><th>Variable</th><th>Actual</th><th>Min. Diario</th><th>Max. Diario</th><th>Prom. Diario</th><th>Min. Mensual</th><th>Max. Mensual</th><th>Prom. Mensual</th><th>Min. Anual</th><th>Max. Anual</th><th>Prom. Anual</th></thead>";
		tabla += "<tbody>" + lines + "</tbody></table>";
		var export_data = 'Variable%2CActual%2CMin. Diario%2CMax. Diario%2CProm. Diario%2CMin. Mensual%2CMax. Mensual%2CProm. Mensual%2CMin. Anual%2CMax. Anual%2CProm. Anual%0A' + exportlines;
		export_data = toHtml(unescape(encodeURIComponent(toHtml(export_data))));
		data = '<div style="color:#000;text-align:center;width:100%;display: block;margin-left: auto;margin-right: auto;"><a download="datos.csv" target="_blank" id="download-historical-data" href="data:application/csv;charset=utf-8,'+export_data+'" style="color:#000;">Exportar a Excel</a><i class="halflings-icon circle-arrow-down"></i></div>';
		$('#tabla-resumen-export').html(data);
		$("#tabla-resumen-div").html(tabla);

		//var ww = $(window).width();
		//if (ww < 600) {
		//	$("#tabla-resumen-container").hide();
		//} else {
		//	$("#tabla-resumen-container").show();
		//}
	}
};
