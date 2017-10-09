var Services = {};

Services.Load = function (data) {
	$("#content-services-div").html(data);
	$("#station-default").switchButton();
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/stations/" + Tau.ActiveStation.id + "/info",
		data : {"eToken":Tau.AuthorizationToken},
		dataType: "json",
		success: Stations.LoadInfo,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
	$("#dailyReport-content-div").hide();
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/reports/" + Tau.ActiveStation.id + "/daily",
		data : {"eToken":Tau.AuthorizationToken},
		dataType: "json",
		success: Services.LoadDailyReport,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
	$('#alertRules-content-div').hide();
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/alerts/rules/" + Tau.ActiveStation.id + "/all",
		data : {"eToken":Tau.AuthorizationToken},
		dataType: "json",
		success: Services.LoadAlertRules,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});

};

Services.LoadDailyReport = function (data){
	if (data.success == false) {return;}

	var content = "<span>Por favor seleccione los d&iacute;as y horario en los cuales recibir el reporte. A la vez indique si desea recibirlo v&iacute;a correo electr&oacute;nico y/o mensaje de texto.</span><br /><div class='controls'><table class='table table-responsive table-bordered table-striped table-condensed' width='100%' style='width:100%;' reportId='"+data.result.id+"'><thead  style='font-size:75%;'><tr><th>Reporte</th><th width='10%'>Horario</th><th width='5%'>Lun</th><th width='5%'>Mar</th><th width='5%'>Mie</th><th width='5%'>Jue</th><th width='5%'>Vie</th><th width='5%'>Sab</th><th width='5%'>Dom</th><th width='10%'>Alerta SMS</th><th width='10%'>Alerta Email</th></thead><tbody>";

	var combo = '<div class="controls"><select id="dailyReportHour1" style="width:80px;" data-rel="chosen"><option>00:00:00</option><option>01:00:00</option><option>02:00:00</option><option>03:00:00</option><option>04:00:00</option><option>05:00:00</option><option>06:00:00</option><option>07:00:00</option><option>08:00:00</option><option>09:00:00</option><option>10:00:00</option><option>11:00:00</option><option>12:00:00</option><option>13:00:00</option><option>14:00:00</option><option>15:00:00</option><option>16:00:00</option><option>17:00:00</option><option>18:00:00</option><option>19:00:00</option><option>20:00:00</option><option>21:00:00</option><option>22:00:00</option><option>23:00:00</option></select></div>';
	content += '<tr><td><strong>Reporte Diario:</strong> Informa diariamente el resumen de la informaci&oacute;n monitoreada por la estaci&oacute;n de telemetr&iacute;a.</td><td>'+ combo + '</td>';  //data.result.hour
	$.each(data.result, function (i, o) {
		if (i != 'id' && i != 'hour') {content += '<td sytle="text-align:center;" align="center"><input style="padding:auto;text-align:center;" class="dailyReportItem1" type="checkbox" data-rel="chosen" value="'+i+'" id="'+i+'" '+ (o==1?'checked':'') + ' /></td>';};
	});
	content += '</tr></tbody></table></div>';
	$('#dailyReport').html(content);
	var hour = (data.result.hour).split(':')[0];
	$('#dailyReportHour1 option:contains("'+hour+'")').prop('selected', true);
	$('.dailyReportItem1').switchButton();
	$('#dailyReportHour1').chosen();

	$("#dailyReport-content-div").show();
	//$('#dailyReportHour1').change(Services.ModifyDailyReport);
	$('.dailyReportItem1').change(function(){
		if ($(this).val().indexOf('sms') > -1 && $(this).is(':checked')) {
			bootbox.alert({message: 'Esto puede generar costos extras.<br />Comun\u00edquese con el Administrador ante cualquier inquietud.', title: 'Advertencia'});
		}
	});
	$('#dailyReport-save').click(Services.ModifyDailyReport);
};

