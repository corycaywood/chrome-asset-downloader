//Angular Controller
var app = angular.module('assetDownloader', []);

app.controller('Assets', function($scope){
    
    this.downloadAllAssetsCategory = function(assets, folder, index) {
		if (assets.length > 0 ) {
			downloadAsset(assets.length - 1);
		}
		function downloadAsset(count) {
			//Download Resource
			downloadAssetApp(assets[count], folder, index, count, assets.length, function(){
				//Recursively download - so it will download one at a time
				if (count > 0) {
					downloadAsset(count - 1);
				}
			})
		}
    }
	
    this.downloadAllAssets = function(assets, folder, index) {
		if (assets.length > 0 ) {
			downloadAsset(assets.length - 1);
		}
		function downloadAsset(count) {
			//Download Resource
			downloadAssetApp(assets[count], folder, index, count, assets.length, function(){
				//Recursively download - so it will download one at a time
				if (count > 0) {
					downloadAsset(count - 1);
				}
			})
		}
    }
	
    this.downloadSingleAssetApp = function(asset, folder) {
        downloadAssetApp(asset, folder);
    }
	
	this.hasAssets = function(assets) {
		if (assets.length > 0) {
			return true;
		}
		return false;
	}
	
	//Toggle Function
	this.toggleBoolean = function(expand) {
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
				"<div class='font-example' style='font-family: font" + fontName + ";'>Grumpy wizards make toxic brew for the evil Queen and Jack.</div>";
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
	


/* Global Functions 
***********************/
	var downloadAssetApp = function(asset, folder, index, count, length, callback) {
		downloadSingleAsset(asset, folder, index, count, length);

		document.addEventListener("doneDownloadingFile" + index + "" + count, function(e) {
			setPercentage(index, ((length - (count)) / length * 100));
			
			if (((length - (count)) / length * 100) == 100) {
				setDownloadDone(index);
			}
			
		});
		
		if (typeof callback == "function" ) {
			callback();
		}
	}

	var setPercentage = function(index, percent){
		var scope = angular.element(document.getElementById('assetDownloader')).scope();
		scope.$apply(function(){scope.stylesheets[index].downloadPercent = percent});
	}
	
	var setDownloadDone = function(index){
		window.setTimeout(function(){
			var scope = angular.element(document.getElementById('assetDownloader')).scope();
			scope.$apply(function(){scope.stylesheets[index].downloaded = true});
		}, 500)
	}



