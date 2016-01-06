//Angular Controller
var app = angular.module('assetDownloader', []);

app.controller('Assets', function($scope){
    
    this.downloadAllAssetsApp = function(assets, folder) {
        downloadAllAssets(assets, folder);
    }
    
});

