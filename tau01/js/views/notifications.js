var Notifications = {};

Notifications.LoadAll = function (rta) {
	if (rta.success) {
		var i = 0, j = 0, val = 0, info = 0, show = 0;
		var data = '<table id="notification-table" class="table table-bordered table-striped table-condensed table-responsive">';
		data += '<thead><tr><th>Estado</th><th>Riesgo</th><th>Fecha</th><th>Duraci&oacute;n</th><th>Descripci&oacute;n</th></tr></thead>';
		data += '<tbody>';
		$.each(rta.result.entries, function (i, o) {
			info = 1;
			if (j < 5) {
				data += '<tr>';
			} else {
				show = 1;
				data += '<tr class="tr-hidden">';
			}
			var duration = 0;
			if(typeof o.endDate == 'undefined') {
				data += '<td><span class="label label-important">Activa</span></td>';
				o.endDate = date2ts(new Date());
				duration = o.endDate - o.startDate;
			} else {
				data += '<td><span class="label">Caducada</span></td>';
				duration = o.endDate - o.startDate;
			};
			var label = 'label-info';
			if (o.risk === 'A') {
				o.risk = 'Riesgo Alto';
				label = 'label-important';
			}
			if (o.risk === 'M') {
				o.risk = 'Riesgo Medio';
				label = 'label-warning';
			}
			if (o.risk === 'B') {
				o.risk = 'Riesgo Bajo';
				label = 'label-info';
			}
			data += '<td><span class="label ' + label + '">' + o.risk + '</span></td>';
			var startDate = ts2string(o.startDate);
			var endDate = ts2string(o.endDate);
			startDate = startDate.substring(0, startDate.length - 3);
			endDate = endDate.substring(0,endDate.length - 3);
			data += '<td>' + startDate + ' a ' + endDate + '</td>';
			duration = duration / 60000;
			val = Math.round(duration);
			if (val == 0) {val = 30;}
			if (val >= 120) {
				val = Math.round(val / 60);
				val = val + ' hs';
			} else {
				val = val + ' min';
			}
			data += '<td align="center" style="text-align:center;"> ' + val + '</td>';
			data += '<td width="45%">' + o.description + '</td>';
			data += '</tr>';
			j++;
		});
		data += '</tbody></table>';
		if (info === 1) {
			if (show === 1) {data += '<center><a style="text-align:right;" id="btn-show-notifications">Mostrar Todos</a></center>';}
			$("#notifications-div").html(data);
			$(".tr-hidden").hide();
			$("#btn-show-notifications").click(function () {
				$(".tr-hidden").show();
				$("#btn-show-notifications").hide();
			});
		} else {
			$("#notificacions-content").hide();
		}
	}
};

Notifications.Load = function () {
	$.ajax({
		url: 'notifications.htm',dataType: 'html',type: 'GET',
        error: function (request, error) {errorHandler2(request, error);},
		success: function (data) {
			$("#content-notifications-div").html(data);
			$("a.services-link").click(Services.Show);
			Tau.UserData2 = jQuery.parseJSON(Cookie.Get('userData'));
			if (Tau.UserData2.is_admin == "undefined" || !Tau.UserData2.is_admin) {
				$('.services-link').hide();
			}else{
				$('.services-link').show();
			}
		}
	});
	Tau.ActiveStation = jQuery.parseJSON(Cookie.Get('activeStation'));
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/notifications/" + Tau.ActiveStation.id + "/all",
		data : {"eToken":Tau.AuthorizationToken},
		dataType: "json",
		success: Notifications.LoadAll,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
	Tau.ActiveStation = jQuery.parseJSON(Cookie.Get('activeStation'));
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/alerts/events/" + Tau.ActiveStation.id + "/all",
		data : {"eToken":Tau.AuthorizationToken},
		dataType: "json",
		success: Alerts.Load,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
};

Notifications.LoadForResume = function (rta) {
	if (rta.success) {
		var delay;
		delay = function (ms, func) {return setTimeout(func, ms);};
		toastr.options = {positionClass: 'toast-bottom-left'};
		var i = 0;
		$.each(rta.result.entries, function (i, o) {
			if (o.risk === "A") {
				delay(7100 + (700 * i), function () {
					return toastr.error(o.description, o.variable);
				});
			} else {
				delay(7100 + (700 * i), function () {
					return toastr.warning(o.description, o.variable);
				});
			}
			i++
		});
	}
};

Notifications.LoadToday = function (rta) {
	if (rta.success) {
		var array = [];
		var o = {};
		var i = 0;
		var ii = 0;
		$.each(rta.result.entries, function (i, fb) {
			array[i] = fb;
			ii++;
		});
		var data = '';
		if (ii == 1) {
			data = '<li><span class="dropdown-menu-title">Usted tiene 1 notificaci&oacute;n el d&iacute;a de Hoy</span></li>';
		} else {
			data = '<li><span class="dropdown-menu-title">Usted tiene ' + ii + ' notificaciones el d&iacute;a de Hoy</span></li>';
		}
		var jj = 0;
		for (var j in array) {
			jj++;
			if (jj < 5) {
				o = array[j];
				var label = 'notification-b.jpg';
				if (o.risk === 'A') {
					o.risk = 'Riesgo Alto';
					label = 'notification-a.jpg';
				}
				if (o.risk === 'M') {
					o.risk = 'Riesgo Medio';
					label = 'notification-m.jpg';
				}
				if (o.risk === 'B') {
					o.risk = 'Riesgo Bajo';
					label = 'notification-b.jpg';
				}
				data += '<li><a href="#" onclick="Notifications.Show();return false;">';
				data += '<span class="avatar"><img src="img/' + label + '" alt="' + o.risk + '"></span>';
				data += '<span class="header">';
				data += '	<span class="from">' + o.variable + '</span>';
				data += '	<span class="time">' + o.startDate + ' ' + o.endDate + '</span>';
				data += '</span>';
				data += '<span class="message">';
				data += '     ' + o.description;
				data += '</span>  ';
				data += '</a>';
				data += ' </li>';
			}
		}
		data += '<li><a class="dropdown-menu-sub-footer" href="#" onclick="Notifications.Show();return false;">Ver todas las Alertas</a></li></ul></li>';
		$("#notifications-header-div").html(data);
	}
};

Notifications.Show = function () {
	Notifications.Load();
	load($("#li-notificaciones"), $("#content-notifications-div"), 1000);
};
