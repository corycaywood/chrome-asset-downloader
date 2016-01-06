/* TODO:
	- Add angular
	- tree structure for each stylesheet
	- parse and get all asset URLs before passing to contenScript - so it doesn't do it twice
	- field for folder name
*/


var REGEX = /url\([^\)]*?(\.jpg|\.png|\.gif|\.eot|\.woff|\.woff2|\.svg|\.otf|\.ttf)[^\)]*?\)/ig,
    FONT_REGEX = /url\([^\)]*?(\.eot|\.woff|\.woff2|\.svg|\.otf|\.ttf)[^\)]*?\)/ig,
    IMAGE_REGEX = /url\([^\)]*?(\.jpg|\.png|\.gif)[^\)]*?\)/ig,
	window_url,
	folder_name;

chrome.devtools.panels.create(
	"Asset Downloader",
	null,
	"assetDown.html",
	function(extensionPanel) {
			
		var _window = extensionPanel; // Going to hold the reference to panel.html's `window`

		var data = [];
		var port = chrome.runtime.connect({name: 'devtools'});
		port.onMessage.addListener(function(msg) {
            // Message from Background
			// Write information to the panel, if exists.
			// If we don't have a panel reference (yet), queue the data.
			if (_window) {
				if (msg.action == "doneDownloading") {
					_window.doneDownloading();
				}
			} else {
				data.push(msg);
			}
			
		});
		
		

		extensionPanel.onShown.addListener(function tmp(panelWindow) {
			extensionPanel.onShown.removeListener(tmp); // Run once only
			_window = panelWindow;

			// Release queued data
			var msg,
				resources;
			while (msg = data.shift()){
				if (msg.action == "doneDownloading") {
					_window.doneDownloading();
				}
			} 

			
			//Get inspected window url
			chrome.devtools.inspectedWindow.eval("window.location.href", function(result) {
				window_url = result;
			});
            
            //Get inspected window title for folder name
            chrome.devtools.inspectedWindow.eval("document.title", function(result) {
				folder_name = result.replace(/\s/g, "_").replace(/\|/g, "");
			});
            
			//Get Stylesheet links
			chrome.devtools.inspectedWindow.getResources(function(res){
                
                //Get urls from each stylesheet
				var stylesheets = [];
                getAssetUrls(res.length - 1);
                function getAssetUrls(index) {
                    if (index > 0) {
                        res[index].getContent(function(content){
							if (res[index].type == "stylesheet") {
								stylesheets.push(getUrlsFromStylesheet(content, res[index].url));
							}
                            getAssetUrls(index - 1);
                        })
                    } else {
						// Send urls to dev tools panel
                        _window.setResources(stylesheets, folder_name);
                    }
                }
                
			})
				
			// Download All Items function
			_window.downloadAllAssets = function(assets, folder) {
				port.postMessage({action: "downloadAllAssets", assets: assets, length: (assets.length - 1), folder: folder_name + "_Assets/" + folder});
			};
			
			// Download Single Item function
			_window.downloadSingleAsset = function(asset, folder) {
				port.postMessage({action: "downloadSingleAsset", asset: asset, folder: folder_name + "_Assets/" + folder});
			};
			
		});

	});



/* Functions
******************************/
function getUrlsFromStylesheet(stylesheet, stylesheet_url) {
	var stylesheet_url_object = new URL(stylesheet_url, window_url),
			hostname = stylesheet_url_object.protocol + "//" + stylesheet_url_object.hostname + "/" + stylesheet_url_object.pathname,
			urls = new Object();

	//Build urls object
	urls.stylesheet = stylesheet_url;
	urls.fonts = fixUrls(stylesheet.match(FONT_REGEX), hostname);
	urls.images = fixUrls(stylesheet.match(IMAGE_REGEX), hostname);
	
	return urls;
}


function fixUrls(assets, hostname) {
	var urls = [];
		if (assets != null) {
		assets.forEach(function(item, index) {
			//Modify the URL from stylesheet
			var resource = assets[index].replace(/url\((.*?)\)/g, '$1').replace(/'/g, "").replace(/"/g, "").replace(/\s/g, "").replace(/^(\/\/)/g, ""),
				host = hostname;
				
			// Change hostname if needed
			if (resource.match(/^[^/^.][a-zA-Z0-9]*?\.[^/]*?\//) != null) {
				host = "http://" + resource.match(/[^/]*\//)[0];
				resource = resource.replace(/[^/]*\//, "");
			}
			var resource_object = new URL(resource, host);
			
			// Add to urls array if it isn't there yet
			if (urls.indexOf(resource_object.href) == -1) {
				urls.push(resource_object.href);
			}
		})
	}
	return urls;
}