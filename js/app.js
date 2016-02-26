//Angular Controller
var app = angular.module('assetDownloader', []);

app.controller('Assets', function($scope){
	
	this.downloadFontsAndImages = function(assets, index) {
		downloadAllAssetsApp(assets.fonts, 'fonts', index, function(){
			downloadAllAssetsApp(assets.images, 'images', index);
		});
	}
	
    this.downloadAllAssets = function(assets, folder, index) {
		downloadAllAssetsApp(assets, folder, index);
    }
	
    this.downloadSingleAssetApp = function(asset, folder) {
        downloadAssetApp(asset, folder);
    }
	
	/* Check if stylesheet has assets */
	this.hasAssets = function(assets) {
		if (assets.length > 0) {
			return true;
		}
		return false;
	}
	
	//Toggle Boolean Function
	this.toggleBoolean = function(expand) {
		if (typeof expand  == "undefined")
			return true;
			
		return !expand;
	}
	
	//Convert undefinded to number
	this.convertUndefinedToNum = function(number) {
		if (typeof number  !== "number")
			return 0;
			
		return number;
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


/* Sanitize - allows HTML to be injected by app functions */
app.filter("sanitize", ['$sce', function($sce) {
	return function(htmlCode){
		return $sce.trustAsHtml(htmlCode);
	}
}]);
	


/* Global Functions 
***********************/

    var downloadAllAssetsApp = function(assets, folder, index, callback) {
		if (assets.length > 0 ) {
			downloadAsset(assets.length - 1);
		} else if (typeof callback == "function" ) {
			callback();
		}
		function downloadAsset(count) {
			//Download Resource
			downloadAssetApp(assets[count], folder, index, count, assets.length, function(){
				//Recursively download - so it will download one at a time
				if (count > 0) {
					downloadAsset(count - 1);
				} else if (typeof callback == "function" ) {
					callback();
				}
			})
		}
    }


	var downloadAssetApp = function(asset, folder, index, count, length, callback) {
		downloadSingleAsset(asset, folder, index, count, length);
		document.addEventListener("doneDownloadingFile" + index + "" + count, function(e) {
			//Callback to set progress bar percentage and download state
			setPercentage(folder, index, ((length - (count)) / length * 100));
			if (((length - (count)) / length * 100) == 100) {
				setDownloadDone(folder, index);
			}
		});
		if (typeof callback == "function" ) {
			callback();
		}
	}
	
	/* Set the resources from stylesheet to the scope's stylesheet object */
	function setResources(res, folder){
		document.querySelector("#folderName").innerHTML = folder + "_Assets";
		var scope = angular.element(document.getElementById('assetDownloader')).scope();
		scope.$apply(function(){scope.stylesheets = res});
	}

	/* Set progress bar percentage */
	var setPercentage = function(type, index, percent){
		var scope = angular.element(document.getElementById('assetDownloader')).scope();
		scope.$apply(function(){scope.stylesheets[index].categories[type].downloadPercent = percent});
	}
	
	/* Set download complete */
	var setDownloadDone = function(type, index){
		window.setTimeout(function(){
			var scope = angular.element(document.getElementById('assetDownloader')).scope();
			scope.$apply(function(){scope.stylesheets[index].categories[type].downloaded = true});
		}, 500)
	}

