var Economics = {};

Economics.Load = function (data) {
	$("#content-economics-div").html(data);
	load($("#li-economics"), $("#content-economics-div"), 1000);
	$('#preciosmercado2').click();
};

Economics.Show = function () {
	$.ajax({
		url: 'economics.htm', dataType: 'html', type: 'GET',
        error: function (request, error) {errorHandler2(request, error);},
		failure: function (errMsg) {errorHandler(errMsg);},
		success: Economics.Load
	});
};
