
// see also: https://github.com/infrared5/red5pro-plugins/tree/feature/ZIXI-10/restreamer-plugin


// internal, used below
// POST the given jsonRequest back to the server (using a relative URL)
function postZixiRestreamerRequestHandler(jsonRequest, handler) {
	// POST request to server
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() { 
		handler(xhttp);
	};
	const url = "/live/restream";
	console.log("POST " + url);
	xhttp.open("POST", url, false); // false: one at a time, synchronous, wait for response
	xhttp.setRequestHeader("Content-type", "application/json");

	console.log("update request: " + jsonRequest);
	xhttp.send(jsonRequest);
}

function postZixiRestreamerRequest(jsonRequest) {
	const handler = function(xhttp) {
	  if (xhttp.readyState == 4) {
		  if (xhttp.status == 200) {
		  		console.log("OKAY:\n", xhttp.response);
		  } else {
	        	try {
	        		const responseObj = JSON.parse(xhttp.response);
	        		console.log("Errror:\n", JSON.stringify(responseObj, null, 4)); // pretty
	        	} catch (e) {
		            console.log("Error:\n", xhttp.response);
	        	}
		  }
	  }
	};
	
	postZixiRestreamerRequestHandler(jsonRequest, handler);
}


// Zixi pull create
// guid - A unique to zixi-api identifier within the server node.
// context - red5pro stream context name (aka "scope").
// streamName - red5pro stream name.
// abrLevel - ABR priority level. 0 for single non-ABR stream.
// zixiUri - URI format: zixi://[user[:password]@]server[:port]/channel

// sessionId - Optional. A session identifier that will be used for authrization.
// latency - Optional. Maximum latency, higher values allow more time for error correction.
// ignoreDtlsErrors - Optional. Ignore certificate error on dtls connection. default is true.
// dtlsOnly - Optional. Connect only using DTLS protocol, never fallback to unencrypted. default is false.
// ciphers - Optional. List of zero of more ciphers for DTLS handshake, in OpenSSL format but comma separated. Not specifying any will use defaults.
// aesType - Optional. Encryption mode integer. -1=none, 0 = AES_128, 1 = AES_192, 2 = AES_256, 3 = CHACHA20
// decryptKey - Optional. Decryption key for AES/chacha20 
function zixiPullCreate(guid, context, streamName, abrLevel, zixiUri, sessionId = null, latency = null, ignoreDtlsErrors = null, dtlsOnly = null, ciphers = null, aesType = null, decryptKey = null) {
	// required params
	const jsonRequest = {
		"guid":guid,
		"context":context,
		"name":streamName,
		"level":abrLevel,
		"isRestricted":false,
		"restrictions":[],
		"primaries":[],
		"secondaries":[],
		"parameters":{
			"type":"zixi",
			"action":"create",
			"zixiUri":zixiUri
		}
	};
	
	// optional params
	if (sessionId) {
		jsonRequest.parameters.sessionId = sessionId;
	}
	
	if (latency) {
		jsonRequest.parameters.latency = latency;
	}
	
	if (ignoreDtlsErrors != undefined) {
		jsonRequest.parameters.ignoreDtlsErrors = ignoreDtlsErrors;
	}
	
	if (dtlsOnly) {
		jsonRequest.parameters.dtlsOnly = dtlsOnly;
	}
	if (ciphers) {
		jsonRequest.parameters.ciphers = ciphers;
	}
	if (aesType) {
		jsonRequest.parameters.aesType = aesType;
	}
	if (decryptKey) {
		jsonRequest.parameters.decryptKey = decryptKey;
	}
	if (abrLevel) {
		jsonRequest.parameters.abrLevel = abrLevel;
	}
	
	postZixiRestreamerRequest(JSON.stringify(jsonRequest));
}

// Zixi pull stop
// guid - A unique to zixi-api identifier within the server node.
// context - red5pro stream context name (aka "scope").
// streamName - red5pro stream name.
function zixiPullStop(guid, context, streamName) {
	const jsonRequest = {
		"guid":guid,
		"context":context,
		"name":streamName,
		"level": 0,
		"isRestricted":false,
		"restrictions":[],
		"primaries":[],
		"secondaries":[],
		"parameters":{
			"type":"zixi",
			"action":"kill"
		}
	};

	postZixiRestreamerRequest(JSON.stringify(jsonRequest));
}

// Zixi pull list
function zixiPullList() {
	const jsonRequest = {
		"guid":"",
		"context":"",
		"name":"",
		"level": 0,
		"isRestricted":false,
		"restrictions":[],
		"primaries":[],
		"secondaries":[],
		"parameters":{
			"type":"zixi",
			"action":"list"
		}
	};

	postZixiRestreamerRequest(JSON.stringify(jsonRequest));
}


// Zixi push create
// guid - A unique to zixi-api identifier within the server node.
// context - red5pro stream context name (aka "scope").
// streamName - red5pro stream name.
// abrLevel - ABR priority level. 0 for single non-ABR stream.
// zixiHost - receiver host.
// latency - Milliseconds. Default latency is 500ms.
// streamId - stream id at receiver.
// aesType - Optional. Omit for non-encrypted. 0 = AES_128, 1 = AES_192, 2 = AES_256, 3 = CHACHA20
// decryptKey - Optional. Omit for non-encrypted. AES key.
function zixiPushCreate(guid, context, streamName, abrLevel, zixiHost, latency, streamId, aesType = null, decryptKey = null) {
	// required params
	const jsonRequest = {
		"guid":guid,
		"context":context,
		"name":streamName,
		"level":abrLevel,
		"isRestricted":false,
		"restrictions":[],
		"primaries":[],
		"secondaries":[],
		"parameters":{
			"type":"zixi-push",
			"action":"create",
			"host":zixiHost,
			"latency":latency,
			"streamId":streamId
		}
	};

	// optional params
	if (aesType) {
		jsonRequest.parameters.aesType = aesType;
	}
	if (decryptKey) {
		jsonRequest.parameters.decryptKey = decryptKey;
	}

	postZixiRestreamerRequest(JSON.stringify(jsonRequest));
}


// Zixi push stop
// guid - A unique to zixi-api identifier within the server node.
// context - red5pro stream context name (aka "scope").
// streamName - red5pro stream name.
function zixiPushStop(guid, context, streamName) {
	const jsonRequest = {
		"guid":guid,
		"context":context,
		"name":streamName,
		"level": 0,
		"isRestricted":false,
		"restrictions":[],
		"primaries":[],
		"secondaries":[],
		"parameters":{
			"type":"zixi-push",
			"action":"kill"
		}
	};

	postZixiRestreamerRequest(JSON.stringify(jsonRequest));
}


// Zixi push list
function zixiPushList() {
	const jsonRequest = {
		"guid":"",
		"context":"",
		"name":"",
		"level": 0,
		"isRestricted":false,
		"restrictions":[],
		"primaries":[],
		"secondaries":[],
		"parameters":{
			"type":"zixi-push",
			"action":"list"
		}
	};

	postZixiRestreamerRequest(JSON.stringify(jsonRequest));
}

