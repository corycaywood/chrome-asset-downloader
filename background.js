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
		if (msg.action == "downloadSingleAsset") {
			downloadSingleAsset(msg.asset, msg.folder, function(){
                notifyDevtools({action: "doneDownloadingFile", index: msg.index, count: msg.count, type: msg.type, length: msg.length});
            })
		} else if (msg.action == "getDataUriXhr") {
            getDataUriXhr(msg.url, function(dataUri){
                notifyDevtools({action: "returnDataUri", data: dataUri, index: msg.index, count: msg.count});
            });

        }
    });
});


// Function to send a message to all devtools.html views:
function notifyDevtools(msg) {
    ports.forEach(function(port) {
        port.postMessage(msg);
    });
}


//Download Single Asset function
function downloadSingleAsset(asset, folder, callback){
	chrome.downloads.download({url: asset, filename: folder + "/" + getFileName(asset)}, function(downloadId){
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

//Download with XHR
function getDataUriXhr(url, callback) {
    function handler() {
        if (req.readyState == 4 /* complete */) {
            if (req.status == 200) {
                if (typeof callback === "function"){
                    callback("data:" + req.getResponseHeader('content-type') + ";charset=utf-8;base64," + convertToBase64(req.response));
                }
            }
        }
    }
    var req = new XMLHttpRequest();
    if (req != null) {
        req.open("GET", url, true);
        req.responseType = 'arraybuffer';
        req.onload = handler;
        req.send();
    } else {
        window.console.log("AJAX (XMLHTTP) not supported.");
    }
}

//Convert to Base64
function convertToBase64(arrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }

  return base64
}