var selectStation = function (){
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

var changeStation = function () {
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
		$('#change-station-seleccionar').click(selectStation);
	}
};
