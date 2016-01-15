//Angular Controller
var app = angular.module('assetDownloader', []);

app.controller('Assets', function($scope){
    
    this.downloadAllAssetsApp = function(assets, folder) {
        downloadAllAssets(assets, folder);
    }
	
    this.downloadSingleAssetApp = function(asset, folder) {
        downloadSingleAsset(asset, folder);
    }
	
	this.hasAssets = function(assets) {
		if (assets.length > 0) {
			return true;
		}
		return false;
	}
	
	//Expand Function
	this.toggleExpand = function(expand) {
		if (typeof expand  == "undefined")
			return true;
			
		return !expand;
	}
	
	this.getPreviewElement = function(type, url) {

		var element;
		if (type == "images") {
			element = "<img src='" + url + "'>";
		} else if (type == "fonts") {
			var fontName = this.getFileName(url).split('.')[0];
			element = "<style>" +
				"@font-face {" +
				"font-family: font" + fontName + "; " +
				"src: url(" + url + ")" +
				"}" +
				"</style>" +
				"<div style='font-family: font" + fontName + "; font-size:16px;'>Grumpy wizards make toxic brew for the evil Queen and Jack.</div>";
		}
		return element;
	}
	

	
	//Get File Name Function
	this.getFileName = function(url) {
		url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
		url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
		url = url.substring(url.lastIndexOf("/") + 1, url.length);
		return url;
	}
    
});


app.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);


	var getRandomNum = function(){
		return Math.floor((Math.random()*100000)+1);
	}


// app.filter("randomize", ['$sce', function() {
	
// return function(input, scope) {
// 	return Math.floor((Math.random()*input)+1);
// }

// }]);




