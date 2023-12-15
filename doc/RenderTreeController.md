# Overview
This describes the example controller page for TrueTime Multiview (for Production).

Find the controller page at `http://localhost:5080/brewmixer/rtController.html`

# Create a New Mixer
When you load the controller page, the page checks the server to see if there is a stream named `live/mix1`. If so, a subscription is created and the **New Mixer** dialog is skipped.

Otherwise, if no mixer is found, the **New Mixer** dialog is displayed. The defaults are set correctly for the demo, so there is no need to change any values. Just click the green New Mixer button to create a mixer and subscribe to it.

The mixer adds `live/stream1` through `live/stream16` as source streams.

The default layout is a 2x2 grid and the default audio mix consists only of `stream1` (upper-left).

# Page Controls
On the page below the video player are various HTML controls.

### Layout
The layout control consists of three radio buttons for 2x2, 3x3, and 4x4 grids, respectively. Clicking a layout buttons creates a new RenderTree to change the layout. This changes the position of the source streams but does not modify the audio mix.

The grid is a row-first grid beginning with stream1 in the upper-left.

### Mute
The **Audio: Toggle Mute** button toggles the `<video>` component’s mute state, muting mixer subscriber video or unmuting it. This does not change the outbound audio mix (which streams are being mixed to produce output), it just mutes the local video player.

### Active RenderTree
This is a read-only control that shows the current RenderTree. Each time a new RenderTree is sent to the server, this text area is updated with the new JSON.

You can also edit this JSON and submit your own custom RenderTree (which is likely to break the overlay controls a bit because they assume a grid layout -- just use one of the **Layout** buttons to return to a regular layout and restore the overlay controls).

## Overlay Controls
When you click on the mixer, controls appear on an overlay. The controls outline the source you clicked (the grid cell). The source is moved to the top layer (it is drawn last by the mixer, on top of the other sources).

While the controls are visible, clicking outside the cell then hides the controls. Clicking an empty space within the cell has no effect.

Double-clicking at any time results in Zoom, see below.

### Corner Controls
There are arrows in each corner. These are drag handles. While a corner is dragged, it is blue. The corresponding corner of the source video is also dragged.

Note that there is some latency – the overlay controls are drawn by JavaScript in the browser, and then a RenderTree sent to the server, and then the new rendered frame is drawn, encoded, delivered to the client, enqueued, dequeued, decoded, and finally displayed. So, while dragging, a small amount of latency is normal. When you stop dragging, the mixer catches up and the source frame matches the desired size.

### Center Drag Handle
The circle in the center is a drag handle. When you click and drag the circle, the entire source cell is moved around.

Again, some latency is expected.

### Listen
Click the microphone icon to toggle this source in the audio mix.

All sources are at -6dB in the mix, so clipping may occur if you add more than two sources at once. (-6dB is half as loud as at full volume).

### Swap
An video source can be swapped for a different source using the swap button. When the button is clicked, the controller page requests the active streams from the server in app live. Then it removes stream1 through stream16 and also mix1, as well as any streams that have already been swapped in. The first remaining stream is used.

One a source has been swapped, the swap icon remains blue. When it is clicked a second time, the video source will “swap back” to the original source for that cell.

### Zoom
Double click a source to zoom full. Double click while zoomed full to return to the grid.

