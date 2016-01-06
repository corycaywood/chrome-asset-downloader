var IMAGE_DIRECTORY = "images",
    FONT_DIRECTORY = "fonts";

var ports = [];
chrome.runtime.onConnect.addListener(function(port) {
    if (port.name !== "devtools") return;
    ports.push(port);
    // Remove port when destroyed (eg when devtools instance is closed)
    port.onDisconnect.addListener(function() {
        var i = ports.indexOf(port);
        if (i !== -1) ports.splice(i, 1);
    });
    //On Message Received
    port.onMessage.addListener(function(msg) {
        //Download Assets
		if (msg.action == "downloadAllAssets") {
			downloadAllAssets(msg.assets, msg.length, msg.folder)
        } else if (msg.action == "downloadSingleAsset") {
			downloadSingleAsset(msg.asset, msg.folder)
		}
    });
});


// Function to send a message to all devtools.html views:
function notifyDevtools(msg) {
    ports.forEach(function(port) {
        port.postMessage(msg);
    });
}

//Download Assets function
function downloadAllAssets(assets, length, folder){
	downloadAsset(length);
	function downloadAsset(count) {
		//Download Resource
		downloadSingleAsset(assets[count], folder, function(){
			//Recursively download - so it will download one at a time
			if (count > 0) {
				downloadAsset(count - 1);
			} else {
				notifyDevtools({action: "doneDownloading"})
			}
		})
	}
}

//Download Single Asset function
function downloadSingleAsset(asset, folder, callback){
	chrome.downloads.download({url: asset, filename: folder + "/" + getFileName(asset)},function(downloadId){
		if (typeof callback == "function") {
			callback();
		}
	});
}

//Get File Name Function
function getFileName(url) {
	if (typeof url != "undefined") {
		url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
		url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
		url = url.substring(url.lastIndexOf("/") + 1, url.length);
	}
	return url;
}