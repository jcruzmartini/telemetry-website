Tau = {};
Tau.Configurator = {};

	$(document).ready(function () {
		Tau.Configurator.wsUrl = "http://tau01.com/tau-services";
		$('#btn-acceder').hide();
		$('#btn-info').hide();
		$('#btn-info3').hide();

		$('#logo-techner').hide();

		$.ajax({
			type: 'GET',
			url: Tau.Configurator.wsUrl + "/stations/monitoring",
			dataType: "json",
			success: function (rta) {
				loadMap(rta);
			},
			error: function (request, error) {
				console.log('Error');
			},
			failure: function (errMsg) {
				console.log('Error');
			}
		});
		$(window).resize(function () {
			var ww = $(window).width();
			var wh = $(window).height();
			$("body").css("overflow", "hidden");
			$('#map_canvas').css('top', '-10px');
			$('#map_canvas').css('left', '-10px');
			$('#map_canvas').css('width', 1.05 * ww + 'px');
			$('#map_canvas').css('height', 1.05 * wh + 'px');
			if (wh < 500) {
				$('#beneficios').hide();
			} else {
				$('#beneficios').show();
			}



		});
		$(window).trigger('resize');
		$('#btn-acceder').click(function () {
			window.location.href = './monitor.htm';
		});
		$('#btn-info').click(function () {
			$('#btn-info2').hide();
			var info = $('#btn-info');
			info.css("width","80%");
			info.css("top","25%");
			info.css("height","65%");
			$('#btn-info3').show();
		});
		$('#btn-info-close').click(function (event) {
			event.preventDefault();
			event.stopPropagation();
			var info = $('#btn-info');
			$('#btn-info3').hide();
			info.css("top","40%");
			info.css("height","20%");
			info.css("width","2%");
			$('#btn-info2').show();
		});

	});
	var loadMap = function (data) {
		setTimeout(function () {
			$("#btn-acceder").fadeIn(3000);
			$("#logo-techner").fadeIn(3000);
			$('#btn-info').fadeIn(3000);
		}, 2000);
		if (!data.success) return;
		var myOptions = {
			mapTypeId: google.maps.MapTypeId.HYBRID,
			mapTypeControl: false
		};
		var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		var infowindow = new google.maps.InfoWindow();
		var marker, i;
		var bounds = new google.maps.LatLngBounds();


		$.each(data.result.entries, function (i, o) {
			var pos = new google.maps.LatLng(o.station.latitude, o.station.longitude);
			bounds.extend(pos);
			marker = new google.maps.Marker({
				position: pos,
				map: map,
				icon: 'http://tau01.com/img/techner-logo.png',
				title: o.station.location
			});
			var msg = '<div style="float:left;"><img src="http://tau01.com/img/tau-white.png" /><br/><br/>';
			$.each(o.measure.entries, function (i, q) {
				if (typeof q.variable.unit == 'undefined') {
					q.variable.unit = '';
				};
				if (typeof q.values[0] != 'undefined') {
					msg += '<span style="vertical-align:top;"><img src="http://tau01.com/img/sensors/white/' + q.variable.filename + '" width="20px"/><span style="vertical-align:top;">&nbsp;' + q.variable.name + ':&nbsp;' + q.values[0].value + ' ' + q.variable.unit + '</span></span><br/>';
				}
			});
			if (o.measure.lastUpdate < 60) {
				msg += '<span style="vertical-align:top;"><img src="http://tau01.com/img/sensors/white/status-ok.png" width="20px"/><span style="vertical-align:top;">&nbsp;Estado: &nbsp; Activa</span></span>';
			} else {
				msg += '<span style="vertical-align:top;"><img src="http://tau01.com/img/sensors/white/status-error.png" width="20px"/><span style="vertical-align:top;">&nbsp;Estado: &nbsp; No Activa</span></span>';
			}
			msg += '</div>';
			var boxText = document.createElement("div");
			boxText.style.cssText = "border: 1px solid #111; border-radius: 5px;color:#fff; font-size:12px;background:rgba(0,0,0,0.8); padding: 10px;display: inline-block;z-index:1000;";
			google.maps.event.addListener(marker, 'click', (function (marker, i) {
				return function () {
					boxText.innerHTML = msg;

					var myOptions2 = {
						content: boxText,
						disableAutoPan: false,
						maxWidth: 0,
						pixelOffset: new google.maps.Size(-80, 0),
						zIndex: null,
						boxStyle: {
							opacity: 0.99,
							width: "180px"
						},
						closeBoxMargin: "20px 25px -20px -25px",
						closeBoxURL: "http://tau01.com/img/uploadify-cancel.png",
						infoBoxClearance: new google.maps.Size(1, 1),
						isHidden: false,
						pane: "floatPane",
						enableEventPropagation: false
					};

					var ib = new InfoBox(myOptions2);
					ib.open(map, marker);
				}
			})(marker, i));
		});
		map.fitBounds(bounds);
		var listener = google.maps.event.addListener(map, "idle", function () {
			if (map.getZoom() > 16) map.setZoom(16);
			google.maps.event.removeListener(listener);
		});
	};

