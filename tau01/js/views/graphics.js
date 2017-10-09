var Graphics = {};

Graphics.Load = function (rta) {
	console.log(JSON.stringify(rta));

	if (rta.success) {
		var v = [], i = 0, j = 0, ii= 0;
		var subtitle = {text: 'Fuente: Estacion de Telemetria <strong>TAU01</strong>. Un servicio de <a href="www.techner.com.ar"><strong>Techner</strong></a>'};
		var yseries = [], mseries = [], wseries = [], dseries = [];
		var yscale = [], mscale = [], wscale = [], dscale = [];
		var yflags = [], mflags = [], wflags = [], dflags = [];
		var yAxis1 = [], unit = [];
		var exists, axis;
		$("#tab").tab();
		var values = [];
		$.each(rta.result.entries, function (i, v) {
			if (v.y.length > 0) {
				values.push(v);
			}
		});

		$.each(values, function (i, v) {
			exists = false;
			if (typeof v.variable.unit == "undefined"){
				v.variable.unit = "";
			}
			$.each(yAxis1, function (j, w) {
				if (yAxis1[j].title.text == v.variable.unit) {
					exists = true;
				}
			});
			if (!exists) {
				yAxis1[ii] = {}; /* escalas */
				yAxis1[ii].gridLineWidth = 1;
				yAxis1[ii].title = {text: v.variable.unit};
				yAxis1[ii].labels = {formatter: function () {return this.value;}};
				ii++;
			}
		});

		var yMax = 0;
		var mMax = 0;
		var wMax = 0;
		var dMax = 0;

		$.each(values, function (i, v) {
			if (yMax < v.y.length) {yMax = v.y.length;}
			if (mMax < v.m.length) {mMax = v.m.length;}
			if (wMax < v.w.length) {wMax = v.w.length;}
			if (dMax < v.d.length) {dMax = v.d.length;}
		});

		$.each(values, function (i, v) {
			yseries[i] = {}, mseries[i] = {}, wseries[i] = {}, dseries[i] = {};

			unit[v.variable.name] = v.variable.unit;
			axis = 0;
			$.each(yAxis1, function (j, w) {
				if (yAxis1[j].title.text == v.variable.unit) {
					axis = j;
				}
			});

			yseries[i].name = v.variable.name;
			yseries[i].type = 'spline';
			yseries[i].data = [];
			yseries[i].yAxis = axis;
			j = 0;
			while (v.y.length < yMax) {
				v.y.unshift({'data': null, 'scale': '0'});
			}

			$.each(v.y, function (j, y) {
				yseries[i].data[j] = null;
				if (y.data != null) {yseries[i].data[j] = parseFloat(y.data);}
				if(typeof yscale[j] == 'undefined') {yscale[j] = y.scale;;};
				j++;
			});
			
			mseries[i].name = v.variable.name;
			mseries[i].type = 'spline';
			mseries[i].data = [];
			mseries[i].yAxis = axis;
			j = 0;

			while (v.m.length < mMax) {
				v.m.unshift({'data': null, 'scale': '0'});
			}

			$.each(v.m, function (j, m) {
				mseries[i].data[j] = null;
				if (m.data != null) { mseries[i].data[j] = parseFloat(m.data); }
				if(typeof mscale[j] == 'undefined') {mscale[j] = m.scale;;};
				j++;
			})

			wseries[i].name = v.variable.name;
			wseries[i].type = 'spline';
			wseries[i].data = [];
			wseries[i].yAxis = axis;
			j = 0;
			while (v.w.length < wMax) {
				v.w.unshift({'data': null, 'scale': '0'});
			}
			$.each(v.w, function (j, w) {
				wseries[i].data[j] = null;
				if (w.data != null) {wseries[i].data[j] = parseFloat(w.data);}
				if(typeof wscale[j] == 'undefined') {wscale[j] = w.scale;};
				j++;
			})
			if (v.variable.code == 'E') {
				wseries[i].data.shift();
				wseries[i].data.push(null);
				mseries[i].data.shift();
				mseries[i].data.push(null);
			}

			dseries[i].name = v.variable.name;
			dseries[i].type = 'spline';
			dseries[i].data = [];
			dseries[i].yAxis = axis;
			dseries[i].code = v.variable.code;
			
			if (v.variable.code == 'E') {dseries[i].showInLegend = false;}

			j = 0;

			while (v.d.length < dMax) {
				v.d.unshift({'data': null, 'scale': '0'});
			}

			$.each(v.d, function (j, d) {
				dseries[i].data[j] = null;
				if (d.data != null) {dseries[i].data[j] = parseFloat(d.data);}
				if(typeof dscale[j] == 'undefined') {dscale[j] = d.scale;;};
				j++;
			})

			i++;
		});


		/* tabla diaria */
		var table = "<table class='table table-bordered table-striped table-condensed table-responsive' style='width:100%;'>";
		var header = "<thead><tr><th style='text-align:center;font-size:80%;vertical-align:middle;'>Fecha/Hora</th>";
		for (var i = 0; i < dseries.length; i++) {
			if (typeof dseries[i] != 'undefined') {
				if (dseries[i].code != 'E'){
					if (typeof unit[dseries[i].name] == 'undefined'){unit[dseries[i].name] = '-'};
					header += "<th style='text-align:center;font-size:80%;vertical-align:middle;'>" + dseries[i].name + '<br /> (' + unit[dseries[i].name] + ")</th>";
				}
			}
		}
		header += "</tr></thead>";
		table += header + "<tbody>";
		for (var j = dscale.length - 1; j >= 0; j--) {
			line = "<tr><td style='text-align:center;'>" + dscale[j] + "</td>";
			for (var i = 0; i < dseries.length; i++) {
				if (dseries[i] !== undefined && dseries[i].code != 'E') {
					if(typeof unit[dseries[i].name] == 'undefined') {unit[dseries[i].name] = '-';};
					if(typeof dseries[i].data[j] == 'undefined' || dseries[i].data[j] == null) {dseries[i].data[j] = '-';}
					line += "<td style='text-align:center;'>" + dseries[i].data[j] + "</td>";
				}
			}
			table += line + "</tr>";
		}
		table += "</tbody></table>";
		$("#dTable").html(table);
		/* tabla semanal */
		table = "<table class='table table-bordered table-striped table-condensed table-responsive' style='width:100%;'>";
		header = "<thead><tr><th style='text-align:center;font-size:80%;vertical-align:middle;'>Fecha/Hora</th>";
		for (i = 0; i < wseries.length; i++) {
			header += "<th style='text-align:center;font-size:80%;vertical-align:middle;'>" + wseries[i].name + '<br /> (' + unit[yseries[i].name] + ")</th>";
		}
		header += "</tr></thead>";
		table += header + "<tbody>";
		for (j = wscale.length - 1; j >= 0; j--) {
			line = "<tr><td style='text-align:center;'>" + wscale[j] + "</td>";
			for (i = 0; i < wseries.length; i++) {
				if(typeof wseries[i].data[j] == 'undefined' || wseries[i].data[j] == null) {wseries[i].data[j] = '-';};
				line += "<td style='text-align:center;'>" + wseries[i].data[j] + "</td>";
			}
			table += line + "</tr>";
		}
		table += "</tbody></table>";
		$("#sTable").html(table);
		/* tabla mensual */
		table = "<table class='table table-bordered table-striped table-condensed table-responsive' style='width:100%;'>";
		header = "<thead><tr><th style='text-align:center;font-size:80%;vertical-align:middle;'>Fecha/Hora</th>";
		for (i = 0; i < mseries.length; i++) {
			header += "<th style='text-align:center;font-size:80%;vertical-align:middle;'>" + mseries[i].name + '<br /> (' + unit[yseries[i].name] + ")</th>";
		}
		header += "</tr></thead>";
		table += header + "<tbody>";
		for (j = mscale.length - 1; j >= 0; j--) {
			line = "<tr><td style='text-align:center;'>" + mscale[j] + "</td>";
			for (i = 0; i < mseries.length; i++) {
				if(typeof mseries[i].data[j] == 'undefined' || mseries[i].data[j] == null) {mseries[i].data[j] = '-';}
				line += "<td style='text-align:center;'>" + mseries[i].data[j] + "</td>";
			}
			table += line + "</tr>";
		}
		table += "</tbody></table>";
		$("#mTable").html(table);
		/* tabla anual */
		table = "<table class='table table-bordered table-striped table-condensed table-responsive' style='width:100%;'>";
		header = "<thead><tr><th style='text-align:center;font-size:80%;vertical-align:middle;'>Fecha/Hora</th>";
		for (i = 0; i < yseries.length; i++) {
			header += "<th style='text-align:center;font-size:80%;vertical-align:middle;'>" + yseries[i].name + '<br /> (' + unit[yseries[i].name] + ")</th>";
		}
		header += "</tr></thead>";
		table += header + "<tbody>";
		for (j = yscale.length - 1; j >= 0; j--) {
			line = "<tr><td style='text-align:center;'>" + yscale[j] + "</td>";
			for (i = 0; i < yseries.length; i++) {
				if(typeof yseries[i].data[j] == 'undefined' || yseries[i].data[j] == null) {yseries[i].data[j] = '-';}
				line += "<td style='text-align:center;'>" + yseries[i].data[j] + "</td>";
			}
			table += line + "</tr>";
		}
		table += "</tbody></table>";
		$("#aTable").html(table);

		/* graficos */
		aChart = new Highcharts.Chart({
			chart: {
				renderTo: 'aDiv',
				zoomType: 'xy'
			},
			subtitle: subtitle, xAxis: [{categories: yscale}], yAxis: yAxis1,
			title: {
				text: 'Promedio Mensual de Datos Meteorologicos'
			},
			tooltip: {
				formatter: function () {
					return '<strong>' + this.series.name + '</strong>: ' + this.y + ' ' + unit[this.series.name] + ' (' + this.x + ')';
				}
			},
		    plotOptions: {
	            series: {
	                connectNulls: true // by default
	            },
	            area: {
                	fillOpacity: 0.5
            	}
        	},
			credits: {
            	enabled: false
        	},
			series: yseries
		});
		for (i = 0; i < aChart.series.length; i++) {
			aChart.series[i].hide();
		}
		mChart = new Highcharts.Chart({
			chart: {
				renderTo: 'mDiv',
				zoomType: 'xy',
				type: 'area'
			},
			subtitle: subtitle,xAxis: [{categories: mscale}],yAxis: yAxis1,
			title: {
				text: 'Promedio Diario Mensual de Datos Meteorologicos'
			},
			tooltip: {
				formatter: function () {
					return '<strong>' + this.series.name + '</strong>: ' + this.y + ' ' + unit[this.series.name] + ' (' + this.x + ')';
				}
			},
		    plotOptions: {
	            series: {
	                connectNulls: true // by default
	            },
	            area: {
                	fillOpacity: 0.5
            	}
        	},
			credits: {
            	enabled: false
        	},
			series: mseries
		});
		for (i = 0; i < mChart.series.length; i++) {
			mChart.series[i].hide();
		}
		sChart = new Highcharts.Chart({
			chart: {
				renderTo: 'sDiv',
				zoomType: 'xy',
				type: 'area'
			},
			subtitle: subtitle,xAxis: [{categories: wscale}],yAxis: yAxis1,
			title: {
				text: 'Promedio Diario Semanal de Datos Meteorologicos'
			},
			tooltip: {
				formatter: function () {
					return '<strong>' + this.series.name + '</strong>: ' + this.y + ' ' + unit[this.series.name] + ' (' + this.x + ')';
				}
			},
		    plotOptions: {
	            series: {
	                connectNulls: true // by default
	            },
	            area: {
                	fillOpacity: 0.5
            	}
        	},
			credits: {
            	enabled: false
        	},
			series: wseries
		});
		for (i = 0; i < sChart.series.length; i++) {
			sChart.series[i].hide();
		}
		dChart = new Highcharts.Chart({
			chart: {
				renderTo: 'dDiv',
				zoomType: 'xy',
				type: 'area'
			},
			subtitle: subtitle,xAxis: [{categories: dscale}], yAxis: yAxis1,
			title: {
				text: 'Promedio Horario de Datos Meteorologicos'
			},
			tooltip: {
				formatter: function () {
					return '<strong>' + this.series.name + '</strong>: ' + this.y + ' ' + unit[this.series.name] + ' (' + this.x + ')';
				}
			},
		    plotOptions: {
	            series: {
	                connectNulls: true // by default
	            },
	            area: {
                	fillOpacity: 0.5
            	}
        	},
			credits: {
            	enabled: false
        	},
			series: dseries
		});
		for (i = 0; i < dChart.series.length; i++) {
			dChart.series[i].hide();
		}
		for(var i = 0; i < dChart.yAxis.length; i++){
			dChart.yAxis[i].update({
				gridLineWidth: 0,
  				minorGridLineWidth: 0,
  				gridLineColor: 'transparent',
                labels: {
                    enabled: false
                },
                title : {
                	enabled: false
                }
            });
		}
		for(var i = 0; i < sChart.yAxis.length; i++){
			sChart.yAxis[i].update({
				gridLineWidth: 0,
  				minorGridLineWidth: 0,
  				gridLineColor: 'transparent',
                labels: {
                    enabled: false
                },
                title : {
                	enabled: false
                }
            });
		}
		for(var i = 0; i < mChart.yAxis.length; i++){
			mChart.yAxis[i].update({
				gridLineWidth: 0,
  				minorGridLineWidth: 0,
  				gridLineColor: 'transparent',
                labels: {
                    enabled: false
                },
                title : {
                	enabled: false
                }
            });
		}
		for(var i = 0; i < aChart.yAxis.length; i++){
			aChart.yAxis[i].update({
				gridLineWidth: 0,
  				minorGridLineWidth: 0,
  				gridLineColor: 'transparent',
                labels: {
                    enabled: false
                },
                title : {
                	enabled: false
                }
            });
		}

		$('#informediario').click();
	}
};
