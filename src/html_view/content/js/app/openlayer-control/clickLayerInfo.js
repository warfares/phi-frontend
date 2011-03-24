//Custom OpenLayers controls
OpenLayers.Control.ClickLayerInfo = OpenLayers.Class(OpenLayers.Control, {
	defaultHandlerOptions: {
		'single': true,
		'double': false,
		'pixelTolerance': 0, //tolarance
		'stopSingle': false,
		'stopDouble': false
	}
	,
	initialize: function (options) {
		this.handlerOptions = OpenLayers.Util.extend( {}, this.defaultHandlerOptions);
		OpenLayers.Control.prototype.initialize.apply( this, arguments);
		
		this.handler = new OpenLayers.Handler.Click( this, {
			'click': this.trigger
		}, this.handlerOptions);
	}
	,
	trigger: function (e) {
		var lonLat = Phi.Map.map.getLonLatFromViewPortPx(e.xy);

		var r = Phi.Map.map.getResolution(); // unit per pixel
		var dist = r * 5; // 5 pixel buffer
		var fields = 'gid';

		var layers = [];
		Ext.each(Phi.Layer.appliedLayers, function (l) {
			var o = {name: l.name, srid: l.srid};
			layers.push(o);
		}, this);

		// WSM
		var point = {
			x: lonLat.lon,
			y: lonLat.lat
		};
		
		var showResults = function(result){
			var win = new Phi.view.window.GenericGeomGrid({
				title: '',
				data: result,
				width: 300,
				height: 300
			});
			win.show();
		};

		var group = new Geo.core.Group();
		group.on('withinpoint', showResults, this);
		group.getWithInPoint(layers, fields, point, dist);
		
	}
}); //eo OpenLayers.Control.Click
