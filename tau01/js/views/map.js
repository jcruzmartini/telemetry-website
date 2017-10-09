//https://developers.google.com/maps/documentation/javascript/tutorial
var Map = {};
Map.Center = new google.maps.LatLng(-32.69148,-62.095855);

Map.Initialize = function (mapContainer) {
	var mapOptions = {zoom: 13, mapTypeId: google.maps.MapTypeId.HYBRID, center: Map.Center};
	var current = new google.maps.Map(mapContainer, mapOptions);
	var marker = new google.maps.Marker({map:current, draggable:true, animation: google.maps.Animation.DROP, position: Map.Center});
	//google.maps.event.trigger(Map.Current, 'resize');
	//Map.Current.setZoom( Map.Current.getZoom() );
};

Map.Update = function (lat, lon) {
	var mapCanvas1 = document.getElementById('map-canvas');
	var mapCanvas3 = document.getElementById('station-map-canvas');
	Map.Center = new google.maps.LatLng(lat, lon);

	if (mapCanvas1) {Map.Initialize(mapCanvas1);};
	if (mapCanvas3) {Map.Initialize(mapCanvas3);};

};

Map.ListenMap = function () {
	var initMap = function () {Map.Initialize(document.getElementById('map-canvas'));};
	google.maps.event.addDomListener(window, 'load', initMap);
	$("#showmap").click(function(e){
		$('#google-map').css('left',(e.pageX-150)+'px');
		$('#google-map').css('top',(e.pageY-53)+'px')
		setTimeout(function () {
			$('#google-map').show();
		}, 250);
	});
	$("#google-map").mouseout(function(e){
		var left = e.pageX - eval($('#google-map').css('left').replace("px", ""));
		var top = e.pageY - eval($('#google-map').css('top').replace("px", ""));
		if (top < 44 || top > 345){$('#google-map').hide()};
		if (left < 2 ||  left > 305){$('#google-map').hide()};
	});
	$("#google-map").mousemove(function(e){
		var left = e.pageX - eval($('#google-map').css('left').replace("px", ""));
		var top = e.pageY - eval($('#google-map').css('top').replace("px", ""));
		if (top < 44 || top > 345){$('#google-map').hide()};
		if (left < 2 ||  left > 305){$('#google-map').hide()};
	});
};

Map.AddMap = function () {
	var html = '<div id="map-canvas"></div>';
	//Se debe mover el mapa fuera de la pantalla porque el $.hide() de jquery hace que el mapa no se cargue como debe
	$('#google-map').css('top','-1000px').css('left','-1000px');
	$('#google-map').append(html);
	$('#map-canvas').css('width','300px').css('height','300px');
	Map.ListenMap();
};
