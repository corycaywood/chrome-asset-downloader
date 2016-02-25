
function setResources(res, folder){
	document.querySelector("#folderName").innerHTML = folder + "_Assets";
    
    var scope = angular.element(document.getElementById('assetDownloader')).scope();
    scope.$apply(function(){scope.stylesheets = res});
    
}


function doneDownloadingFile() {
	
	var scope = angular.element(document.getElementById('assetDownloader')).scope();
	
	
}



// Send message to background
// respond("stuff");