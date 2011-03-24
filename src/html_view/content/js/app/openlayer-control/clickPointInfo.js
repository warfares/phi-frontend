//custom OpenLayers controls
OpenLayers.Control.ClickPointInfo = OpenLayers.Class(OpenLayers.Control, {
	defaultHandlerOptions: {
		'single': true,
		'double': false,
		'pixelTolerance': 0, //tolarance
		'stopSingle': false,
		'stopDouble': false
	}
	,
	initialize: function(options) {
		this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
		OpenLayers.Control.prototype.initialize.apply(this, arguments);
		this.handler = new OpenLayers.Handler.Click(
			this, {
				'click': this.trigger
				}, this.handlerOptions
		);
	}
	,
	trigger: function(e) {

		var lonLat = Philosophy.Map.map.getLonLatFromViewPortPx(e.xy);
		lonLat.transform(Philosophy.Map.map.getProjectionObject(), Philosophy.Map.mousePosition.displayProjection);

		var lon = new Number(lonLat.lon);
		var lat = new Number(lonLat.lat);

		var point = {
			Lat: lonLat.lat,
			Lon: lonLat.lon,
			Zoom : Philosophy.Map.map.getZoom()
		};

		Ext.MessageBox.show({
			maximizable: false,
			closable: false,
			resizable: false,
			title: '',
			msg: 'X :  <b>' + point.Lon + '</b><br/>Y :  <b>' + point.Lat + '</b><br/>Zoom :  <b>' + point.Zoom + '</b>',
			width: 300,
			buttons: Ext.MessageBox.OK
		});   
	}
	});// eo OpenLayers.Control.Click
// eof