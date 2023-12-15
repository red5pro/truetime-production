// Grid-based control functions for ZenMaster integration


// internal, used below
// send the renderTree to the server
function innerUpdateServerrenderTree(mixName, renderTree) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4) {
		  if (this.status == 200) {
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
	const url = "/brewmixer/1.0/" + mixName;
	console.log("PUT " + url);
	xhttp.open("PUT", url, false); // false: one at a time, synchronous, wait for response
	xhttp.setRequestHeader("Content-type", "application/json");

	var jsonRequest = JSON.stringify({
		"rootNodes": [renderTree]
	}); // the request contains an array of one renderTree
	console.log("update request: " + jsonRequest);
	xhttp.send(jsonRequest);		
}


// Create new mixer
// mixName - used to for eventId (== mixName) and to create stream GUID ("live/" + mixName)
// outputWidth - output video dimension in pixels
// outputHeight - output video dimension in pixels
// bitrate - video bitrate in bits per second
// maxbitrate - maximum ideo bitrate in bits per second
// qpmin - h264 encoder param
// qpmax - h264 encoder param
// framerate - video frame rate
// audiorate - audio sample rate
async function create(mixName, outputWidth, outputHeight, bitrate, qpmin, qpmax, maxbitrate, framerate, audiorate) {
	var streamGuid = "live/" + mixName;

	// start the mixer
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = async function() {
		if (this.readyState == 4) {
			if (this.status == 201) {
				console.log("newMixer response: " + this.responseText);
				
				// create the default renderTree
				var renderTree = {
								    "rootVideoNode": {
								      "nodes": [
								        {
								          "red": 0,
								          "green": 0,
								          "blue": 0,
								          "alpha": 1,
								          "node": "SolidColorNode"
								        }
								      ],
								      "node": "CompositorNode"
								    },
								    "rootAudioNode": {
								      "nodes": [
								      ],
								      "node": "SumNode"
								    }
								  };
				
				// create gridWidth * gridHeight video and audio source nodes
				// XXX acutally, we don't have any sources yet so, don't do that.				
				
				innerUpdateServerrenderTree(mixName, renderTree);
				
			} else if (xhttp.status >= 300) {
	        	try {
	        		const responseObj = JSON.parse(xhttp.response);
	        		console.log("Errror:\n", JSON.stringify(responseObj, null, 4)); // pretty
	        	} catch (e) {
		            console.log("Error:\n", xhttp.response);
	        	}
			}
	    }
	};
	
	var streamPath = streamGuid.split("/")[0];
	var streamName = mixName;
	var eventId = mixName;

	const url = "/brewmixer/1.0/" + eventId;
	console.log("POST " + url);
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type", "application/json");

	xhttp.send(JSON.stringify(
		{
			"event": eventId,
			"path": streamPath,
			"streamName": streamName,
			"width": outputWidth,
			"height": outputHeight,
			"frameRate": framerate,
			"bitRate": bitrate,
			"maxBitRate": maxbitrate,
			"qpMin": qpmin,
			"qpMax": qpmax,
			"audioSampleRate": audiorate,
			"audioChannels": 2,
			"subMixes": 1,
			"doForward": false
		}				
	));
}


// Update an existing mixer with the given grid 
// This function demonstrates how to create a valid RenderTree where the sources are arranged in a grid.
// outputWidth - the mixer video width, in pixels (must be the same as originally specified)
// outputHeight - the mixer video height, in pixels (must be the same as originally specified)
// gridWidth - grid width, in cells (can be different than originally specified)
// gridHeight - grid height, in cells (can be different than originally specified)
// gridSources - grid sources (row first, each element a String or null, the streamGuid of the source video for that cell, if any)
function update(mixName, outputWidth, outputHeight, gridWidth, gridHeight, gridSources) {
	var renderTree =  {
					    "rootVideoNode": {
					      "nodes": [
					        {
					          "red": 0,
					          "green": 0,
					          "blue": 0,
					          "alpha": 1,
					          "node": "SolidColorNode"
					        }
					      ],
					      "node": "CompositorNode"
					    },
					    "rootAudioNode": {
					      "nodes": [
					      ],
					      "node": "SumNode"
					    }
					  };

	const cellWidth = Math.floor(outputWidth / gridWidth);
	const cellHeight = Math.floor(outputHeight / gridHeight);

    // calculate 0dB total, divided by number of sources
    gain = 20.0 * Math.log10(1.0 / (gridWidth * gridHeight));

	for (j = 0; j < gridHeight; j++) {
		for (i = 0; i < gridWidth; i++) {
			if (gridSources[j * gridWidth + i]) {
				// add a video node for this source
				renderTree.rootVideoNode.nodes.push(
			        {
			          "node": "VideoSourceNode",
			          "streamGuid": gridSources[j * gridWidth + i],
			          "sourceX": 0,
			          "sourceY": 0,
			          "sourceWidth": 1920,
			          "sourceHeight": 1080,
			          "destX": i * cellWidth,
			          "destY": j * cellHeight,
			          "destWidth": cellWidth,
			          "destHeight": cellHeight
			        }	);
			        
			    // also audio node
			    renderTree.rootAudioNode.nodes.push(
			    	{
					  "streamGuid": gridSources[j * gridWidth + i],
					  "pan": 0,
					  "gain": gain,
					  "node": "AudioSourceNode"
			    	}   );
		    }
		}
	}

	innerUpdateServerrenderTree(mixName, renderTree);
}


// internal, used below
// fetch the RenderTree for a given stream
async function fetchrenderTree(eventId) {
	const url = "/brewmixer/1.0/" + eventId;
	console.log("GET " + url);
	const response = await fetch(url).catch((error) => { console.log("hey i caught this error: " + error) });
	
	var result = null;
	if (response.ok) {
		result = await response.json(); 
		// console.log("renderTree RESPONSE: " + JSON.stringify(result, null, 4));
	} else {
		console.log("renderTree RESPONSE ERROR " + response.status);				
	}
	
	return result;
}

// Get the current grid
// (assumes RenderTree created by above update)
// returns grid sources (row first, each element a String or null, the streamGuid of the source video for that cell, if any)
async function getGrid(mixName, gridWidth, gridHeight) {
	// fetch RenderTree
	const renderTree = await fetchrenderTree(mixName);
	
/*	// figure out grid cells
	// find cells on the first row, and first column
	var firstRow = [];
	var firstCol = [];
	
	for (node of renderTree[0].rootVideoNode.nodes) {
		if (node.destX == 0) {
			firstCol.push(node);
		}
		if (node.destY == 0) {
			firstRow.push(node);
		}
	}
*/
	
// XXX this would only work if the grid were full.
//	const gridWidth = firstRow.length;
//	const gridHeight = firstCol.length;
	
//	const cellWidth = Math.floor(outputWidth / gridWidth);
//	const cellHeight = Math.floor(outputHeight / gridHeight);
	
	// cell width and height are those of any node currently in the grid
	// (or, if the grid is empty, then it doesn't matter).
	var firstSource = null;
	for (node of renderTree[0].rootVideoNode.nodes) {
		if (node.node === "VideoSourceNode") {
			firstSource = node;
			break;
		}
	}

	var cellWidth = 0;
	var cellHeight = 0;
	if (firstSource) {
		cellWidth = firstSource.destWidth;
		cellHeight = firstSource.destHeight;
	}
	
	var gridSources = Array.apply(null, Array(gridWidth * gridHeight))
	for (node of renderTree[0].rootVideoNode.nodes) {
		const i = Math.floor(node.destX / cellWidth);
		const j = Math.floor(node.destY / cellHeight);
		gridSources[j * gridWidth + i] = node.streamGuid;
	}
	
	console.log("grid sources: " + gridSources);
	
	return gridSources;
}

// 
function stopMixer(mixName) {
	console.log("Really stop mixer and end stream.");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				console.log("stopMixer response: OK");
			} else {
	        	try {
	        		const responseObj = JSON.parse(xhttp.response);
	        		console.log("Errror:\n", JSON.stringify(responseObj, null, 4)); // pretty
	        	} catch (e) {
		            console.log("Error:\n", this.status, e, xhttp.response);
	        	}
			}
		}
	};
	const url = "/brewmixer/1.0/" + mixName;
	console.log("DELETE " + url);
	xhttp.open("DELETE", url, true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send();
}

