var refresh = function () {
	$('#loading-window').modal('hide');
	if ($("#utlact-min-div").text().indexOf('minuto')){
		mins = parseInt($("#utlact-min-div").text());
		if (!isNaN(mins)) {
			if (eval(mins) > 35) {
				Notifications.Load();
				ControlPanel.LoadResume();
			}
			$("#utlact-min-div").html((mins + 1) + ' minutos');

		}
		setTimeout(refresh, 60000);
	}
};

var loadPercentage = function (value) {
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

var load = function (objMenu, objPage, time) {
	$('#loading-window').modal('hide');
	var loading = $("#loading-div");
	if (time != 0) {
		$('#loading-window').css('visibility','visible');
		$('#loading-window').modal('show');
		$(".active").removeClass('active');
		$(".content-page").hide();
		loadPercentage(time);
		setTimeout(function () {
			$("html, body").animate({
				scrollTop: 0
			}, 600);
			//$("#content-element").html("");
			$("#content-element").append(objPage);
			objPage.show();
			$('#loading-window').modal('hide');
			$('#loading-window').css('visibility','hidden');
			objMenu.addClass("active");
		}, time);
	} else {
		$(".content-page").hide();
		//$("#content-element").html("");
		$('#loading-window').css('visibility','hidden');
		$("#content-element").append(objPage);
		objPage.show();
		$(".active").removeClass('active');
		objMenu.addClass("active");
		$("html, body").animate({
			scrollTop: 0
		}, 600);
	}
};


function ts2date(ts) {
    var newDate = new Date();
    var offset = newDate.getTimezoneOffset();
    newDate.setTime(ts - offset * 60000 + 360 * 60000);
    return newDate;
}

function date2ts(date1) {
    var newDate = new Date();
    var offset = newDate.getTimezoneOffset();
    return date1.getTime() + offset * 60000 - 360 * 60000;
}

function string2ts(value) {
	var newDate = new Date();
    var offset = newDate.getTimezoneOffset();
    var dateParts = value.split(" ");
	var hourParts = ['00','00','00'];
	if (dateParts.length == 2) {
		hourParts = dateParts[1].split(':');
	}
	var dateParts2 = dateParts[0].split('/');
    var miFecha = new Date(dateParts2[2], (dateParts2[1] - 1), dateParts2[0], hourParts[0], hourParts[1], hourParts[2]);
    return miFecha.getTime() + offset * 60000 - 360 * 60000;
}

function ts2string(value) {
    var d1 = ts2date(value);
	var d = ['' + d1.getDate(), '' + (d1.getMonth() + 1), ''+ d1.getFullYear(), '' + d1.getHours(), '' + d1.getMinutes(), '' + d1.getSeconds()];
	for(var i in d){
		if (d[i].toString().length == 1) d[i] = '0' + d[i];
	}
    var stringDate = d[0] + "/" + d[1] + "/" + d[2] + ' ' + d[3] + ':' + d[4] + ':'+ d[5];
    return stringDate;
}


function ts2string2(value) {
	if (value == "") return "";
    var d1 = ts2date(value);
	var d = ['' + d1.getDate(), '' + (d1.getMonth() + 1), ''+ d1.getFullYear(), '' + d1.getHours(), '' + d1.getMinutes(), '' + d1.getSeconds()];
	for(var i in d){
		if (d[i].toString().length == 1) d[i] = '0' + d[i];
	}
    var stringDate = d[0] + "/" + d[1] + "/" + d[2];
    return stringDate;
}

function ts2stringHour(value) {
    var d1 = ts2date(value);
	var d = ['' + d1.getDate(), '' + (d1.getMonth() + 1), ''+ d1.getFullYear(), '' + d1.getHours(), '' + d1.getMinutes(), '' + d1.getSeconds()];
	for(var i in d){
		if (d[i].toString().length == 1) d[i] = '0' + d[i];
	}
    var stringDate = d[3] + ":" + d[4];
    return stringDate;
}

function validateEmail(email) {
	if (email.indexOf("@") === -1) return false;
	if (email.indexOf(".") === -1) return false;
	if (email.length < 6) return false;
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	if (!emailReg.test(email)) {
		return false;
	} else {
		return true;
	}
}

function validateTelefono(telefono) {
	var RegExPatternX = new RegExp("[0123456789 -]");
	if (telefono === "") return false;
	if (!telefono.match(RegExPatternX)) return false;
	return true;
}


function toArray(elem2) {
	console.log(elem2);
	var array2 = [], i = 0;
	$.each(elem2, function (i, o) {
		array2[i] = o;
		i++;
	});
	console.log(array2);
	return array2;
}

function toNumberArray(elem2) {
	var array2 = [], i = 0;
	$.each(elem2, function (i, o) {
		array2[i] = parseFloat(o);
		i++;
	});
	return array2;
}


function toHtml(str) {
	str = str.replace(/á/g,'a');
	str = str.replace(/é/g,'e');
	str = str.replace(/í/g,'i');
	str = str.replace(/ó/g,'o');
	str = str.replace(/ú/g,'u');
	str = str.replace(/ñ/g,'n');
	str = str.replace(/°/g,' ');
	str = str.replace(/ /g,'%20')
	str = str.replace(/&nbsp;/g,'%20');;

	return str;
}
function errorHandler(error){
	console.log(error);

	var mError = $('#modal-error');
	if (mError.css('visibility') == 'hidden'){
		mError.css('visibility','visible');
		$('#loading-window').modal('hide');
		setTimeout(function() {
			mError.modal('show');
			//refreshError();
		}, 100);
		$('#modal-error-actualizar').click(function(){
			mError.modal('hide');
		});
	}
}

var Error401 = '';
function errorHandler2(request,error){
	console.log(request);
	if (request.status == 401) {
		if (Error401 != '401'){
			Error401 = '401';
			console.log('401');
			//Auth.Logout();
		}
	} else {
		errorHandler(error);
	}
}
/*function refreshError() {
	var sec = eval($('#modal-error-seconds').html());
	sec = sec - 1;
	if (sec == 0){document.location.reload(true);return;}
	$('#modal-error-seconds').html(sec)
	setTimeout(refreshError, 1000);
}*/

function angleToCardinal(val){
    var map = {"0":"N","45":"NE", "90":"E", "135":"SE", "180":"S", "225":"SO","270":"O","315":"NO", "360":"N"};
    return map[Math.round(((eval(val)+360) % 360)/45)*45];
}

function isNumeric(input){
    return (input - 0) == input && (input+'').replace(/^\s+|\s+$/g, "").length > 0;
}

function addDays(fecha, intervalo) {
    var arrayFecha = fecha.split('/');

    var interv = intervalo.substring(1, intervalo.length);
    var operacion = intervalo.substring(0, 1);
    var dia = arrayFecha[0];
    var mes = arrayFecha[1];
    var anio = arrayFecha[2];
    var fechaInicial = new Date(anio, mes - 1, dia);
    var fechaFinal = fechaInicial;

    fechaFinal.setDate(fechaInicial.getDate() + parseInt(intervalo));

    dia = fechaFinal.getDate();
    mes = fechaFinal.getMonth() + 1;
    anio = fechaFinal.getFullYear();

    dia = (dia.toString().length == 1) ? "0" + dia.toString() : dia;
    mes = (mes.toString().length == 1) ? "0" + mes.toString() : mes;

    return dia + "/" + mes + "/" + anio;
};
