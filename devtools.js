/* TODO:
	- Add angular
	- tree structure for each stylesheet
	- parse and get all asset URLs before passing to contenScript - so it doesn't do it twice
	- field for folder name
*/


var FONT_REGEX = /url\([^\)]*?(\.eot|\.woff|\.woff2|\.svg|\.otf|\.ttf)[^\)]*?\)/ig,
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
				 if (msg.action == "doneDownloadingFile") {
                     // Callback to window after file download
                    _window.doneDownloadingFile({index: msg.index, count: msg.count, folder: msg.type, length: msg.length});
				} else if (msg.action =="returnDataUri") {
                    // Callback to window with font Data URI
                    _window.setFontDataUri({data: msg.data, index: msg.index, count: msg.count});
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
				folder_name = result.replace(/\s/g, "_").replace(/\|/g, "").replace(/\:/g, "");
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
			
			// Download Single Item function
			_window.downloadSingleAsset = function(asset, folder, index, count, length) {
				port.postMessage({action: "downloadSingleAsset", asset: asset, folder: folder_name + "_Assets/" + folder, type: folder, index: index, count: count, length: length});
			};
            
            // Get Data Uri
            _window.getDataUriXhr = function(url, index, count) {
				port.postMessage({action: "getDataUriXhr", url: url, index: index, count: count});
            }
			
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
	urls.categories = {};
	urls.categories.fonts = fixUrls(stylesheet.match(FONT_REGEX), hostname);
	urls.categories.images = fixUrls(stylesheet.match(IMAGE_REGEX), hostname);
	
	return urls;
}


function fixUrls(assets, hostname) {
	var urls = [],
        urlCheck = [];
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
			var resource_url = resource_object.href.split('?')[0]
			
			// Add to urls array if it isn't there yet
			if (urlCheck.indexOf(resource_url) == -1) {
                var returnObj = {url : resource_url};
				urls.push(returnObj);
                urlCheck.push(resource_url);
			}
		})
	}
	return urls;
}