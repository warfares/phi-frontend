//custom OpenLayers controls
OpenLayers.Control.BoxLayerInfo = OpenLayers.Class(OpenLayers.Control, {

	initialize: function (options) {
		this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
		OpenLayers.Control.prototype.initialize.apply(this, arguments);
		this.handler = new OpenLayers.Handler.Box(this,
			{ "done": this.notice },
			{ keyMask: this.keyMask, boxDivClassName: 'olHandlerBoxZoomBoxBlue' });
	},

	notice: function (bounds) {

		var lt = Phi.Map.map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.left, bounds.top));
		var rb = Phi.Map.map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.right, bounds.bottom));

		var layersVO = [];
		Ext.each(Phi.Layer.appliedLayers, function (l) {
			var o = {
				name: l.name,
				srid: l.srid
			}
			layersVO.push(o);
		}, this);

		// this go with map proyeccion (WSM)
		var bboxVO = {
			xmin: lt.lon,
			ymin: rb.lat,
			xmax: rb.lon,
			ymax: lt.lat
		};

		var showResults = function(result){
			var win = new Phi.view.window.GenericLayersGrid({
				title: '',
				data: result.entities,
				width: 300,
				height: 300
			});
			
			win.show();
		};

		var group = new Geo.core.Group();
		group.on('withinbbox', showResults, this);
		group.getWithInBBox(layersVO, bboxVO);
	}
});