/* TODO:
	- field for folder name
	- context menu - copy link location
	- progress bar for "Download All ..." buttons
	- optimize performance - insert stylesheet nodes into document as they are loaded
	- add font family, weight, and style information
*/


var FONT_REGEX = /url\([^\)]*?(\.eot|\.woff|\.woff2|\.otf|\.ttf)[^\)]*?\)/ig,
	IMAGE_REGEX = /url\([^\)]*?(\.jpg|\.png|\.gif)[^\)]*?\)/ig,
	FONT_SVG_REGEX = /@font-face[^\}]*?\{[^\}]*?(url\([^\)]*?(\.svg)[^\)]*?\)[^\}]*?\})/ig,
	FONT_SVG_REGEX_STRIP = /url\([^\)]*?(\.svg)[^\)]*?\)/ig,
	SVG_REGEX = /url\([^\)]*?(\.svg)[^\)]*?\)/ig,
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
				folder_name = result.replace(/\s/g, "_").replace(/[^a-zA-Z0-9\-_]/g, "");
			});
			
			//Get Stylesheet links
			chrome.devtools.inspectedWindow.getResources(function(res){
				
				//Get urls from each stylesheet
				var resources = {};
				resources.stylesheets = [];
				resources.scripts = [];
				resources.images = [];
				var imagesCheck = [];
				resources.fonts = [];
				getAssetUrls(res.length - 1);
				function getAssetUrls(index) {
					if (index > 0) {
						res[index].getContent(function(content){
							// Push to resources if the content was successfully retrieved
							if (content != null) {
								if (res[index].type == "stylesheet") {
									resources.stylesheets.push(getUrlsFromStylesheet(content, res[index].url));
								} else if (res[index].type == "image") {
									resources.images.push({url: res[index].url})
									imagesCheck.push(res[index].url);
								} else if (res[index].type == "script") {
									if (res[index].url.match(/\/\//) !== null) {
										var scriptUrl = new URL(res[index].url);
										if (scriptUrl.protocol == "http:" || scriptUrl.protocol == "https:") {
											resources.scripts.push({url: res[index].url})
										}
									}
								}
							}
							getAssetUrls(index - 1);
						})
					} else {
						// Get images from stylesheet and merge with images from getContent()
						mergeResources(resources, imagesCheck, "images", function(images){
						resources.images = images;
						
							// Add fonts from stylesheet to images array
							mergeResources(resources, [], "fonts", function(fonts){
								resources.fonts = fonts;
								// Send urls to dev tools panel
								_window.setResources(resources, folder_name);
							})

						});

					}
				}
				
			})
			
			// Download Single Item function
			_window.downloadSingleAsset = function(asset, folder, index, count, length) {
				port.postMessage({action: "downloadSingleAsset", asset: asset, folder: folder_name + "_Assets/" + folder, type: folder, index: index, count: count, length: length});
			};
			
			// Get Data Uri
			_window.getDataUriXhr = function(url, index) {
				port.postMessage({action: "getDataUriXhr", url: url, index: index});
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
	urls.url = stylesheet_url;
	urls.categories = {};
	urls.categories.fonts = getFixedUrls(stylesheet.match(FONT_REGEX), hostname);
	urls.categories.images = getFixedUrls(stylesheet.match(IMAGE_REGEX), hostname);
	
	//Find SVG Fonts and push to fonts array
	var svgFonts = stylesheet.match(FONT_SVG_REGEX);
	if (svgFonts != null) {
		svgFonts.forEach(function(item, index){
			var fixedSvg = fixUrl(item.match(FONT_SVG_REGEX_STRIP)[0], hostname);
			svgFonts[index] = fixedSvg;
			urls.categories.fonts.push({url: fixedSvg})
		})
	}
	
	//Find SVG Images and push to images array
	var svgImages = stylesheet.match(SVG_REGEX);
	if (svgImages != null) {
		svgImages.forEach(function(item, index){
			var fixedSvg = fixUrl(item, hostname);
			//Make sure the svg isn't a font
			if (svgFonts == null || svgFonts.indexOf(fixedSvg) == -1) {
				urls.categories.images.push({url: fixedSvg})
			}
		})
	}
	
	return urls;
}


function getFixedUrls(assets, hostname) {
	var urls = [],
		urlCheck = [];
		if (assets != null) {
		assets.forEach(function(item, index) {
			var resource_url = fixUrl(assets[index], hostname);
			
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

function fixUrl(asset, hostname) {
	//Modify the URL from stylesheet
	var resource = asset.replace(/url\((.*?)\)/g, '$1').replace(/'/g, "").replace(/"/g, "").replace(/\s/g, "").replace(/^(\/\/)/g, ""),
		host = hostname;
		
	// Change hostname if needed
	if (resource.match(/^[^/^.][a-zA-Z0-9]*?\.[^/]*?\//) != null) {
		host = "http://" + resource.match(/[^/]*\//)[0];
		resource = resource.replace(/[^/]*\//, "");
	}
	var resource_object = new URL(resource, host);
	var resource_url = resource_object.href.split('?')[0]
	return resource_url;
}

function mergeResources(resources, check, type, callback) {
	var stylesheetsEnd = 0;
	if (resources.stylesheets.length > 0) {
		resources.stylesheets.forEach(function(item, index){
			item.categories[type].forEach(function(res, resIndex){
				if (check.indexOf(res.url) == -1) {
					resources[type].push({url: res.url});
				}
			})
			if (++stylesheetsEnd == resources.stylesheets.length && typeof callback == "function") {
				callback(resources[type]);
			}
		})
	} else if (typeof callback == "function") {
		callback(resources[type]);
	}
}