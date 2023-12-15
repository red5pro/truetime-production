# Zixi Grid and Restreamer Examples

Provided files:
* `zixiController.html` - loads the two JavaScript files
* `zixiGrid.js` - Grid examples
* `zixiRestreamer.js` - Restreamer examples

## Grid Examples `zixiGrid.js`

Demonstrates how to create a mixer and how to create grid layouts.

### Create Mixer
Create a new, empty mixer.
```
async function create(mixName, outputWidth, outputHeight, bitrate, qpmin, qpmax, maxbitrate, framerate, audiorate) 
```

`mixName` - used for stream GUID (`"live/" + mixName`) and eventId (`== mixName`)
`outputWidth` - output video dimension in pixels
`outputHeight` - output video dimension in pixels
`bitrate` - video bitrate in bits per second
`maxbitrate` - maximum ideo bitrate in bits per second
`qpmin` - h264 encoder param
`qpmax` - h264 encoder param
`framerate` - video frame rate
`audiorate` - audio sample rate


### Update Grid
Next, update the mixer with sources. You must again specify the mixer output video dimensions, as well as the grid size and finally sources. Sources are nullable.

Internally, the mixer uses a RenderTree data structure where video sources can be placed arbitrarily. This function demonstrates how to create a valid RenderTree where the sources are arranged in a grid.
```
function update(mixName, outputWidth, outputHeight, gridWidth, gridHeight, gridSources)
```

`mixName` - the mixer name as specified during `create(...)`
`outputWidth` - the mixer video width, in pixels (must be the same as originally specified)
`outputHeight` - the mixer video height, in pixels (must be the same as originally specified)
`gridWidth` - grid width, in cells (can be different than originally specified)
`gridHeight` - grid height, in cells (can be different than originally specified)
`gridSources` - grid sources (row first, each element a String or null, the streamGuid of the source video for that cell, if any)


### Get Grid Sources
Retrieve the RenderTree from the server and interpret it as a grid of the given dimensions. 

```
async function getGrid(mixName, gridWidth, gridHeight)
```

`mixName` - the mixer name as specified during `create(...)`
`gridWidth` - grid width, in cells (must be the same as most recently specified by `update(...)`)
`gridHeight` - grid width, in cells (must be the same as most recently specified by `update(...)`)


### Stop Mixer
Stop the given mixer.

```
stopMixer(mixName)
```

`mixName` - the mixer name as specified during `create(...)`


## Restreamer Examples `zixiRestreamer.js`

These restreamer examples show how to make requests to the restreamer plugin to push or pull streams to/from Zixi.


### Push Create
Push a stream from Red5Pro to Zixi:
```
function zixiPushCreate(guid, context, streamName, abrLevel, zixiHost, latency, streamId, aesType = null, decryptKey = null)
```

`guid` - A unique to zixi-api identifier within the server node.
`context` - red5pro stream context name (aka "scope").
`streamName` - red5pro stream name.
`abrLevel` - ABR priority level. `0` for single non-ABR stream.
`zixiHost` - receiver host.
`latency` - Milliseconds. Default latency is 500ms.
`streamId` - stream id at receiver.
`aesType` - Optional. Omit for non-encrypted. 0 = AES_128, 1 = AES_192, 2 = AES_256, 3 = CHACHA20
`decryptKey` - Optional. Omit for non-encrypted. AES key.


### Push List
List pushed streams:
```
function zixiPushList()
``` 


### Push Stop
Stop pushing:
```
function zixiPushStop(guid, context, streamName)
```

`guid` - A unique to zixi-api identifier within the server node.
`context` - red5pro stream context name (aka "scope").
`streamName` - red5pro stream name.

### Pull Create
Pull a stream from Zixi to Red5Pro:
```
function zixiPullCreate(guid, context, streamName, abrLevel, zixiUri, sessionId, latency, ignoreDtlsErrors = null, dtlsOnly = null, ciphers = null, aesType = null, decryptKey = null)
```

`guid` - A unique to zixi-api identifier within the server node.
`context` - red5pro stream context name (aka "scope").
`streamName` - red5pro stream name.
`abrLevel` - ABR priority level. `0` for single non-ABR stream.
`zixiUri` - URI format: `zixi://[user[:password]@]server[:port]/channel`

`sessionId` - Optional. A session identifier that will be used for authorization.
`latency` - Optional. Maximum latency, higher values allow more time for error correction.
`ignoreDtlsErrors` - Optional. Ignore certificate error on dtls connection. default is true.
`dtlsOnly` - Optional. Connect only using DTLS protocol, never fallback to unencrypted. default is false.
`ciphers` - Optional. List of zero of more ciphers for DTLS handshake, in OpenSSL format but comma separated. Not specifying any will use defaults.
`aesType` - Optional. Encryption mode integer. -1=none, 0 = AES_128, 1 = AES_192, 2 = AES_256, 3 = CHACHA20
`decryptKey` - Optional. Decryption key for AES/chacha20 


### Pull List
List pulled streams:
```
zixiPullList()
```


### Pull Stop
Stop pulling:
```
function zixiPullStop(guid, context, streamName)
```

`guid` - A unique to zixi-api identifier within the server node.
`context` - red5pro stream context name (aka "scope").
`streamName` - red5pro stream name.

