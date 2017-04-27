/* GLOBAL VARIABLES */
var default_path = "/";
var UrlParams = {};

function getParmsFromURLHash() {
    var url = location.href;
    var hash = url.lastIndexOf("#");
    if (hash !== -1) {
        url = url.slice(hash + 1);
		url = url.replace(/([^:])(\/+)/g, "$1/");
		while(url.charAt(0) == "/") url = url.substr(1);
		while(url.charAt(url.length - 1) == "/") url = url.substr(0, url.length - 1);
		url = url.split('?')[0];
		
		var params = url.split('/');
		for(var key in params)
			if(params[key] && !isNaN(params[key]))
				params[key] = parseFloat(params[key]);
		return {
			url,params
		};
	}
	return false;
}

function Routes(customRoutes){
	window.onload = function(){initializeRouter(customRoutes)};
	window.onhashchange = function(){initializeRouter(customRoutes)};
}

function initializeRouter(customRoutes){
	var data = getParmsFromURLHash();
	params = data.params;
	if(!params){
		if(customRoutes.default){
			default_path = "#"+(customRoutes.default.charAt(0) != "/"?"/":"")+customRoutes.default;
			window.location.hash = default_path;
			e.preventDefault();
		}
		return false;
	}
	
	var url = data.url;
	if(url === "") url = "/";
	if(customRoutes.default) delete customRoutes.default;
	var paths = Object.keys(customRoutes);
	
	// Clean Slashes
	for(var p in paths){
		if(paths[p].length > 1 && paths[p].charAt(0) === "/"){
			var new_path = paths[p].substr(1);
			customRoutes[new_path] = customRoutes[paths[p]];
			delete customRoutes[paths[p]];
			paths[p] = new_path;
		}
	}
	
	// Chack If Same Url
	if(paths.indexOf(url) != -1){
		if(typeof customRoutes[url] === 'function'){
			// Set The Params
			UrlParams = {};
			UrlParams["fullUrl"] = url;
			
			customRoutes[url]();
			return false;
		}
	}
	
	// Check With RegEx Match
	var regex_paths = [];
	for(var p in paths){
		var path = paths[p];
		if(path.indexOf("/:") >= 0){
			var path_obj = {};
			path_obj['original'] = path;
			path_obj['reg_exp'] = path.replace(/:([^/]+)/gi, "([^/]+)");
			regex_paths.push(path_obj);
		}
	}
	for(var r in regex_paths){
		var path = regex_paths[r];
		if(url.match(new RegExp(path.reg_exp,'gi')) && url.split('/').length === path.original.split('/').length){
			if(typeof customRoutes[path.original] === 'function'){
				// Set The Params
				UrlParams = {};
				UrlParams["fullUrl"] = url;
				url_parts = url.split('/');
				pattern_parts = path.original.split('/');
				for(var pat in pattern_parts){
					var par = pattern_parts[pat];
					if(par.charAt(0) === ":")
						UrlParams[pattern_parts[pat].substr(1)] = url_parts[pat];
				}
				
				customRoutes[path.original]();
				return false;
			}
		}
	}
	
	// Else send to Home
	window.location.hash = default_path;
	e.preventDefault();
	return false;
}
