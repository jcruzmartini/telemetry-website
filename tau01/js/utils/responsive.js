var Responsive = {};

Responsive.ResizeWindow = function(){
	var ww = $(window).width();
	/*if (ww < 900) {
		document.location.href = './small.htm';
	};*/
	var logo = $('#logo-techner');
	if (ww < 1240 && logo.attr('src').indexOf('min') == -1) {
		$('#logo-techner').attr('src', './img/techner/logo-techner-min.png');
	} else if (ww >= 1240 && logo.attr('src').indexOf('min') > -1) {
		$('#logo-techner').attr('src', './img/techner/logo-techner.png')
	}
	if (ww < 900) {
		$('#map-link').hide();
		$('#notifications-link').hide();
	} else {
		$('#map-link').show();
		$('#notifications-link').show();
	}


};
