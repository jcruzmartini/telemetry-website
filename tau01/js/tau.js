Tau = {};
Tau.Configurator = {};
Tau.AuthorizationToken = '';
Tau.ListOfVar = undefined;
Tau.ActiveStation = undefined;
Tau.UserData2 = undefined;

Tau.StartApp = function () {
	$("html, body").animate({scrollTop: 0}, 600);
	ControlPanel.ShowResume();
	Evolution.Load();
	Notifications.Load();
	Map.AddMap();
	refresh();
	Tau.ActiveStation = jQuery.parseJSON(Cookie.Get('activeStation'));
	$('#location-span').html('Lat: ' + Tau.ActiveStation.latitude +' |  Lon: ' + Tau.ActiveStation.longitude + '| Alt: ' + Tau.ActiveStation.altitude);
	Map.Update(Tau.ActiveStation.latitude, Tau.ActiveStation.longitude);
	Forecast.Update(Tau.ActiveStation.latitude, Tau.ActiveStation.longitude);
	$('.container-fluid').show();
	$('#header-resume').show();
	$.ajax({
		type: 'GET', url: Tau.Configurator.wsUrl + "/notifications/" + Tau.ActiveStation.id + "/today",
		data : {"eToken":Tau.AuthorizationToken},
		dataType: "json",
		success: Notifications.LoadToday,
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);}
	});
};

Tau.Init = function () {
	$(window).resize(Responsive.ResizeWindow);
	$(window).trigger('resize');
	Tau.Configurator.wsUrl = "http://tau01.com/tau-services";
	Auth.ShowLogin();
	$('#modal-error').css('visibility','hidden');
	$('#change_station').click(Stations.ChangeStation);
	$('a.profile-link').click(Profile.Show);
	$('a.resume-link').click(ControlPanel.Show);
	$('a.evolution-link').click(Evolution.Show);
	$('a.decisions-link').click(Decisions.Show);
	$('a.notifications-link').click(Notifications.Show);
	$('a.forecast-link').click(Forecast.Show);
	$('a.historical-link').click(Historical.Show);
	$('a.economics-link').click(Economics.Show);
	$('a.admin-console-link').click(AdminConsole.Show);
	$('a.logout').click(Auth.Logout);
};

$(document).ready(Tau.Init);