Services.ModifyDailyReport = function () {
	$('#dailyReport-save').attr("disabled", "disabled");
	$('#daily-report-saving').html('Guardando..');
	var reportId = $('.dailyReportItem1:first').parent().parent().parent().parent().attr('reportId');
	var hour = $('#dailyReportHour1').val();

	var json = '{"request":{"id" : '+ reportId +', "hour": "'+hour+'",';
	$('.dailyReportItem1').each(function() {
		item = '"' + $(this).attr('value') + '": ' + ($(this).is(':checked')?1:0);
		json += item + ', ';
	});
	json = json.slice(0,-2) + '}}';

	$.ajax({
		type: 'POST', url: Tau.Configurator.wsUrl +  "/reports/" + Tau.ActiveStation.id + "/daily?eToken="+encodeURIComponent(Tau.AuthorizationToken), contentType: 'application/json; charset=utf-8',
		data: json,	dataType: "json",
		success: function (rta) {
			$('#daily-report-saving').html('Datos Guardados');
			$('#dailyReport-save').removeAttr("disabled");
		},
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
};

Services.Show = function () {
	Tau.ActiveStation = jQuery.parseJSON(Cookie.Get('activeStation'));
	$.ajax({
		url: 'services.htm', dataType: 'html', type: 'GET',
		success: Services.Load,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
};

Services.LoadAlertRules = function(data) {
	if (data.success == false) {return;}
	var content = "<div class='controls'><table class='table table-bordered table-striped table-condensed' width='100%' style='width:100%;'><thead><tr><th>Alerta</th><th>Umbral M&iacute;n.</th><th>Umbral M&aacute;x.</th><th width='10%'>Alerta SMS</th><th width='10%'>Alerta Email</th><th width='10%'>&iquest;Activa?</th><th>Acciones</th></thead><tbody>";
	var index = 0;
	$.each(data.result.entries, function (i, o) {
		var checked = '', emailEnable = '', smsEnable = '';

		if (typeof  o.endDate === 'undefined') {
			checked = 'checked';
		}
		if (eval(o.emailEnable) == 1){
			emailEnable = 'checked';
		}
		if (eval(o.smsEnable) == 1){
			smsEnable = 'checked';
		}
		content += 	'<tr><td style="vertical-align:middle;"><strong>' + o.alert.description + '<span id="alertrule_id_'+index+'" style="visibility:hidden;">' + o.id + '</span><span id="alertrule_code_'+index+'" style="visibility:hidden;">' + o.alert.code + '</span><span style="visibility:hidden;" class="activesrules">'+o.alert.id+'</span></strong></td><td style="text-align:center;"><input id="alertrule_low_'+index+'" style="padding:auto;text-align:center;width:50px;" value="' + o.low + '" type="text" /></td><td style="text-align:center;"><input id="alertrule_high_'+index+'" style="padding:auto;text-align:center;width:50px;" value="' + o.high + '" type="text" /></td>'+
					'<td style="text-align:center;" align="center"><center><input style="padding:auto;text-align:center;" type="checkbox" data-rel="chosen" id="alertrule_sms_'+index+'" class="alertRulesCheckbox" '+ smsEnable + ' /></center></td>'+
					'<td style="text-align:center;" align="center"><center><input style="padding:auto;text-align:center;" type="checkbox" data-rel="chosen" id="alertrule_email_'+index+'" class="alertRulesCheckbox" '+ emailEnable + ' /></center></td>'+
					'<td style="text-align:center;" align="center"><center><input style="padding:auto;text-align:center;" type="checkbox" data-rel="chosen" id="alertrule_active_'+index+'" class="alertRulesCheckbox" '+ checked + ' /></center></td>'+
					'<td style="text-align:center;"><button type="button" class="btn btn-success alertrule_save" id="alertrule_save_'+index+'" style="width:88px;"><i class="halflings-icon white ok"></i>&nbsp;Guardar</button>&nbsp;&nbsp;</td></tr>';
		index++;
	});
	content += '<tr class="addnewalert_tr"><td style="vertical-align:middle;"><select id="newAlertRuleCombo" style="width:100%;height:20px;" data-rel="chosen"></select></td><td style="text-align:center;"><input style="padding:auto;text-align:center;width:50px;" type="text" id="alertrule_low"/></td><td style="text-align:center;"><input style="padding:auto;text-align:center;width:50px;" type="text" id="alertrule_high"/></td><td><input style="padding:auto;text-align:center;" type="checkbox" data-rel="chosen" class="alertRulesCheckbox" id="alertrule_sms"/></td><td><input style="padding:auto;text-align:center;" type="checkbox" data-rel="chosen" class="alertRulesCheckbox" checked id="alertrule_email"/></td><td><input style="padding:auto;text-align:center;" type="checkbox" data-rel="chosen" class="alertRulesCheckbox" checked id="alertrule_checkbox"/></td><td style="text-align:center;"><button type="button" class="btn btn-success" style="width:88px;" id="alertrule_new"><i class="halflings-icon white th-large"></i>&nbsp;Agregar</button></td></tr>';
	content += '</tbody></table></div>';
	$('#alertRules').html(content);
	$('.alertRulesCheckbox').switchButton();
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/entity/alert/all",
		data : {"eToken":Tau.AuthorizationToken},
		dataType: "json",
		success: Services.PopulateAlertRulesCombo,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
	$('#alertrule_new').click(function(){
		var rule = $("#newAlertRuleCombo").val();
		var code = $("#newAlertRuleCombo").text().split('(')[1];
		code = code.replace(')','');
		var low = $("#alertrule_low").attr('value');
		var high = $("#alertrule_high").attr('value');
		var active = $("#alertrule_checkbox").is(':checked');
		var sms = $("#alertrule_sms").is(':checked')?1:0;
		var email = $("#alertrule_email").is(':checked')?1:0;
		console.log(sms, email);
		if (rule == 0 || low == '' || high == ''){
			bootbox.alert({message: "Complete los datos antes de guardar",title: "Advertencia"});
			return;
		}
		if (!isNumeric(low) || !isNumeric(high) || eval(low) > eval(high)){
			bootbox.alert({message: "Los umbrales deben ser num&eacute;ricos y el M&iacute;nimo debe ser menor que el M&aacute;ximo", title: "Advertencia"});
			return;
		}
		$('.alertrule_save').attr("disabled", "disabled");
		$('#alertrule_new').attr("disabled", "disabled");
		$('#alertRules-saving').html('Guardando..');
		var operation = 'AA|' + code + '|' + high + '|' + low;
		var now = date2ts(new Date());
		var endDate = 'null';
		if (!active) {
			endDate = '' + now;
		}
		var data = '{"request":{ "startDate": '+now+', "endDate": '+endDate+',"high": ' + high + ',"low": ' + low + ', "smsEnable": ' + sms + ', "emailEnable": ' + email +', "alert": {"id": ' + rule + '}}}';
		$.ajax({
			type: 'POST', url: Tau.Configurator.wsUrl +  "/alerts/rules/" + Tau.ActiveStation.id + "/new?eToken=" + encodeURIComponent(Tau.AuthorizationToken), contentType: 'application/json; charset=utf-8',
			data: data,	dataType: "json",
			success: function (rta) {
				$('#alertRules-saving').html('Datos Guardados');
				$('.alertrule_save').removeAttr("disabled");
				$('#alertrule_new').removeAttr("disabled");
				$.ajax({
					type: 'GET', url: Tau.Configurator.wsUrl + "/alerts/rules/" + Tau.ActiveStation.id + "/all",
					data : {"eToken":Tau.AuthorizationToken},
					dataType: "json",
					success: Services.LoadAlertRules,
                    error: function (request, error) {errorHandler2(request, error);},
					failure: function (errMsg) {errorHandler(errMsg);}
				});
				$.ajax({
					type: 'GET', url: Tau.Configurator.wsUrl + "/operations/" + Tau.ActiveStation.id,
					data : {"eToken":Tau.AuthorizationToken, "operation": operation},
					dataType: "json",
					success: function (rta) {},
					error: function (request, error) {errorHandler2(request, error);},
					failure: function (errMsg) {errorHandler(errMsg);}
				});
			},
            error: function (request, error) {errorHandler2(request, error);},
			failure: function (errMsg) {errorHandler(errMsg);}
		});
	});
	$('.alertrule_save').click(function(){
		var elems = $(this).attr('id').split('_');
		if (elems.length < 3) return;
		var index = elems[2];
		var id = $('#alertrule_id_'+index).html();
		var low = $('#alertrule_low_'+index).val();
		var high = $('#alertrule_high_'+index).val();
		var active = $('#alertrule_active_'+index).is(':checked');
		var email = 0;
		var sms = 0;

		if ($('#alertrule_email_'+index).is(':checked')) {
			email = 1;
		}
		if ($('#alertrule_sms_'+index).is(':checked')) {
			sms = 1;
		}
		var code = $('#alertrule_code_'+index).html();
		var operation = '';
		if (low == '' || high == ''){
			bootbox.alert({message: "Complete los datos antes de guardar",title: "Advertencia"});
			return;
		}
		if (!isNumeric(low) || !isNumeric(high) || eval(low) > eval(high)){
			bootbox.alert({message: "Los umbrales deben ser num&eacute;ricos y el M&iacute;nimo debe ser menor que el M&aacute;ximo", title: "Advertencia"});
			return;
		}
		$('.alertrule_save').attr("disabled", "disabled");
		$('#alertrule_new').attr("disabled", "disabled");
		$('#alertRules-saving').html('Guardando..');


		var data = '{"request":{ "id": ' + id + ' , "low": ' + low + ', "high": ' + high + ', "smsEnable": ' + sms + ', "emailEnable": ' + email;
		if (!active) {
			endDate = date2ts(new Date());
			data += ', "endDate": "' + endDate + '"}}';
			operation = 'BA|' + code;
		} else {
			data += ', "endDate": null}}';
			operation = 'AA|' + code + '|' + high + '|' + low;
		}

		$.ajax({
			type: 'PUT', url: Tau.Configurator.wsUrl +  "/alerts/rules/" + Tau.ActiveStation.id + "/update?eToken="+encodeURIComponent(Tau.AuthorizationToken),
			contentType: 'application/json; charset=utf-8',
			data: data,	dataType: "json",
			success: function (rta) {
				$('#alertRules-saving').html('Datos Guardados');
				$('.alertrule_save').removeAttr("disabled");
				$('#alertrule_new').removeAttr("disabled");
			},
            error: function (request, error) {errorHandler2(request, error);},
			failure: function (errMsg) {errorHandler(errMsg);}
		});
		/*$.ajax({
			type: 'GET', url: Tau.Configurator.wsUrl + "/operations/" + Tau.ActiveStation.id,
			data : {"eToken":Tau.AuthorizationToken, "operation": operation},
			dataType: "json",
			success: function (rta) {
				console.log(rta);
			},
			error: function (request, error) {errorHandler2(request, error);},
			failure: function (errMsg) {errorHandler(errMsg);}
		});*/
	});
	$('#alertRules-content-div').show();
};

Services.PopulateAlertRulesCombo = function(data) {
	if (data.success == false) {return;}
	var activesrules = ",";
	$(".activesrules").each(function( index ) {
		activesrules += $( this ).text() + ",";
	});
	var number = 1;
	var op = new Option("", 0);
	$(op).html("");
	$('#newAlertRuleCombo').append(op);
	$.each(data.result.entries, function (i, o) {
		if ($.inArray("" + o.id, activesrules.split(",")) == -1) {
			number++;
			var op = new Option(o.description, o.id);
			$(op).html(o.description + ' (' + o.code + ')');
			$('#newAlertRuleCombo').append(op);
		}
	});
	if (number < 2){
		$('.addnewalert_tr').hide();
	} else {
		$('.addnewalert_tr').show();
	}
	$('#newAlertRuleCombo').chosen();
};
