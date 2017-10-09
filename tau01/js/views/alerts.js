var Alerts = {};

Alerts.Load = function (rta) {
	if (rta.success) {
		var data = '<table id="alertas-table" class="table table-bordered table-striped table-condensed table-responsive">';
		data += '<thead><tr><th>Estado</th><th>Fecha</th><th>Duraci&oacute;n</th><th>Valor Medido</th><th>Alerta</th></thead>';
		data += '<tbody>';
		var val;
		var info = 0;
		var show = 0;
		var j = 0
		$.each(rta.result.entries, function (i, o) {
			if(typeof o.lastUpdate == 'undefined') {
				o.estado = 'Activa';
			} else {
				o.estado = 'Caducada'
			}
			j++;
			if (j < 5) {
				data += '<tr>';
			} else {
				show = 1;
				data += '<tr class="tr-hidden">';
			}
			if (o.estado === 'Activa') {
				data += '<td><span class="label label-important">' + o.estado + '</span></td>';
			} else {
				data += '<td><span class="label">' + o.estado + '</span></td>';
			}
			var startDate = ts2string(o.startDate);
			var endDate = ts2string(o.lastUpdate);
			startDate = startDate.substring(0, startDate.length - 3);
			endDate = endDate.substring(0,endDate.length - 3);
			if (o.estado == 'Caducada') {
				data += "<td align='center'>" + startDate + ' a ' + endDate + "</td>";
				var duration = Math.abs(o.lastUpdate - o.startDate);
				duration = duration / 60000;
				val = Math.round(duration);
				if (val == 0) {val = 30;}
				if (val >= 120) {
					val = Math.round(val / 60);
					val = val + ' hs';
				} else {
					val = val + ' min';
				}

				data += "<td align='center' style='text-align:center;'>" + val + "</td>";
			} else {
				data += "<td align='center'>" + startDate + ' hasta ahora</td>';
				data += "<td align='center' style='text-align:center;'>N/A</td>";
			}

			data += "<td align='center' style='text-align:center;'>" + o.value + "</td>";
			data += "<td width='30%' align='center'>" + o.rule.alert.description + "</td>";
			data += '</tr>';
		});
		data += '</tbody></table>';
		if (show == 1) {data += '<center><a style="text-align:right;" id="btn-show-alertas">Mostrar Todos</a></center>';}
		$("#alertas-div").html(data);
		$("#alertas-div").show();
		$(".tr-hidden").hide();
		$("#btn-show-alertas").click(function () {
			$(".tr-hidden").show();
			$("#btn-show-alertas").hide();
		});
	}
};
