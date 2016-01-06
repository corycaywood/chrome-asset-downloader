
function setResources(res, folder){
	document.querySelector("#folderName").innerHTML = folder + "_Assets";
    
    var scope = angular.element(document.getElementById('assetDownloader')).scope();
    scope.$apply(function(){scope.stylesheets = res});
    
}


function doneDownloading() {
	window.alert('done downloading')
}


//Get File Name Function
function getFileName(url) {
	url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
	url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
	url = url.substring(url.lastIndexOf("/") + 1, url.length);
	return url;
}


// Send message to background
// respond("stuff");