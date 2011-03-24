//custom OpenLayers controls
OpenLayers.Control.ClickAddLocation = OpenLayers.Class(OpenLayers.Control, {
	defaultHandlerOptions: {
		'single': true,
		'double': false,
		'pixelTolerance': 0, //tolarance
		'stopSingle': false,
		'stopDouble': false
	}
	,
	initialize: function(options) {
		this.handlerOptions = OpenLayers.Util.extend(
			{}, this.defaultHandlerOptions
		);
		OpenLayers.Control.prototype.initialize.apply(this, arguments);
		this.handler = new OpenLayers.Handler.Click(this, {'click': this.trigger},this.handlerOptions);
	}
	,
	trigger: function(e) {
		var lonLat = Phi.Map.map.getLonLatFromViewPortPx(e.xy);

		var pointVO = {
			Lat: lonLat.lat,
			Lon: lonLat.lon,
			Zoom : Phi.Map.map.getZoom()
		};

		var marker = Phi.Marker.drawMarker(pointVO.Lon, pointVO.Lat, 'orange',null, 'new marker');

		var win = new Phi.view.window.Location({
			create: true,
			x: 100,
			y: 100,
			point: pointVO,
			marker: marker
		});
		win.show();
	}
});   // eo OpenLayers.Control.Click
// eof