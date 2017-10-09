/**
 * @see 	https://github.com/carhartl/jquery-cookie
 */
var Cookie = {};

Cookie.GetAll = function (){
	return $.cookie();
};

Cookie.Get = function (name){
	return $.cookie(name);
};

Cookie.Set = function (name, value, expireDays){
	if(typeof expireDays == 'undefined'){
		$.cookie(name, value);
	} else {
		$.cookie(name, value, {expires: expireDays});
	}
};

Cookie.Delete = function (name) {
	$.removeCookie(name);
};