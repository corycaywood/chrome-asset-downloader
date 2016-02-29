//Angular Controller
var app = angular.module('assetDownloader', []);

app.controller('Assets', function($scope){
	
	this.downloadFontsAndImages = function(assets, index) {
        $scope.stylesheets[index].progressIsVisible = true;
        $scope.stylesheets[index].categories.images.progressIsVisible = true;
		downloadAllAssetsApp(assets.fonts, 'fonts', index, function(){
            $scope.stylesheets[index].categories.fonts.progressIsVisible = true;
            downloadAllAssetsApp(assets.images, 'images', index);
        });
	}
	
    this.downloadAllAssets = function(assets, folder, index) {
        $scope.stylesheets[index].categories[folder].progressIsVisible = true;
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
	
	//Get File Name Function
	this.getFileName = function(url) {
		url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
		url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
		url = url.substring(url.lastIndexOf("/") + 1, url.length);
		return url;
	}
    
    /* Set Font Data Uris to scope */
    this.getFontDataUris = function(items, index, category_name){
        document.addEventListener("returnDataUri" + index, function(e) {
            $scope.$apply(function(){ $scope.stylesheets[e.detail.index].categories.fonts[e.detail.count].dataUri = e.detail.data;});
        });
        if (category_name == "fonts" && typeof $scope.stylesheets[index].categories.fonts[0].dataUri == "undefined") {
            for (var i = 0; i < items.length; i++) {
                getDataUriXhr(items[i].url, index, i);
            }
        }
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
			downloadAssetApp(assets[count].url, folder, index, count, assets.length, function(){
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
        if (typeof callback == "function" ) {
            callback();
        }
	}
    //Callback to set progress bar percentage and download state
    var doneDownloadingFile = function(e){
        setPercentage(e.folder, e.index, ((e.length - (e.count)) / e.length * 100));
        if (((e.length - (e.count)) / e.length * 100) == 100) {
            setDownloadDone(e.folder, e.index);
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

    /* Set Data Uri's for fonts */
    var setFontDataUri = function(e) {
        var scope = angular.element(document.getElementById('assetDownloader')).scope();
        scope.$apply(function(){scope.stylesheets[e.index].categories.fonts[e.count].dataUri = e.data;});
    }