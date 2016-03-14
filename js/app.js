//Angular Controller
var app = angular.module('assetDownloader', []);

app.controller('Assets', function($scope){
	
	this.downloadFontsAndImages = function(assets, index) {
        $scope.resources.stylesheets[index].progressIsVisible = true;
        $scope.resources.stylesheets[index].categories.images.progressIsVisible = true;
		downloadAllAssetsApp(assets.fonts, 'fonts', index, function(){
            $scope.resources.stylesheets[index].categories.fonts.progressIsVisible = true;
            downloadAllAssetsApp(assets.images, 'images', index);
        });
	}
	
    this.downloadAllAssets = function(assets, folder, index) {
		if (index > -1) {
			$scope.resources.stylesheets[index].categories[folder].progressIsVisible = true;
		}
		downloadAllAssetsApp(assets, folder, index);
    }
	
    this.downloadSingleAssetApp = function(asset, folder) {
        downloadAssetApp(asset, folder, 0, 1, 1);
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
    
    /* Href Prevent Default */
    this.preventDefaultHref = function(e) {
        e.preventDefault();
    }
	
	
	/* Tabs */
	this.tab = "stylesheets";
	this.setTab = function(newValue){
		this.tab = newValue;
	};
	this.isSet = function(tabName){
		return this.tab === tabName;
	};
    
});


/* Sanitize - allows HTML to be injected by app functions */
app.filter("sanitize", ['$sce', function($sce) {
	return function(htmlCode){
		return $sce.trustAsHtml(htmlCode);
	}
}]);
	
app.directive('collapse', [function () {
    return {
        restrict: 'A',

        link: function ($scope, ngElement, attributes) {
            var element = ngElement[0];

            $scope.$watch(attributes.collapse, function (collapse) {
                var newHeight = collapse ? 0 : getElementAutoHeight();

				// Set current height so css animation gets applied
				element.style.height = getElementCurrentHeight();
				// Set new height
				setTimeout(function(){
					element.style.height = newHeight;
					ngElement.toggleClass('collapsed', collapse);
				}, 5)
				// Reset Height to auto after animation
				if (newHeight > 0) {
					setTimeout(function(){
						element.style.height = 'auto';
					}, 350)
				}
            });

            function getElementAutoHeight() {
                var currentHeight = getElementCurrentHeight();
                element.style.height = 'auto';
                var autoHeight = getElementCurrentHeight();
                element.style.height = currentHeight;
                getElementCurrentHeight(); 
                return autoHeight;
            }

            function getElementCurrentHeight() {
                return element.offsetHeight
            }
        }
    };
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
		var scope = angular.element(document.getElementById('assetDownloader')).scope();
		scope.$apply(function(){
			scope.resources = res
			scope.folderName = folder + "_Assets";
		});
		
		// Get Font Data Uris
		getFontDataUris(scope.resources.fonts);
	}
	
    /* Set Font Data Uris to scope */
    this.getFontDataUris = function(items){
		for (var i = 0; i < items.length; i++) {
			if (typeof items[i].dataUri == "undefined") {
				getDataUriXhr(items[i].url, i);
			}
		}
    }

	/* Set progress bar percentage */
	var setPercentage = function(type, index, percent){
		if (index > -1) {
			var scope = angular.element(document.getElementById('assetDownloader')).scope();
			scope.$apply(function(){scope.resources.stylesheets[index].categories[type].downloadPercent = percent});
		}
	}
	
	/* Set download complete */
	var setDownloadDone = function(type, index){
		if (index > -1) {
			window.setTimeout(function(){
				var scope = angular.element(document.getElementById('assetDownloader')).scope();
				scope.$apply(function(){scope.resources.stylesheets[index].categories[type].downloaded = true});
			}, 500)
		}
	}

    /* Set Data Uri's for fonts */
    var setFontDataUri = function(e) {
        var scope = angular.element(document.getElementById('assetDownloader')).scope();
        scope.$apply(function(){scope.resources.fonts[e.index].dataUri = e.data;});
    }