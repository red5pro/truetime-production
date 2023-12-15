# TrueTime MultiView™ for Production

With TrueTime MultiView™ for Production, create custom displays of live streams. Switch between feeds, rely on full synchronization, and enjoy sub-400ms latency.

This is a low-latency video mixer that runs on a server, creating a dynamic combined output stream for viewers from many live input streams.

## Design

The mixer consists of three parts. The **BrewMixer WebApp** serves a RESTful front end to create, modify, and destroy mixers. This is backed by the **NodeMixer Plugin** which makes up the service layer, interacting with the Red5Pro server to create and route stream data. And finally, the **Native** layer where low-level data operations occur.

User applications control the mixer using a graph-based "RenderTree", which allows modular video positioning and sizing as well as an audio mixing graph controlling the volume and panning of various sources.

### WebApp

The BrewMixer webapp serves the RESTful BrewMixer API. Source code is provided as an example so that users can learn how to interact directly with the mixer using their own custom webapps, effectively bypassing or reimplementing the BrewMixer API.

The WebApp also includes an example controller page, `renderTreeController.html`, which shows how to construct a RenderTree in JavaScript and make calls through the REST API. The page also allows users to edit the JSON RenderTree by hand to submit to the server, for easy experimentation.

### Plugin

The NodeMixer Plugin is a Red5Pro Plugin making up the service layer. It handles the interaction with Red5Pro internals to begin Brew decoding of incoming streams and to coordinate the native layer with the outbound encoder, providing raw video and audio data.

### Native

The native layer performs the low-level tasks of compositing video and mixing audio. It uses OpenCV for CPU-based image compositing.

## BrewMixer API

[BrewMixer API documentation](doc/BrewMixer_REST_API.md) can be found separately.

## How to install

Install on a standalone RedPro server using Ubuntu 22.04.

In the `red5pro/extras/` directory, find the `brewmixer/` folder. Find the `node-mixer-standalone-deploy.sh` script. Execute this script from within `red5pro/extras/brewmixer` (as present working directory).

This script installs the BrewMixer components and also performs some basic configuration steps. When the script has finished, restart your Red5Pro server (e.g., with `sudo systemctl restart red5pro`).

Installation is complete.

### Install steps

The install script performed several steps, explained here. If you just wish to try out the mixer, skip ahead to **How to Test** below.

#### Deploy the plugin

The plugin JAR is copied to `red5pro/plugins/`, and the native components are unzipped into `red5pro/plugins/nodemixer/`.

### Deploy the webapp

The `red5pro/brewmixer/brewmixer/` folder (an exploded WAR) is copied into `red5pro/webapps/`.

### Modify for standalone

The script removes the Stream Manager webapp and configures the cluster node type to `off`, disabling the Cluster Plugin. This prevents some irrelevant errors and using the `off` cluster node type rather than `auto` prevents certain cluster-only operations from occuring (and disables digest security in the BrewMixer API).

## How to test

Assuming you have installed on `localhost`, navigate to `http://localhost:5080/brewmixer/renderTreeController.html`

Note this HTTP connection and unsecure port 5080, otherwise the page mixes unsecure content.

Information about using the [RenderTree Controller](doc/RenderTreeController.md) can be found in its own document.

## Configuration





